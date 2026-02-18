<script lang="ts">
    import { onMount } from "svelte";
    import { fadeIn, slideInLeft, staggerDelay } from "../animations.js";
    import { getExperiences } from "$lib/api/portfolio";
    import type { Experience } from "$lib/types";

    let experiences: Experience[] = [];

    onMount(async () => {
        try {
            experiences = await getExperiences();
        } catch (err) {
            console.error("Failed to load experiences:", err);
        }
    });
</script>

<section class="experience-section">
    <!-- Header -->
    <!--
        ANIMATION: Fade in header
    -->
    <div class="section-header" use:fadeIn>
        <h2 class="section-title">Experience</h2>
        <p class="section-description">
            My professional journey and key contributions.
        </p>
    </div>

    <!-- Timeline Container -->
    <!--
        ANIMATION: Each timeline item slides in from left with stagger
        Why slideInLeft? Because the timeline has a left border
        Items sliding from left follows the visual flow of the timeline
        Creates a natural "filling in history" effect
    -->
    <div class="timeline-container">
        {#each experiences as exp, i}
            <div
                class="timeline-item"
                use:slideInLeft={{ delay: staggerDelay(i, 120) }}
            >
                <!-- Timeline Dot (Glows on hover) -->
                <div class="timeline-dot"></div>

                <!-- Content Card -->
                <div class="exp-header">
                    <h3 class="exp-company">
                        {exp.company}
                    </h3>
                    <span class="exp-duration">
                        {exp.duration}
                    </span>
                </div>

                <div class="exp-content">
                    <p class="exp-description">
                        {exp.description}
                    </p>

                    <!-- Tech Stack (Minimal text representation) -->
                    <div class="exp-tech">
                        <span class="tech-divider"></span>
                        <span class="tech-stack">
                            {exp.tech_stack}
                        </span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    .experience-section {
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }

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
    }

    .section-description {
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        max-width: 42rem;
        font-weight: 300;
    }

    .timeline-container {
        position: relative;
        border-left: 1px solid var(--color-glass-border);
        margin-left: 0.75rem;
        padding-bottom: 1rem;
    }

    @media (min-width: 768px) {
        .timeline-container {
            margin-left: 1.5rem;
        }
    }

    .timeline-item {
        position: relative;
        padding-left: 2rem;
        margin-bottom: 3rem;
    }

    @media (min-width: 768px) {
        .timeline-item {
            padding-left: 3rem;
        }
    }

    .timeline-dot {
        position: absolute;
        left: -5px;
        top: 0.5rem;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background: var(--color-text-tertiary);
        border: 1px solid var(--color-bg);
        transition: all 0.3s;
    }

    .timeline-item:hover .timeline-dot {
        background: #60a5fa;
        transform: scale(1.25);
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
    }

    .exp-header {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-bottom: 0.5rem;
    }

    @media (min-width: 640px) {
        .exp-header {
            flex-direction: row;
            align-items: baseline;
            justify-content: space-between;
        }
    }

    .exp-company {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text-primary);
        transition: color 0.3s;
    }

    .timeline-item:hover .exp-company {
        color: #60a5fa;
    }

    .exp-duration {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-primary);
        font-family: var(--font-mono);
        background: var(--color-surface);
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        width: fit-content;
    }

    .exp-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .exp-description {
        color: var(--color-text-secondary);
        line-height: 1.6;
        font-weight: 300;
        max-width: 48rem;
    }

    .exp-tech {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.875rem;
        color: var(--color-text-tertiary);
    }

    .tech-divider {
        width: 1rem;
        height: 1px;
        background: var(--color-glass-border);
    }

    .tech-stack {
        font-weight: 500;
        color: var(--color-text-secondary);
        letter-spacing: 0.025em;
    }
</style>
