// GitHub API service for repository management
export interface GitHubRepository {
	id: number;
	name: string;
	full_name: string;
	description: string | null;
	html_url: string;
	clone_url: string;
	ssh_url: string;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	watchers_count: number;
	size: number;
	default_branch: string;
	topics: string[];
	created_at: string;
	updated_at: string;
	pushed_at: string;
	private: boolean;
	fork: boolean;
	archived: boolean;
	disabled: boolean;
	visibility: "public" | "private";
	owner: {
		login: string;
		id: number;
		avatar_url: string;
		html_url: string;
		type: "User" | "Organization";
	};
	license: {
		key: string;
		name: string;
		spdx_id: string;
	} | null;
}

export interface GitHubLanguageStats {
	[language: string]: number;
}

export interface GitHubUser {
	login: string;
	id: number;
	avatar_url: string;
	html_url: string;
	name: string | null;
	company: string | null;
	blog: string | null;
	location: string | null;
	email: string | null;
	bio: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
}

export interface GitHubApiError {
	message: string;
	documentation_url?: string;
	status: number;
}

export interface GitHubRateLimit {
	limit: number;
	remaining: number;
	reset: number;
	used: number;
}

// Cache interface
interface CacheEntry<T> {
	data: T;
	timestamp: number;
	ttl: number; // Time to live in milliseconds
}

export class GitHubService {
	private baseUrl = "https://api.github.com";
	private token: string | null = null;
	private cache = new Map<string, CacheEntry<any>>();
	private defaultCacheTTL = 5 * 60 * 1000; // 5 minutes
	private retryAttempts = 3;
	private baseRetryDelay = 1000; // 1 second
	private readonly tokenStorageKey = "github-token";

	constructor(token?: string) {
		this.token = token || this.loadTokenFromStorage();
	}

	/**
	 * Load token from localStorage
	 */
	private loadTokenFromStorage(): string | null {
		if (typeof window === "undefined") return null;

		try {
			return localStorage.getItem(this.tokenStorageKey);
		} catch (error) {
			console.warn("Failed to load GitHub token from storage:", error);
			return null;
		}
	}

	/**
	 * Save token to localStorage
	 */
	private saveTokenToStorage(token: string): void {
		if (typeof window === "undefined") return;

		try {
			localStorage.setItem(this.tokenStorageKey, token);
		} catch (error) {
			console.warn("Failed to save GitHub token to storage:", error);
		}
	}

	/**
	 * Remove token from localStorage
	 */
	private removeTokenFromStorage(): void {
		if (typeof window === "undefined") return;

		try {
			localStorage.removeItem(this.tokenStorageKey);
		} catch (error) {
			console.warn("Failed to remove GitHub token from storage:", error);
		}
	}

	/**
	 * Set GitHub Personal Access Token
	 */
	setToken(token: string): void {
		this.token = token;
		this.saveTokenToStorage(token);
	}

	/**
	 * Get current token
	 */
	getToken(): string | null {
		return this.token;
	}

	/**
	 * Clear all cached data
	 */
	clearCache(): void {
		this.cache.clear();
	}

	/**
	 * Get cached data if available and not expired
	 */
	private getCachedData<T>(key: string): T | null {
		const entry = this.cache.get(key);
		if (!entry) return null;

		const now = Date.now();
		if (now > entry.timestamp + entry.ttl) {
			this.cache.delete(key);
			return null;
		}

		return entry.data;
	}

	/**
	 * Set cached data with TTL
	 */
	private setCachedData<T>(key: string, data: T, ttl: number = this.defaultCacheTTL): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
			ttl,
		});
	}

	/**
	 * Sleep for specified milliseconds
	 */
	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Calculate exponential backoff delay
	 */
	private calculateBackoffDelay(attempt: number): number {
		return this.baseRetryDelay * Math.pow(2, attempt) + Math.random() * 1000;
	}

	/**
	 * Check if error is retryable
	 */
	private isRetryableError(error: GitHubApiError): boolean {
		// Retry on rate limit, server errors, and network errors
		return (
			error.status === 429 || // Rate limit
			error.status >= 500 || // Server errors
			error.status === 0
		); // Network errors
	}

	/**
	 * Get user-friendly error message
	 */
	private getUserFriendlyErrorMessage(error: GitHubApiError): string {
		switch (error.status) {
			case 401:
				return "GitHub token is invalid or expired. Please check your token and try again.";
			case 403:
				if (error.message.includes("rate limit")) {
					return "GitHub API rate limit exceeded. Please wait a few minutes before trying again.";
				}
				return "Access forbidden. Please check your token permissions.";
			case 404:
				return "Repository or resource not found. Please check the repository name and your access permissions.";
			case 422:
				return "Invalid request. Please check your input parameters.";
			case 429:
				return "Too many requests. Please wait a moment before trying again.";
			case 0:
				return "Network connection failed. Please check your internet connection and try again.";
			default:
				if (error.status >= 500) {
					return "GitHub servers are experiencing issues. Please try again later.";
				}
				return error.message || "An unexpected error occurred.";
		}
	}

	/**
	 * Make authenticated request to GitHub API with retry logic
	 */
	private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;

		const headers: Record<string, string> = {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "Projects-Management-App",
		};
		if (options.headers) {
			const h = new Headers(options.headers as any);
			h.forEach((value, key) => {
				headers[key] = value;
			});
		}

		if (this.token) {
			headers["Authorization"] = `Bearer ${this.token}`;
		}

		let lastError: GitHubApiError = { message: "Unknown error", status: 0 } as GitHubApiError;

		for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
			try {
				const response = await fetch(url, {
					...options,
					headers,
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					const error: GitHubApiError = {
						message:
							errorData.message || `HTTP ${response.status}: ${response.statusText}`,
						documentation_url: errorData.documentation_url,
						status: response.status,
					};

					// Handle rate limiting with Retry-After header
					if (response.status === 429) {
						const retryAfter = response.headers.get("Retry-After");
						const resetTime = response.headers.get("X-RateLimit-Reset");

						if (retryAfter) {
							const waitTime = parseInt(retryAfter) * 1000;
							if (attempt < this.retryAttempts) {
								await this.sleep(waitTime);
								continue;
							}
						} else if (resetTime) {
							const waitTime = parseInt(resetTime) * 1000 - Date.now();
							if (waitTime > 0 && waitTime < 60000 && attempt < this.retryAttempts) {
								// Max 1 minute wait
								await this.sleep(waitTime);
								continue;
							}
						}
					}

					lastError = error;

					// Retry on retryable errors
					if (attempt < this.retryAttempts && this.isRetryableError(error)) {
						const delay = this.calculateBackoffDelay(attempt);
						await this.sleep(delay);
						continue;
					}

					// Enhance error message for final attempt
					error.message = this.getUserFriendlyErrorMessage(error);
					throw error;
				}

				return await response.json();
			} catch (error) {
				if (error instanceof Error && "status" in error) {
					lastError = error as GitHubApiError;

					// Retry on retryable errors
					if (attempt < this.retryAttempts && this.isRetryableError(lastError)) {
						const delay = this.calculateBackoffDelay(attempt);
						await this.sleep(delay);
						continue;
					}

					throw error; // Re-throw GitHub API errors
				}

				// Handle network errors
				const networkError: GitHubApiError = {
					message: `Network error: ${
						error instanceof Error ? error.message : "Unknown error"
					}`,
					status: 0,
				};

				lastError = networkError;

				// Retry network errors
				if (attempt < this.retryAttempts) {
					const delay = this.calculateBackoffDelay(attempt);
					await this.sleep(delay);
					continue;
				}

				networkError.message = this.getUserFriendlyErrorMessage(networkError);
				throw networkError;
			}
		}

		// This should never be reached, but just in case
		throw lastError;
	}

	/**
	 * Test API connection and token validity
	 */
	async testConnection(): Promise<{
		success: boolean;
		user?: GitHubUser;
		error?: string;
	}> {
		try {
			if (!this.token) {
				return { success: false, error: "No GitHub token provided" };
			}

			const user = await this.getCurrentUser();
			return { success: true, user };
		} catch (error) {
			const apiError = error as GitHubApiError;
			return {
				success: false,
				error: apiError.message || "Failed to connect to GitHub API",
			};
		}
	}

	/**
	 * Get current authenticated user
	 */
	async getCurrentUser(): Promise<GitHubUser> {
		const cacheKey = "user:current";
		const cached = this.getCachedData<GitHubUser>(cacheKey);
		if (cached) return cached;

		const user = await this.makeRequest<GitHubUser>("/user");
		this.setCachedData(cacheKey, user, 10 * 60 * 1000); // Cache for 10 minutes
		return user;
	}

	/**
	 * Get user repositories
	 */
	async getUserRepositories(
		username?: string,
		options: {
			type?: "all" | "owner" | "member";
			sort?: "created" | "updated" | "pushed" | "full_name";
			direction?: "asc" | "desc";
			per_page?: number;
			page?: number;
		} = {}
	): Promise<GitHubRepository[]> {
		const {
			type = "owner",
			sort = "updated",
			direction = "desc",
			per_page = 100,
			page = 1,
		} = options;

		const endpoint = username ? `/users/${username}/repos` : "/user/repos";
		const params = new URLSearchParams({
			type,
			sort,
			direction,
			per_page: per_page.toString(),
			page: page.toString(),
		});

		const cacheKey = `repos:${username || "current"}:${params.toString()}`;
		const cached = this.getCachedData<GitHubRepository[]>(cacheKey);
		if (cached) return cached;

		const repositories = await this.makeRequest<GitHubRepository[]>(
			`${endpoint}?${params.toString()}`
		);

		this.setCachedData(cacheKey, repositories);
		return repositories;
	}

	/**
	 * Get repository details
	 */
	async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
		const cacheKey = `repo:${owner}/${repo}`;
		const cached = this.getCachedData<GitHubRepository>(cacheKey);
		if (cached) return cached;

		const repository = await this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
		this.setCachedData(cacheKey, repository);
		return repository;
	}

	/**
	 * Get repository languages
	 */
	async getRepositoryLanguages(owner: string, repo: string): Promise<GitHubLanguageStats> {
		const cacheKey = `languages:${owner}/${repo}`;
		const cached = this.getCachedData<GitHubLanguageStats>(cacheKey);
		if (cached) return cached;

		const languages = await this.makeRequest<GitHubLanguageStats>(
			`/repos/${owner}/${repo}/languages`
		);

		this.setCachedData(cacheKey, languages, 30 * 60 * 1000); // Cache for 30 minutes
		return languages;
	}

	/**
	 * Get API rate limit status
	 */
	async getRateLimit(): Promise<{
		core: GitHubRateLimit;
		search: GitHubRateLimit;
	}> {
		const rateLimit = await this.makeRequest<{
			resources: {
				core: GitHubRateLimit;
				search: GitHubRateLimit;
			};
		}>("/rate_limit");

		return {
			core: rateLimit.resources.core,
			search: rateLimit.resources.search,
		};
	}

	/**
	 * Search repositories
	 */
	async searchRepositories(
		query: string,
		options: {
			sort?: "stars" | "forks" | "help-wanted-issues" | "updated";
			order?: "asc" | "desc";
			per_page?: number;
			page?: number;
		} = {}
	): Promise<{ items: GitHubRepository[]; total_count: number }> {
		const { sort = "stars", order = "desc", per_page = 30, page = 1 } = options;

		const params = new URLSearchParams({
			q: query,
			sort,
			order,
			per_page: per_page.toString(),
			page: page.toString(),
		});

		const cacheKey = `search:${params.toString()}`;
		const cached = this.getCachedData<{
			items: GitHubRepository[];
			total_count: number;
		}>(cacheKey);
		if (cached) return cached;

		const results = await this.makeRequest<{
			items: GitHubRepository[];
			total_count: number;
		}>(`/search/repositories?${params.toString()}`);

		this.setCachedData(cacheKey, results, 2 * 60 * 1000); // Cache search results for 2 minutes
		return results;
	}
}

// Create a singleton instance
export const githubService = new GitHubService();

// Data validation utilities
export const validateRepositoryData = (repo: any): repo is GitHubRepository => {
	return (
		typeof repo === "object" &&
		repo !== null &&
		typeof repo.id === "number" &&
		typeof repo.name === "string" &&
		typeof repo.full_name === "string" &&
		typeof repo.html_url === "string" &&
		typeof repo.stargazers_count === "number" &&
		typeof repo.forks_count === "number" &&
		typeof repo.updated_at === "string" &&
		typeof repo.created_at === "string" &&
		typeof repo.private === "boolean" &&
		typeof repo.owner === "object" &&
		repo.owner !== null &&
		typeof repo.owner.login === "string"
	);
};

export const sanitizeRepositoryData = (repo: GitHubRepository): GitHubRepository => {
	return {
		...repo,
		description: repo.description?.trim() || null,
		topics: Array.isArray(repo.topics)
			? repo.topics.filter(topic => typeof topic === "string")
			: [],
		stargazers_count: Math.max(0, repo.stargazers_count || 0),
		forks_count: Math.max(0, repo.forks_count || 0),
		watchers_count: Math.max(0, repo.watchers_count || 0),
		size: Math.max(0, repo.size || 0),
	};
};

// Utility functions for data transformation
export const transformRepositoryData = (repo: GitHubRepository) => {
	// Validate and sanitize input data
	if (!validateRepositoryData(repo)) {
		throw new Error(`Invalid repository data: ${JSON.stringify(repo)}`);
	}

	const sanitized = sanitizeRepositoryData(repo);

	return {
		id: sanitized.id.toString(),
		name: sanitized.name,
		fullName: sanitized.full_name,
		description: sanitized.description,
		language: sanitized.language,
		stars: sanitized.stargazers_count,
		forks: sanitized.forks_count,
		watchers: sanitized.watchers_count,
		size: sanitized.size,
		updatedAt: sanitized.updated_at,
		createdAt: sanitized.created_at,
		pushedAt: sanitized.pushed_at,
		url: sanitized.html_url,
		cloneUrl: sanitized.clone_url,
		sshUrl: sanitized.ssh_url,
		topics: sanitized.topics,
		isPrivate: sanitized.private,
		isFork: sanitized.fork,
		isArchived: sanitized.archived,
		isDisabled: sanitized.disabled,
		defaultBranch: sanitized.default_branch,
		owner: {
			login: sanitized.owner.login,
			id: sanitized.owner.id,
			avatarUrl: sanitized.owner.avatar_url,
			url: sanitized.owner.html_url,
			type: sanitized.owner.type,
		},
		license: sanitized.license
			? {
					key: sanitized.license.key,
					name: sanitized.license.name,
					spdxId: sanitized.license.spdx_id,
			  }
			: null,
	};
};

export const calculateLanguageStats = (repositories: GitHubRepository[]) => {
	const stats: Record<string, { count: number; bytes: number }> = {};

	repositories.forEach(repo => {
		if (repo.language) {
			if (!stats[repo.language]) {
				stats[repo.language] = { count: 0, bytes: 0 };
			}
			stats[repo.language].count += 1;
			stats[repo.language].bytes += repo.size || 0;
		}
	});

	return Object.entries(stats)
		.sort(([, a], [, b]) => b.count - a.count)
		.reduce((acc, [lang, data]) => {
			acc[lang] = data;
			return acc;
		}, {} as Record<string, { count: number; bytes: number }>);
};

export const calculateTotalStats = (repositories: GitHubRepository[]) => {
	const validRepos = repositories.filter(validateRepositoryData);
	const languageStats = calculateLanguageStats(validRepos);

	// Calculate activity score based on recent updates
	const now = new Date();
	const recentActivity = validRepos.filter(repo => {
		const updatedAt = new Date(repo.updated_at);
		const daysSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
		return daysSinceUpdate <= 30; // Updated in last 30 days
	}).length;

	return {
		totalRepos: validRepos.length,
		publicRepos: validRepos.filter(repo => !repo.private).length,
		privateRepos: validRepos.filter(repo => repo.private).length,
		forkedRepos: validRepos.filter(repo => repo.fork).length,
		originalRepos: validRepos.filter(repo => !repo.fork).length,
		archivedRepos: validRepos.filter(repo => repo.archived).length,
		totalStars: validRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
		totalForks: validRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
		totalWatchers: validRepos.reduce((sum, repo) => sum + (repo.watchers_count || 0), 0),
		totalSize: validRepos.reduce((sum, repo) => sum + (repo.size || 0), 0),
		recentlyActive: recentActivity,
		languages: languageStats,
		topLanguage: Object.keys(languageStats)[0] || null,
		averageStars:
			validRepos.length > 0
				? Math.round(
						validRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) /
							validRepos.length
				  )
				: 0,
	};
};

export const formatRepositorySize = (sizeInKB: number): string => {
	if (sizeInKB < 1024) {
		return `${sizeInKB} KB`;
	} else if (sizeInKB < 1024 * 1024) {
		return `${(sizeInKB / 1024).toFixed(1)} MB`;
	} else {
		return `${(sizeInKB / (1024 * 1024)).toFixed(1)} GB`;
	}
};

export const formatRelativeTime = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diffTime = Math.abs(now.getTime() - date.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 1) return "1 day ago";
	if (diffDays < 7) return `${diffDays} days ago`;
	if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
	if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
	return `${Math.floor(diffDays / 365)} years ago`;
};

export const getRepositoryActivityLevel = (repo: GitHubRepository): "high" | "medium" | "low" => {
	const now = new Date();
	const updatedAt = new Date(repo.updated_at);
	const daysSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

	if (daysSinceUpdate <= 7) return "high";
	if (daysSinceUpdate <= 30) return "medium";
	return "low";
};

export const sortRepositories = (
	repositories: GitHubRepository[],
	sortBy: "name" | "stars" | "forks" | "updated" | "created" | "size",
	direction: "asc" | "desc" = "desc"
): GitHubRepository[] => {
	const sorted = [...repositories].sort((a, b) => {
		let aValue: any;
		let bValue: any;

		switch (sortBy) {
			case "name":
				aValue = a.name.toLowerCase();
				bValue = b.name.toLowerCase();
				break;
			case "stars":
				aValue = a.stargazers_count || 0;
				bValue = b.stargazers_count || 0;
				break;
			case "forks":
				aValue = a.forks_count || 0;
				bValue = b.forks_count || 0;
				break;
			case "updated":
				aValue = new Date(a.updated_at).getTime();
				bValue = new Date(b.updated_at).getTime();
				break;
			case "created":
				aValue = new Date(a.created_at).getTime();
				bValue = new Date(b.created_at).getTime();
				break;
			case "size":
				aValue = a.size || 0;
				bValue = b.size || 0;
				break;
			default:
				return 0;
		}

		if (aValue < bValue) return direction === "asc" ? -1 : 1;
		if (aValue > bValue) return direction === "asc" ? 1 : -1;
		return 0;
	});

	return sorted;
};

export const filterRepositories = (
	repositories: GitHubRepository[],
	filters: {
		language?: string;
		type?: "all" | "public" | "private" | "forks" | "original" | "archived";
		minStars?: number;
		maxStars?: number;
		hasTopics?: boolean;
		searchTerm?: string;
	}
): GitHubRepository[] => {
	return repositories.filter(repo => {
		// Language filter
		if (filters.language && repo.language !== filters.language) {
			return false;
		}

		// Type filter
		if (filters.type && filters.type !== "all") {
			switch (filters.type) {
				case "public":
					if (repo.private) return false;
					break;
				case "private":
					if (!repo.private) return false;
					break;
				case "forks":
					if (!repo.fork) return false;
					break;
				case "original":
					if (repo.fork) return false;
					break;
				case "archived":
					if (!repo.archived) return false;
					break;
			}
		}

		// Stars filter
		if (filters.minStars !== undefined && (repo.stargazers_count || 0) < filters.minStars) {
			return false;
		}
		if (filters.maxStars !== undefined && (repo.stargazers_count || 0) > filters.maxStars) {
			return false;
		}

		// Topics filter
		if (filters.hasTopics !== undefined) {
			const hasTopics = repo.topics && repo.topics.length > 0;
			if (filters.hasTopics && !hasTopics) return false;
			if (!filters.hasTopics && hasTopics) return false;
		}

		// Search term filter
		if (filters.searchTerm) {
			const searchTerm = filters.searchTerm.toLowerCase();
			const searchableText = [
				repo.name,
				repo.description || "",
				repo.language || "",
				...(repo.topics || []),
			]
				.join(" ")
				.toLowerCase();

			if (!searchableText.includes(searchTerm)) {
				return false;
			}
		}

		return true;
	});
};
