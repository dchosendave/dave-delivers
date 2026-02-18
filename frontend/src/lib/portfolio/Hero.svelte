<script lang="ts">
    import { onMount } from "svelte";
    import { fadeIn, slideInLeft, staggerDelay } from "../animations.js";
    import { getContacts } from "$lib/api/portfolio";
    import { CONTACT_LABELS } from "$lib/utils/constants";
    import type { Contact } from "$lib/types";

    let contacts: Contact[] = [];

    onMount(async () => {
        try {
            contacts = await getContacts();
        } catch (error) {
            console.error("Failed to load contacts", error);
        }
    });

    function getLabel(type: string): string {
        return CONTACT_LABELS[type] ?? type;
    }
</script>

<section class="hero-section">
    <!-- Background Gradient Blob (Subtle Apple Glow) -->
    <div class="glow-blob-1"></div>
    <div class="glow-blob-2"></div>

    <!-- Main Content -->
    <!-- 
        STEP 2: Apply the fadeIn animation
        - use:fadeIn tells Svelte to run our fadeIn function on this element
        - It works automatically when the element enters the viewport
        - Think of it like @decorator in Python or middleware in Express
    -->
    <div class="hero-content" use:fadeIn>
        <!-- Badge -->
        <span class="hero-badge"> Available for Hire </span>

        <!-- Headline -->
        <h1 class="hero-title">
            Lowie Dave <br /> Dichoson.
        </h1>

        <!-- Subtitle -->
        <p class="hero-description">
            Experienced <span class="hero-highlight"
                >.NET Backend Developer.</span
            >
            <br />
            Turning complex business requirements into clean, scalable software solutions.
        </p>

        <!-- Dynamic Contacts Buttons -->
        <!--
            STEP 3: Add staggered animations to contact buttons
            - Each button slides in from the left
            - staggerDelay(i, 100) creates 100ms delay between each button
            - Button 0: 0ms delay, Button 1: 100ms delay, Button 2: 200ms delay, etc.
            - Creates a "cascading" effect
        -->
        <div class="hero-contacts">
            {#each contacts as contact, i}
                <a
                    href={contact.url || "#"}
                    target="_blank"
                    class="contact-button"
                    use:slideInLeft={{ delay: staggerDelay(i, 100) }}
                >
                    <!-- Icon placeholder -->
                    <span class="contact-icon">
                        <!-- You can replace this later with actual SVG icons -->
                        {getLabel(contact.type)}
                    </span>
                    <span class="contact-value">{contact.value}</span>
                </a>
            {/each}
        </div>
    </div>
</section>

<style>
    .hero-section {
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        position: relative;
    }

    .glow-blob-1 {
        position: absolute;
        top: -5rem;
        right: -5rem;
        width: 24rem;
        height: 24rem;
        background: rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        filter: blur(128px);
        pointer-events: none;
    }

    .glow-blob-2 {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 16rem;
        height: 16rem;
        background: rgba(139, 92, 246, 0.1);
        border-radius: 50%;
        filter: blur(96px);
        pointer-events: none;
    }

    .hero-content {
        z-index: 10;
        max-width: 42rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .hero-badge {
        display: inline-block;
        width: fit-content;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        background: rgba(59, 130, 246, 0.1);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .hero-title {
        font-size: clamp(3rem, 8vw, 5rem);
        font-weight: 900;
        letter-spacing: -0.02em;
        line-height: 1;
        background: linear-gradient(
            to bottom right,
            var(--color-text-primary),
            var(--color-text-secondary)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .hero-description {
        font-size: clamp(1.25rem, 2.5vw, 1.5rem);
        color: var(--color-text-secondary);
        font-weight: 300;
        line-height: 1.6;
        max-width: 32rem;
    }

    .hero-highlight {
        color: var(--color-text-primary);
        font-weight: 500;
    }

    .hero-contacts {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding-top: 1rem;
    }

    .contact-button {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 1rem;
        background: var(--color-surface);
        backdrop-filter: blur(12px);
        border: 1px solid var(--color-glass-border);
        color: var(--color-text-primary);
        text-decoration: none;
        transition: all 0.3s;
        cursor: pointer;
    }

    .contact-button:hover {
        background: var(--color-glass);
        border-color: var(--color-glass-border);
        transform: scale(1.05);
    }

    .contact-icon {
        font-size: 1.125rem;
        opacity: 0.8;
        transition: opacity 0.3s;
    }

    .contact-button:hover .contact-icon {
        opacity: 1;
    }

    .contact-value {
        font-size: 0.875rem;
        font-weight: 500;
    }
</style>
