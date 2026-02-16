<script lang="ts">
    import { onMount } from "svelte";

    /**
     * IMPORT ANIMATIONS
     * - fadeIn: For section header
     * - scaleIn: For project cards (looks great on cards!)
     * - staggerDelay: To make cards appear one by one
     */
    import { fadeIn, scaleIn, staggerDelay } from "../animations.js";

    let projects: any[] = [];

    onMount(async () => {
        try {
            const res = await fetch("/api/projects");
            projects = await res.json();
        } catch (err) {
            console.error(err);
        }
    });
</script>

<section class="projects-section">
    <!-- Section Header -->
    <!--
        ANIMATION: Fade in the header when it enters viewport
        This creates a nice introduction to the Projects section
    -->
    <div class="section-header" use:fadeIn>
        <h2 class="section-title">Selected Works</h2>
        <p class="section-description">
            A collection of systems, APIs, and tools I've engineered.
        </p>
    </div>

    <!-- Grid Layout -->
    <!--
        ANIMATION: Each project card scales in with a staggered delay
        - Card 0: 0ms delay
        - Card 1: 150ms delay  
        - Card 2: 300ms delay
        - Creates a cascading "pop-in" effect as you scroll
        
        Why scaleIn? Cards growing into view feels more natural than sliding
    -->
    <div class="projects-grid">
        {#each projects as project, i}
            <!-- Card -->
            <div
                class="project-card"
                use:scaleIn={{ delay: staggerDelay(i, 150) }}
            >
                <div>
                    <!-- Title -->
                    <h3 class="project-title">
                        {project.name}
                    </h3>

                    <!-- Description -->
                    <p class="project-description">
                        {project.description}
                    </p>
                </div>

                <div class="project-footer">
                    <!-- Tech Stack Pills -->
                    <div class="tech-tags">
                        {#each project.tags.split(",") as tag}
                            <span class="tech-tag">
                                {tag.trim()}
                            </span>
                        {/each}
                    </div>

                    <!-- Link (Conditional) -->
                    {#if project.url}
                        <a
                            href={project.url}
                            target="_blank"
                            class="project-link"
                        >
                            View Source
                            <svg
                                class="link-arrow"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                ></path></svg
                            >
                        </a>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    .projects-section {
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

    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    @media (min-width: 768px) {
        .projects-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .projects-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .project-card {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2rem;
        border-radius: 2rem;
        background: var(--color-surface);
        backdrop-filter: blur(20px);
        border: 1px solid var(--color-glass-border);
        transition: all 0.3s ease-out;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    }

    .project-card:hover {
        background: var(--color-glass);
        border-color: var(--color-glass-border);
        transform: translateY(-4px);
    }

    .project-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 0.75rem;
        transition: color 0.3s;
    }

    .project-card:hover .project-title {
        color: #60a5fa;
    }

    .project-description {
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin-bottom: 1.5rem;
        font-weight: 300;
    }

    .project-footer {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .tech-tag {
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 500;
        letter-spacing: 0.025em;
        color: #93c5fd;
        background: rgba(59, 130, 246, 0.1);
        border-radius: 9999px;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .project-link {
        display: inline-flex;
        align-items: center;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        text-decoration: none;
        transition: color 0.3s;
    }

    .project-link:hover {
        color: var(--color-text-primary);
    }

    .link-arrow {
        width: 1rem;
        height: 1rem;
        margin-left: 0.25rem;
        opacity: 0.5;
    }
</style>
