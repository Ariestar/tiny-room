"use client";

import React, { useState, useEffect } from "react";
import {
	ProjectCard,
	StatCard,
	FilterBar,
	Button,
	Badge,
	Loading,
	GitHubConfigModal,
	ProjectCardSkeleton,
	StatCardSkeleton
} from "@/components/ui";
import {
	githubService,
	GitHubRepository,
	calculateTotalStats,
	filterRepositories,
	sortRepositories
} from "@/lib/github";

// Mock data for development - replace with real API calls
const mockRepositories: GitHubRepository[] = [];

export default function DashboardProjectsPage() {
	const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
	const [filteredRepos, setFilteredRepos] = useState<GitHubRepository[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

	// Management state
	const [managementMode, setManagementMode] = useState(false);
	const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());
	const [repoSettings, setRepoSettings] = useState<Record<string, { isVisible: boolean; isFeatured: boolean }>>({});

	// GitHub configuration state
	const [showGitHubConfig, setShowGitHubConfig] = useState(false);

	// Sync monitoring state
	const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
	const [syncHistory, setSyncHistory] = useState<Array<{
		timestamp: string;
		status: 'success' | 'error';
		message: string;
		repoCount?: number;
	}>>([]);

	// Filter and sort state
	const [activeFilters, setActiveFilters] = useState<Record<string, any>>({
		language: '',
		type: 'all',
		hasTopics: undefined,
		searchTerm: ''
	});
	const [sortBy, setSortBy] = useState<'name' | 'stars' | 'forks' | 'updated'>('updated');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

	// Load repositories on component mount
	useEffect(() => {
		loadRepositories();
		// Load sync history from localStorage
		loadSyncHistory();
	}, []);

	// Load sync history from localStorage
	const loadSyncHistory = () => {
		try {
			const history = localStorage.getItem('github-sync-history');
			if (history) {
				setSyncHistory(JSON.parse(history));
			}
			const lastSync = localStorage.getItem('github-sync-timestamp');
			if (lastSync) {
				setLastSyncTime(lastSync);
			}
		} catch (error) {
			console.error('Failed to load sync history:', error);
		}
	};

	// Save sync history to localStorage
	const saveSyncHistory = (entry: {
		timestamp: string;
		status: 'success' | 'error';
		message: string;
		repoCount?: number;
	}) => {
		try {
			const newHistory = [entry, ...syncHistory.slice(0, 9)]; // Keep last 10 entries
			setSyncHistory(newHistory);
			localStorage.setItem('github-sync-history', JSON.stringify(newHistory));
		} catch (error) {
			console.error('Failed to save sync history:', error);
		}
	};

	// Apply filters and sorting when data or filters change
	useEffect(() => {
		let filtered = filterRepositories(repositories, activeFilters);
		filtered = sortRepositories(filtered, sortBy, sortDirection);
		setFilteredRepos(filtered);
	}, [repositories, activeFilters, sortBy, sortDirection]);

	const loadRepositories = async () => {
		try {
			setLoading(true);
			setError(null);

			// Check if GitHub token is configured
			const token = githubService.getToken();
			if (!token) {
				setRepositories([]);
				setError("GitHub token not configured. Please configure your GitHub token to sync repositories.");
				return;
			}

			// Fetch repositories from GitHub API
			const repos = await githubService.getUserRepositories();
			setRepositories(repos);

			// Store sync timestamp
			localStorage.setItem('github-sync-timestamp', new Date().toISOString());
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to load repositories');
		} finally {
			setLoading(false);
		}
	};

	const handleSync = async () => {
		const syncStartTime = new Date().toISOString();

		try {
			setSyncStatus('syncing');

			// Check if GitHub token is configured
			const token = githubService.getToken();
			if (!token) {
				throw new Error("GitHub token not configured");
			}

			// Fetch repositories from GitHub API
			const repos = await githubService.getUserRepositories();
			setRepositories(repos);

			// Store sync timestamp
			const syncTime = new Date().toISOString();
			localStorage.setItem('github-sync-timestamp', syncTime);
			setLastSyncTime(syncTime);

			// Save successful sync to history
			saveSyncHistory({
				timestamp: syncStartTime,
				status: 'success',
				message: `Successfully synced ${repos.length} repositories`,
				repoCount: repos.length
			});

			setSyncStatus('success');
			setTimeout(() => setSyncStatus('idle'), 2000);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to sync repositories';

			// Save failed sync to history
			saveSyncHistory({
				timestamp: syncStartTime,
				status: 'error',
				message: errorMessage
			});

			setError(errorMessage);
			setSyncStatus('error');
			setTimeout(() => setSyncStatus('idle'), 3000);
		}
	};

	const handleFilterChange = (filters: Record<string, any>) => {
		setActiveFilters(filters);
	};

	// Management functions
	const toggleManagementMode = () => {
		setManagementMode(!managementMode);
		setSelectedRepos(new Set());
	};

	const handleVisibilityToggle = (id: string, visible: boolean) => {
		setRepoSettings(prev => ({
			...prev,
			[id]: {
				...prev[id],
				isVisible: visible
			}
		}));
		// TODO: Save to localStorage or API
	};

	const handleFeaturedToggle = (id: string, featured: boolean) => {
		setRepoSettings(prev => ({
			...prev,
			[id]: {
				...prev[id],
				isFeatured: featured
			}
		}));
		// TODO: Save to localStorage or API
	};

	const handleSelectionChange = (id: string, selected: boolean) => {
		const newSelected = new Set(selectedRepos);
		if (selected) {
			newSelected.add(id);
		} else {
			newSelected.delete(id);
		}
		setSelectedRepos(newSelected);
	};

	const handleSelectAll = () => {
		if (selectedRepos.size === filteredRepos.length) {
			setSelectedRepos(new Set());
		} else {
			setSelectedRepos(new Set(filteredRepos.map(repo => repo.id.toString())));
		}
	};

	const handleBulkVisibilityToggle = (visible: boolean) => {
		const updates: Record<string, { isVisible: boolean; isFeatured: boolean }> = {};
		selectedRepos.forEach(id => {
			updates[id] = {
				...repoSettings[id],
				isVisible: visible
			};
		});
		setRepoSettings(prev => ({ ...prev, ...updates }));
		// TODO: Save to localStorage or API
	};

	const handleBulkFeaturedToggle = (featured: boolean) => {
		const updates: Record<string, { isVisible: boolean; isFeatured: boolean }> = {};
		selectedRepos.forEach(id => {
			updates[id] = {
				...repoSettings[id],
				isFeatured: featured
			};
		});
		setRepoSettings(prev => ({ ...prev, ...updates }));
		// TODO: Save to localStorage or API
	};

	// GitHub configuration functions
	const handleGitHubConfigSave = (token: string) => {
		// Token is already saved in the modal, just refresh data
		handleSync();
	};

	// Calculate statistics
	const stats = calculateTotalStats(repositories);

	// Get unique languages for filter options
	const languageOptions = Array.from(
		new Set(repositories.map(repo => repo.language).filter(Boolean))
	).map(lang => ({ value: lang!, label: lang! }));

	// Filter configuration
	const filterOptions = [
		{
			key: 'language',
			label: 'Language',
			type: 'select' as const,
			options: languageOptions,
			placeholder: 'All Languages'
		},
		{
			key: 'type',
			label: 'Type',
			type: 'select' as const,
			options: [
				{ value: 'all', label: 'All Repositories' },
				{ value: 'public', label: 'Public' },
				{ value: 'private', label: 'Private' },
				{ value: 'forks', label: 'Forks' },
				{ value: 'original', label: 'Original' },
				{ value: 'archived', label: 'Archived' }
			]
		},
		{
			key: 'hasTopics',
			label: 'Has Topics',
			type: 'toggle' as const
		}
	];

	if (loading) {
		return (
			<div className="space-y-6">
				{/* Page Header */}
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-foreground">Projects Management</h1>
						<p className="text-muted-foreground mt-2">
							Loading your GitHub repositories...
						</p>
					</div>
					<div className="flex items-center gap-3">
						<Button variant="outline" disabled>
							Manage Projects
						</Button>
						<Button variant="outline" disabled>
							<Loading size="sm" className="mr-2" />
							Loading...
						</Button>
						<Button disabled>
							Configure GitHub
						</Button>
					</div>
				</div>

				{/* Statistics Cards Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					<StatCardSkeleton variant="default" />
					<StatCardSkeleton variant="default" />
					<StatCardSkeleton variant="default" />
					<StatCardSkeleton variant="highlighted" />
				</div>

				{/* Filter Bar Skeleton */}
				<div className="bg-card border border-border rounded-lg p-4 animate-pulse">
					<div className="flex items-center justify-between mb-4">
						<div className="h-4 bg-muted rounded w-16"></div>
						<div className="h-8 bg-muted rounded w-12"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						<div className="space-y-2">
							<div className="h-4 bg-muted rounded w-16"></div>
							<div className="h-10 bg-muted rounded"></div>
						</div>
						<div className="space-y-2">
							<div className="h-4 bg-muted rounded w-12"></div>
							<div className="h-10 bg-muted rounded"></div>
						</div>
						<div className="space-y-2">
							<div className="h-4 bg-muted rounded w-20"></div>
							<div className="h-6 bg-muted rounded w-16"></div>
						</div>
					</div>
				</div>

				{/* Sort Controls Skeleton */}
				<div className="flex items-center gap-4 animate-pulse">
					<div className="h-4 bg-muted rounded w-16"></div>
					<div className="flex items-center gap-2">
						<div className="h-8 bg-muted rounded w-12"></div>
						<div className="h-8 bg-muted rounded w-12"></div>
						<div className="h-8 bg-muted rounded w-12"></div>
						<div className="h-8 bg-muted rounded w-16"></div>
					</div>
					<div className="h-8 bg-muted rounded w-8"></div>
				</div>

				{/* Repository Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, index) => (
						<ProjectCardSkeleton key={index} variant="default" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Projects Management</h1>
					<p className="text-muted-foreground mt-2">
						Manage your GitHub repositories and project showcase settings
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button
						variant="outline"
						onClick={toggleManagementMode}
					>
						{managementMode ? 'Exit Management' : 'Manage Projects'}
					</Button>
					<Button
						variant="outline"
						onClick={handleSync}
						disabled={syncStatus === 'syncing'}
					>
						{syncStatus === 'syncing' ? (
							<>
								<Loading size="sm" className="mr-2" />
								Syncing...
							</>
						) : (
							'Sync GitHub'
						)}
					</Button>
					<Button onClick={() => setShowGitHubConfig(true)}>
						Configure GitHub
					</Button>
				</div>
			</div>

			{/* Sync Status */}
			{syncStatus !== 'idle' && (
				<div className="flex items-center gap-2">
					{syncStatus === 'success' && (
						<Badge variant="success" className="flex items-center gap-1">
							✓ Sync completed successfully
						</Badge>
					)}
					{syncStatus === 'error' && (
						<Badge variant="destructive" className="flex items-center gap-1">
							✗ Sync failed
						</Badge>
					)}
				</div>
			)}

			{/* Sync Information */}
			{lastSyncTime && (
				<div className="bg-muted/30 border border-border rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-sm font-medium text-foreground">Sync Status</h3>
							<p className="text-xs text-muted-foreground mt-1">
								Last synced: {new Date(lastSyncTime).toLocaleString()}
							</p>
						</div>
						{syncHistory.length > 0 && (
							<div className="flex items-center gap-2">
								<Badge
									variant={syncHistory[0].status === 'success' ? 'success' : 'destructive'}
									size="sm"
								>
									{syncHistory[0].status === 'success' ? 'Success' : 'Failed'}
								</Badge>
								{syncHistory[0].repoCount && (
									<span className="text-xs text-muted-foreground">
										{syncHistory[0].repoCount} repos
									</span>
								)}
							</div>
						)}
					</div>

					{/* Sync History */}
					{syncHistory.length > 0 && (
						<div className="mt-4 pt-4 border-t border-border">
							<h4 className="text-xs font-medium text-foreground mb-2">Recent Sync History</h4>
							<div className="space-y-2 max-h-32 overflow-y-auto">
								{syncHistory.slice(0, 5).map((entry, index) => (
									<div key={index} className="flex items-center justify-between text-xs">
										<div className="flex items-center gap-2">
											<span className={entry.status === 'success' ? 'text-green-600' : 'text-red-600'}>
												{entry.status === 'success' ? '✓' : '✗'}
											</span>
											<span className="text-muted-foreground">
												{new Date(entry.timestamp).toLocaleString()}
											</span>
										</div>
										<span className="text-muted-foreground truncate max-w-48">
											{entry.message}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
					<p className="text-destructive font-medium">Error loading repositories</p>
					<p className="text-destructive/80 text-sm mt-1">{error}</p>
					<Button
						variant="outline"
						size="sm"
						onClick={loadRepositories}
						className="mt-3"
					>
						Try Again
					</Button>
				</div>
			)}

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					title="Total Repositories"
					value={stats.totalRepos}
					subtitle={`${stats.publicRepos} public, ${stats.privateRepos} private`}
					variant="default"
				/>
				<StatCard
					title="Total Stars"
					value={stats.totalStars}
					subtitle={`Average: ${stats.averageStars} per repo`}
					variant="default"
				/>
				<StatCard
					title="Total Forks"
					value={stats.totalForks}
					subtitle={`${stats.forkedRepos} forked repos`}
					variant="default"
				/>
				<StatCard
					title="Recently Active"
					value={stats.recentlyActive}
					subtitle="Updated in last 30 days"
					variant="highlighted"
				/>
			</div>

			{/* Filters */}
			<FilterBar
				filters={filterOptions}
				activeFilters={activeFilters}
				onFilterChange={handleFilterChange}
				showCount={true}
				showReset={true}
			/>

			{/* Management Mode Controls */}
			{managementMode && (
				<div className="bg-muted/50 border border-border rounded-lg p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="sm"
								onClick={handleSelectAll}
							>
								{selectedRepos.size === filteredRepos.length ? 'Deselect All' : 'Select All'}
							</Button>
							{selectedRepos.size > 0 && (
								<span className="text-sm text-muted-foreground">
									{selectedRepos.size} selected
								</span>
							)}
						</div>

						{selectedRepos.size > 0 && (
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleBulkVisibilityToggle(true)}
								>
									👁️ Show Selected
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleBulkVisibilityToggle(false)}
								>
									🙈 Hide Selected
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleBulkFeaturedToggle(true)}
								>
									⭐ Feature Selected
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleBulkFeaturedToggle(false)}
								>
									☆ Unfeature Selected
								</Button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Sort Controls */}
			<div className="flex items-center gap-4">
				<span className="text-sm font-medium text-foreground">Sort by:</span>
				<div className="flex items-center gap-2">
					{(['name', 'stars', 'forks', 'updated'] as const).map((option) => (
						<Button
							key={option}
							variant={sortBy === option ? "primary" : "outline"}
							size="sm"
							onClick={() => setSortBy(option)}
						>
							{option.charAt(0).toUpperCase() + option.slice(1)}
						</Button>
					))}
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
				>
					{sortDirection === 'asc' ? '↑' : '↓'}
				</Button>
			</div>

			{/* Repository Grid */}
			{filteredRepos.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-muted-foreground text-lg">
						{repositories.length === 0
							? "No repositories found. Connect your GitHub account to get started."
							: "No repositories match your current filters."
						}
					</p>
					{repositories.length === 0 && (
						<Button className="mt-4" onClick={handleSync}>
							Connect GitHub
						</Button>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredRepos.map((repo) => {
						const repoId = repo.id.toString();
						const settings = repoSettings[repoId] || { isVisible: true, isFeatured: false };

						return (
							<ProjectCard
								key={repo.id}
								project={{
									id: repoId,
									name: repo.name,
									description: repo.description || undefined,
									language: repo.language || undefined,
									stars: repo.stargazers_count,
									forks: repo.forks_count,
									updatedAt: repo.updated_at,
									url: repo.html_url,
									topics: repo.topics || [],
									isVisible: settings.isVisible,
									isFeatured: settings.isFeatured,
									isPrivate: repo.private
								}}
								variant={managementMode ? "management" : "default"}
								showStats={true}
								showControls={managementMode}
								selected={selectedRepos.has(repoId)}
								clickable={!managementMode}
								onVisibilityToggle={handleVisibilityToggle}
								onFeaturedToggle={handleFeaturedToggle}
								onSelectionChange={handleSelectionChange}
							/>
						);
					})}
				</div>
			)}

			{/* Results Summary */}
			{filteredRepos.length > 0 && (
				<div className="text-center text-sm text-muted-foreground">
					Showing {filteredRepos.length} of {repositories.length} repositories
				</div>
			)}

			{/* GitHub Configuration Modal */}
			<GitHubConfigModal
				isOpen={showGitHubConfig}
				onClose={() => setShowGitHubConfig(false)}
				onSave={handleGitHubConfigSave}
			/>
		</div>
	);
}
