<script lang="ts">
    import { onMount } from "svelte";
    import SkillCard from "./SkillCard.svelte";
    import { fadeIn, scaleIn, staggerDelay } from "../animations.js";
    import { getSkills } from "$lib/api/portfolio";
    import type { Skill } from "$lib/types";

    let skills: Skill[] = [];

    onMount(async () => {
        try {
            skills = await getSkills();
        } catch (err) {
            console.error("Failed to load skills:", err);
        }
    });
</script>

<section class="skills-section">
    <!-- Header -->
    <!--
        ANIMATION: Fade in header
    -->
    <div class="section-header" use:fadeIn>
        <h2 class="section-title">Technical Arsenal</h2>
        <p class="section-description">
            Tools, languages, and frameworks I use to build systems.
        </p>
    </div>

    <!-- Skills Grid -->
    <!--
        ANIMATION: Each skill card scales in with stagger
        Note: The SkillCard already has 3D flip interaction
        We're adding scroll animation on top of that!
        The scaleIn wraps around the entire SkillCard component
    -->
    <div class="skills-grid">
        {#each skills as skill, i}
            <div use:scaleIn={{ delay: staggerDelay(i, 100) }}>
                <SkillCard {skill} />
            </div>
        {/each}
    </div>
</section>

<style>
    .skills-section {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        padding-bottom: 5rem;
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

    .skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
    }

    @media (min-width: 768px) {
        .skills-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1024px) {
        .skills-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }
</style>
