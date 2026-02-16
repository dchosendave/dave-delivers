<script lang="ts">
    import { onMount } from "svelte";
    import Hero from "./Hero.svelte";
    import Projects from "./Projects.svelte";
    import Skills from "./Skills.svelte";
    import Experience from "./Experience.svelte";
    import GitHubActivity from "./GitHubActivity.svelte";
    import ParticleNetwork from "../ParticleNetwork.svelte";

    let isDark = $state(true);
    let mouseX = $state(50);
    let mouseY = $state(50);

    onMount(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            isDark = false;
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
        }
    });

    /**
     * NAVIGATION - Updated for URL routing
     * Goes back to landing page (/)
     */
    import { goto } from "$app/navigation";

    function goHome() {
        goto("/");
    }

    function toggleTheme() {
        isDark = !isDark;
        if (isDark) {
            document.documentElement.classList.remove("light");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.add("light");
            localStorage.setItem("theme", "light");
        }
    }

    function handleMouseMove(e: any) {
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();
        mouseX = (clientX / width) * 100;
        mouseY = (clientY / height) * 100;
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="portfolio-wrapper"
    onmousemove={handleMouseMove}
    style="--mouse-x: {mouseX}%; --mouse-y: {mouseY}%;"
>
    <!-- Interactive Gradient Background -->
    <div class="gradient-bg"></div>

    <ParticleNetwork {isDark} />

    <!-- Theme Toggle -->
    <button class="theme-toggle" onclick={toggleTheme} title="Toggle theme">
        {isDark ? "☀️" : "🌙"}
    </button>

    <!-- macOS-style Back Button -->
    <nav class="back-button">
        <button onclick={goHome} class="macos-back-btn">
            <svg
                class="chevron-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
            >
                <path
                    d="M15 18l-6-6 6-6"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
            <span>Home</span>
        </button>
    </nav>

    <!-- Content Stack -->
    <main class="content-main">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <GitHubActivity />
    </main>

    <footer class="footer">
        <p>Designed by Lowie Dave Dichoson in 2026</p>
    </footer>
</div>

<style>
    .portfolio-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--color-bg);
        color: var(--color-text-primary);
        font-family: var(--font-system);
        overflow-y: auto;
        overflow-x: hidden;
    }

    /* ===== INTERACTIVE GRADIENT BACKGROUND ===== */
    .gradient-bg {
        position: fixed;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
                circle at var(--mouse-x) var(--mouse-y),
                rgba(120, 119, 198, 0.4) 0%,
                transparent 40%
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 119, 198, 0.2) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 20% 80%,
                rgba(90, 200, 250, 0.2) 0%,
                transparent 50%
            );
        transition: background 0.2s ease;
        z-index: 0;
        pointer-events: none;
    }

    /* Light theme background adjustment */
    :global(:root.light) .gradient-bg {
        background: radial-gradient(
                circle at var(--mouse-x) var(--mouse-y),
                rgba(120, 119, 198, 0.2) 0%,
                transparent 40%
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 119, 198, 0.1) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 20% 80%,
                rgba(90, 200, 250, 0.1) 0%,
                transparent 50%
            );
    }

    /* ===== THEME TOGGLE ===== */
    .theme-toggle {
        position: fixed;
        top: 2rem;
        right: 2rem;
        z-index: 100;
        background: transparent;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.5;
        transition:
            opacity 0.3s,
            transform 0.3s;
    }

    .theme-toggle:hover {
        opacity: 1;
        transform: scale(1.1);
    }

    /* ===== MACOS-STYLE BACK BUTTON ===== */
    .back-button {
        position: fixed;
        top: 1.5rem;
        left: 1.5rem;
        z-index: 50;
    }

    .macos-back-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0.75rem;
        padding-left: 0.5rem;
        font-size: 0.9375rem;
        font-weight: 400;
        color: var(--color-text-primary);
        background: transparent;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s ease;
        font-family: var(--font-system);
    }

    .macos-back-btn:hover {
        background: var(--color-surface);
    }

    .macos-back-btn:active {
        transform: scale(0.98);
        opacity: 0.6;
    }

    .chevron-icon {
        width: 16px;
        height: 16px;
        stroke-width: 2.5;
        opacity: 0.8;
    }

    /* ===== MAIN CONTENT ===== */
    .content-main {
        position: relative;
        z-index: 10;
        max-width: 80rem;
        margin: 0 auto;
        padding: 5rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 8rem;
    }

    /* ===== FOOTER ===== */
    .footer {
        position: relative;
        z-index: 10;
        padding: 3rem 0;
        text-align: center;
        opacity: 0.4;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
    }
</style>
