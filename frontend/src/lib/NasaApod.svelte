<script lang="ts">
    import { onMount } from "svelte";

    let { onClose }: { onClose: () => void } = $props();

    interface ApodData {
        title: string;
        date: string;
        explanation: string;
        url: string;
        hdurl?: string;
        media_type: "image" | "video";
        copyright?: string;
    }

    let data = $state<ApodData | null>(null);
    let loading = $state(true);
    let error = $state("");
    let showFullExplanation = $state(false);

    onMount(() => {
        fetchApod();
    });

    async function fetchApod() {
        loading = true;
        error = "";

        try {
            const res = await fetch("/api/nasa-apod");
            if (!res.ok) throw new Error("Failed to fetch");
            data = await res.json();
        } catch (err) {
            error = "Could not load today's picture. Try again later.";
        } finally {
            loading = false;
        }
    }
</script>

<div class="apod-container">
    {#if loading}
        <!-- Loading skeleton -->
        <div class="apod-skeleton">
            <div class="skeleton-image"></div>
            <div class="skeleton-text wide"></div>
            <div class="skeleton-text medium"></div>
            <div class="skeleton-text narrow"></div>
        </div>
    {:else if error}
        <!-- Error state -->
        <div class="apod-error">
            <span class="error-icon">🛸</span>
            <p class="error-text">{error}</p>
            <button class="retry-btn" onclick={fetchApod}>Try Again</button>
        </div>
    {:else if data}
        <!-- APOD Content -->
        <div class="apod-content">
            {#if data.media_type === "video"}
                <div class="apod-video-wrapper">
                    <iframe
                        src={data.url}
                        title={data.title}
                        class="apod-video"
                        allowfullscreen
                    ></iframe>
                </div>
            {:else}
                <div class="apod-image-wrapper">
                    <img
                        src={data.hdurl || data.url}
                        alt={data.title}
                        class="apod-image"
                        loading="lazy"
                    />
                </div>
            {/if}

            <div class="apod-details">
                <div class="apod-header">
                    <h2 class="apod-title">{data.title}</h2>
                    <span class="apod-date">{data.date}</span>
                </div>

                {#if data.copyright}
                    <p class="apod-credit">📷 {data.copyright}</p>
                {/if}

                <div
                    class="apod-explanation"
                    class:expanded={showFullExplanation}
                >
                    <p>{data.explanation}</p>
                </div>

                <div class="apod-actions">
                    <button
                        class="toggle-btn"
                        onclick={() =>
                            (showFullExplanation = !showFullExplanation)}
                    >
                        {showFullExplanation ? "Show less" : "Read more"}
                    </button>

                    <a
                        href="https://apod.nasa.gov/apod/astropix.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="nasa-link"
                    >
                        Open in NASA ↗
                    </a>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .apod-container {
        height: 100%;
        overflow-y: auto;
        background: #0a0a14;
        color: rgba(255, 255, 255, 0.9);
        font-family: var(
            --font-system,
            -apple-system,
            BlinkMacSystemFont,
            sans-serif
        );
    }

    /* ===== LOADING SKELETON ===== */
    .apod-skeleton {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1.25rem;
    }

    .skeleton-image {
        width: 100%;
        height: 300px;
        border-radius: 0.75rem;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.04) 25%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    .skeleton-text {
        height: 1rem;
        border-radius: 0.25rem;
        background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.04) 25%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.04) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
    }

    .skeleton-text.wide {
        width: 80%;
    }
    .skeleton-text.medium {
        width: 50%;
    }
    .skeleton-text.narrow {
        width: 30%;
    }

    @keyframes shimmer {
        0% {
            background-position: 200% 0;
        }
        100% {
            background-position: -200% 0;
        }
    }

    /* ===== ERROR STATE ===== */
    .apod-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        gap: 1rem;
        padding: 2rem;
        text-align: center;
    }

    .error-icon {
        font-size: 3rem;
    }

    .error-text {
        font-size: 0.9375rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
    }

    .retry-btn {
        padding: 0.5rem 1.25rem;
        font-size: 0.875rem;
        font-family: inherit;
        color: #fff;
        background: rgba(79, 172, 254, 0.2);
        border: 1px solid rgba(79, 172, 254, 0.3);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: background 0.2s;
    }

    .retry-btn:hover {
        background: rgba(79, 172, 254, 0.35);
    }

    /* ===== APOD CONTENT ===== */
    .apod-content {
        display: flex;
        flex-direction: column;
    }

    .apod-image-wrapper {
        width: 100%;
        max-height: 400px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
    }

    .apod-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        max-height: 400px;
    }

    .apod-video-wrapper {
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #000;
    }

    .apod-video {
        width: 100%;
        height: 100%;
        border: none;
    }

    /* ===== DETAILS ===== */
    .apod-details {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .apod-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .apod-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
        color: #fff;
        line-height: 1.3;
    }

    .apod-date {
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.4);
        white-space: nowrap;
    }

    .apod-credit {
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        font-style: italic;
    }

    .apod-explanation {
        max-height: 4.5em;
        overflow: hidden;
        transition: max-height 0.4s ease;
    }

    .apod-explanation.expanded {
        max-height: 800px;
    }

    .apod-explanation p {
        font-size: 0.875rem;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
    }

    /* ===== ACTIONS ===== */
    .apod-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .toggle-btn {
        background: none;
        border: none;
        color: rgba(79, 172, 254, 0.8);
        font-size: 0.8125rem;
        font-family: inherit;
        cursor: pointer;
        padding: 0;
        transition: color 0.2s;
    }

    .toggle-btn:hover {
        color: #4facfe;
    }

    .nasa-link {
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.35);
        text-decoration: none;
        margin-left: auto;
        transition: color 0.2s;
    }

    .nasa-link:hover {
        color: rgba(255, 255, 255, 0.7);
    }
</style>
