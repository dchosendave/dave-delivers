<script lang="ts">
    import { onMount } from "svelte";
    import { getGitHubStats, getUserData } from "../utils/github-api";
    import type { GitHubStats, GitHubUser } from "../types/github-types";
    import { fadeIn, scaleIn, staggerDelay } from "../animations.js";

    const USERNAME = "dchosendave";

    let stats: GitHubStats | null = $state(null);
    let user: GitHubUser | null = $state(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    onMount(async () => {
        try {
            [user, stats] = await Promise.all([
                getUserData(USERNAME),
                getGitHubStats(USERNAME),
            ]);
            loading = false;
        } catch (e) {
            error =
                e instanceof Error ? e.message : "Failed to load GitHub data";
            loading = false;
        }
    });

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.getFullYear().toString();
    }
</script>

<section class="github-activity">
    <div class="container">
        <!-- Header - Left aligned like Skills section -->
        <div class="section-header" use:fadeIn>
            <h2 class="section-title">GitHub Activity</h2>
            <p class="section-subtitle">
                Here's what I've been doing recently.
            </p>
        </div>

        {#if loading}
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading GitHub data...</p>
            </div>
        {:else if error}
            <div class="error-state">
                <span class="error-icon">⚠️</span>
                <p>{error}</p>
            </div>
        {:else if stats && user}
            <!-- Horizontal Stats Bar (macOS Dock style) -->
            <div class="stats-bar" use:fadeIn>
                <div class="stat-item">
                    <span class="stat-value">{stats.totalContributions}+</span>
                    <span class="stat-label">Contributions</span>
                </div>

                <div class="stat-divider"></div>

                <div class="stat-item">
                    <span class="stat-value">{stats.totalRepos}</span>
                    <span class="stat-label">Repositories</span>
                </div>

                <div class="stat-divider"></div>

                <div class="stat-item">
                    <span class="stat-value">{stats.totalStars}</span>
                    <span class="stat-label">Stars Earned</span>
                </div>

                <div class="stat-divider"></div>

                <div class="stat-item">
                    <span class="stat-value">{user.followers}</span>
                    <span class="stat-label">Followers</span>
                </div>

                <div class="stat-divider"></div>

                <div class="stat-item">
                    <span class="stat-value"
                        >Since {formatDate(user.created_at)}</span
                    >
                    <span class="stat-label">Account Age</span>
                </div>
            </div>

            <!-- Content Grid -->
            <div class="content-grid">
                <!-- Language Stats -->
                <div class="card" use:scaleIn={{ delay: 0 }}>
                    <h3 class="card-title">Top Languages</h3>
                    <div class="language-list">
                        {#each stats.languages as lang, i}
                            <div
                                class="language-item"
                                use:fadeIn={{ delay: staggerDelay(i, 50) }}
                            >
                                <div class="language-row">
                                    <span class="language-name"
                                        >{lang.language}</span
                                    >
                                    <span class="language-percent"
                                        >{lang.percentage.toFixed(1)}%</span
                                    >
                                </div>
                                <div class="language-bar">
                                    <div
                                        class="language-fill"
                                        style="width: {lang.percentage}%"
                                    ></div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Top Repositories -->
                <div class="card" use:scaleIn={{ delay: 100 }}>
                    <h3 class="card-title">Top Repositories</h3>
                    <div class="repos-list">
                        {#each stats.topRepos as repo, i}
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="repo-item"
                                use:fadeIn={{ delay: staggerDelay(i, 50) }}
                            >
                                <div class="repo-header">
                                    <span class="repo-name">{repo.name}</span>
                                    <div class="repo-meta">
                                        <span class="repo-stars"
                                            >⭐ {repo.stargazers_count}</span
                                        >
                                        {#if repo.language}
                                            <span class="repo-lang"
                                                >{repo.language}</span
                                            >
                                        {/if}
                                    </div>
                                </div>
                                {#if repo.description}
                                    <p class="repo-desc">{repo.description}</p>
                                {/if}
                            </a>
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Link to GitHub Profile -->
            <div class="github-link-container">
                <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="github-link"
                >
                    View Full Profile on GitHub
                    <span class="arrow">→</span>
                </a>
            </div>
        {/if}
    </div>
</section>

<style>
    .github-activity {
        padding: 5rem 2rem;
        background: transparent;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

    /* Section Header - Match Skills section */
    .section-header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .section-title {
        font-size: clamp(2.25rem, 5vw, 3rem);
        font-weight: 700;
        letter-spacing: -0.02em;
        color: var(--color-text-primary);
        margin: 0;
    }

    .section-subtitle {
        font-size: 1.125rem;
        color: var(--color-text-secondary, rgba(255, 255, 255, 0.7));
        font-weight: 400;
        margin: 0;
    }

    /* Loading & Error States */
    .loading-state,
    .error-state {
        text-align: center;
        padding: 4rem 2rem;
        color: rgba(255, 255, 255, 0.6);
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--color-text-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .error-state {
        color: #ff6b6b;
    }

    .error-icon {
        font-size: 2rem;
        display: block;
        margin-bottom: 0.5rem;
    }

    /* Horizontal Stats Bar (macOS Dock style) */
    .stats-bar {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 1.5rem 2rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 1.5rem;
        backdrop-filter: blur(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stats-bar:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.12);
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        flex: 1;
    }

    .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--color-text-primary);
        line-height: 1;
    }

    .stat-label {
        font-size: 0.75rem;
        color: var(--color-text-secondary, rgba(255, 255, 255, 0.6));
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .stat-divider {
        width: 1px;
        height: 2.5rem;
        background: rgba(255, 255, 255, 0.1);
    }

    /* Content Grid */
    .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 2rem;
    }

    .card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 1.5rem;
        padding: 2.5rem;
        backdrop-filter: blur(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .card:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 255, 255, 0.12);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .card-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 1.5rem;
        letter-spacing: -0.01em;
    }

    /* Language Stats - Monochrome style */
    .language-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .language-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .language-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
    }

    .language-name {
        font-weight: 500;
        color: var(--color-text-primary);
        font-size: 0.9375rem;
    }

    .language-percent {
        font-weight: 600;
        color: var(--color-text-secondary, rgba(255, 255, 255, 0.6));
        font-family: "SF Mono", "Monaco", "Courier New", monospace;
        font-size: 0.875rem;
    }

    .language-bar {
        height: 4px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 2px;
        overflow: hidden;
    }

    .language-fill {
        height: 100%;
        background: var(--color-text-primary);
        opacity: 0.6;
        border-radius: 2px;
        transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Repositories - Subtle style */
    .repos-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .repo-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 1.25rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 0.75rem;
        text-decoration: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .repo-item:hover {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.15);
    }

    .repo-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }

    .repo-name {
        font-weight: 600;
        color: var(--color-text-primary);
        font-size: 0.9375rem;
        font-family: "SF Mono", "Monaco", "Courier New", monospace;
    }

    .repo-meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
    }

    .repo-stars {
        color: var(--color-text-secondary, rgba(255, 255, 255, 0.6));
        font-size: 0.8125rem;
    }

    .repo-lang {
        color: var(--color-text-secondary, rgba(255, 255, 255, 0.5));
        font-size: 0.75rem;
    }

    .repo-desc {
        font-size: 0.875rem;
        color: var(--color-text-secondary, rgba(255, 255, 255, 0.6));
        margin: 0;
        line-height: 1.5;
    }

    /* GitHub Link - Minimal style */
    .github-link-container {
        text-align: center;
        margin-top: 1rem;
    }

    .github-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.875rem 1.75rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: var(--color-text-primary);
        text-decoration: none;
        border-radius: 0.75rem;
        font-weight: 500;
        font-size: 0.9375rem;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .github-link:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .arrow {
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .github-link:hover .arrow {
        transform: translateX(3px);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .github-activity {
            padding: 3rem 1rem;
        }

        .section-title {
            font-size: 2rem;
        }

        .stats-bar {
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 1.5rem;
        }

        .stat-item {
            flex: 1 1 45%;
            min-width: 120px;
        }

        .stat-divider {
            display: none;
        }

        .content-grid {
            grid-template-columns: 1fr;
        }

        .card {
            padding: 2rem;
        }
    }
</style>
