import { auth } from "@/auth";

const GITHUB_API_BASE = "https://api.github.com";

export interface ServerGitHubClientOptions {
	signal?: AbortSignal;
}

export async function getServerGitHubAccessToken() {
	const session = await auth();
	// @ts-expect-error custom field on session
	const accessToken: string | undefined = session?.githubAccessToken;
	if (!accessToken) {
		throw new Error("GitHub access token not found. Please sign in with GitHub.");
	}
	return accessToken;
}

export async function githubFetch<T>(
	endpoint: string,
	options: RequestInit = {},
	clientOptions?: ServerGitHubClientOptions
): Promise<T> {
	const token = await getServerGitHubAccessToken();

	const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
		...options,
		headers: {
			Accept: "application/vnd.github.v3+json",
			"User-Agent": "TinyRoom-Dashboard",
			Authorization: `Bearer ${token}`,
			...(options.headers || {}),
		},
		signal: clientOptions?.signal,
		// Force server-side fetch
		cache: "no-store",
		next: { revalidate: 0 },
	});

	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`GitHub API error ${res.status}: ${text || res.statusText}`);
	}

	return (await res.json()) as T;
}

export interface RepoLite {
	id: number;
	name: string;
	full_name: string;
	private: boolean;
	fork: boolean;
	archived: boolean;
	stargazers_count: number;
	forks_count: number;
	watchers_count: number;
	size: number;
	language: string | null;
	updated_at: string;
	created_at: string;
}

export async function fetchCurrentUser() {
	return githubFetch("/user");
}

export async function fetchUserRepos(params: URLSearchParams) {
	const endpoint = `/user/repos?${params.toString()}`;
	return githubFetch<RepoLite[]>(endpoint);
}

export async function computeProjectStats(repos: RepoLite[]) {
	const now = new Date();
	const recentlyActive = repos.filter(r => {
		const updated = new Date(r.updated_at);
		const days = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);
		return days <= 30;
	}).length;

	return {
		totalRepos: repos.length,
		totalStars: repos.reduce((s, r) => s + (r.stargazers_count || 0), 0),
		totalForks: repos.reduce((s, r) => s + (r.forks_count || 0), 0),
		recentlyActive,
	} as const;
}
