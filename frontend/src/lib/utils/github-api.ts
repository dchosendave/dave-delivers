/**
 * GitHub API Client
 * Fetches data from GitHub REST API with caching
 */

import type { GitHubUser, GitHubRepo, LanguageStats, GitHubStats, LanguagePercentage, ContributionYear } from '../types/github-types';

const CACHE_PREFIX = 'github_cache_';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Language colors (GitHub-style)
const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Go: '#00ADD8',
    Rust: '#dea584',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Swift: '#F05138',
};

/**
 * Generic cache wrapper
 */
function withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CACHE_TTL
): Promise<T> {
    const cacheKey = CACHE_PREFIX + key;

    // Check cache
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < ttl) {
                return Promise.resolve(data);
            }
        } catch (e) {
            // Invalid cache, continue to fetch
        }
    }

    // Fetch fresh data
    return fetcher().then((data) => {
        localStorage.setItem(
            cacheKey,
            JSON.stringify({ data, timestamp: Date.now() })
        );
        return data;
    });
}

/**
 * Fetch user data from GitHub
 */
export async function getUserData(username: string): Promise<GitHubUser> {
    return withCache(`user_${username}`, async () => {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
    });
}

/**
 * Fetch all public repositories
 */
export async function getUserRepos(username: string): Promise<GitHubRepo[]> {
    return withCache(`repos_${username}`, async () => {
        const repos: GitHubRepo[] = [];
        let page = 1;
        const perPage = 100;

        while (true) {
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`
            );
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const data: GitHubRepo[] = await response.json();
            if (data.length === 0) break;

            repos.push(...data);
            if (data.length < perPage) break;
            page++;
        }

        return repos;
    });
}

/**
 * Calculate language statistics from repositories
 */
export async function getLanguageStats(username: string, repos: GitHubRepo[]): Promise<LanguagePercentage[]> {
    return withCache(`languages_${username}`, async () => {
        const languageBytes: Record<string, number> = {};

        // Fetch language data for each repo
        for (const repo of repos) {
            if (!repo.language) continue;

            try {
                const response = await fetch(
                    `https://api.github.com/repos/${username}/${repo.name}/languages`
                );
                if (response.ok) {
                    const languages: Record<string, number> = await response.json();
                    for (const [lang, bytes] of Object.entries(languages)) {
                        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
                    }
                }
            } catch (e) {
                // Skip on error
                console.warn(`Failed to fetch languages for ${repo.name}`);
            }
        }

        // Calculate percentages
        const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
        const percentages: LanguagePercentage[] = Object.entries(languageBytes)
            .map(([language, bytes]) => ({
                language,
                bytes,
                percentage: (bytes / totalBytes) * 100,
                color: LANGUAGE_COLORS[language] || '#858585',
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 6); // Top 6 languages

        return percentages;
    });
}

/**
 * Fetch contribution count for the last year
 * Uses GitHub contribution scraper API (accurate count)
 */
export async function getContributionCount(username: string): Promise<number> {
    return withCache(`contributions_${username}`, async () => {
        try {
            // Primary: Use GitHub contributions API scraper
            const response = await fetch(
                `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
            );

            if (response.ok) {
                const data = await response.json();

                // Get total for this year or last year
                const currentYear = new Date().getFullYear();
                if (data && data.total) {
                    const total = data.total[currentYear] || data.total[currentYear - 1] || 0;
                    if (total > 0) return total;
                }

                // Fallback: sum all contributions
                if (data && data.contributions) {
                    return data.contributions.reduce((sum: number, day: any) => sum + (day.count || 0), 0);
                }
            }

            // Fallback: Parse from GitHub profile page
            return await fetchContributionsFromProfile(username);
        } catch (e) {
            console.error('Failed to fetch contributions:', e);
            return await fetchContributionsFromProfile(username);
        }
    });
}

/**
 * Fallback: Fetch contributions by parsing GitHub profile HTML
 */
async function fetchContributionsFromProfile(username: string): Promise<number> {
    try {
        const response = await fetch(`https://github.com/${username}`);
        if (!response.ok) return 0;

        const html = await response.text();

        // Look for contribution count in HTML: "155 contributions in the last year"
        const match = html.match(/(\d+)\s+contributions?\s+in\s+the\s+last\s+year/i);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }

        return 0;
    } catch (e) {
        console.error('Failed to fetch from profile:', e);
        return 0;
    }
}

/**
 * Get comprehensive GitHub statistics
 */
export async function getGitHubStats(username: string): Promise<GitHubStats> {
    const [user, repos, contributions] = await Promise.all([
        getUserData(username),
        getUserRepos(username),
        getContributionCount(username),
    ]);

    const languages = await getLanguageStats(username, repos);

    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    const topRepos = [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    return {
        totalRepos: user.public_repos,
        totalStars,
        totalForks,
        totalContributions: contributions,
        languages,
        topRepos,
    };
}
