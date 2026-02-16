/**
 * GitHub API Types
 * Type definitions for GitHub REST API responses
 */

export interface GitHubUser {
    login: string;
    name: string;
    avatar_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    html_url: string;
}

export interface GitHubRepo {
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    html_url: string;
    created_at: string;
    updated_at: string;
    size: number;
}

export interface LanguageStats {
    [language: string]: number; // bytes of code
}

export interface LanguagePercentage {
    language: string;
    percentage: number;
    bytes: number;
    color: string;
}

export interface GitHubStats {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    totalContributions: number;
    languages: LanguagePercentage[];
    topRepos: GitHubRepo[];
}

export interface ContributionYear {
    year: string;
    total: number;
    range: {
        start: string;
        end: string;
    };
}

export interface ContributionDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4; // GitHub's contribution intensity levels
}
