<script lang="ts">
    import { onMount } from "svelte";
    import Terminal from "./Terminal.svelte";
    import AboutModal from "./AboutModal.svelte";

    // Theme state
    let isDark = $state(true);
    let currentTime = $state("");
    let showBoot = $state(true);
    let bootPhase = $state(0);
    let showAboutModal = $state(false);

    onMount(() => {
        // Load saved theme
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            isDark = false;
            document.documentElement.classList.add("light");
        }

        // Update clock every second
        updateClock();
        const clockInterval = setInterval(updateClock, 1000);

        // Boot sequence
        runBootSequence();

        return () => clearInterval(clockInterval);
    });

    function updateClock() {
        const now = new Date();
        currentTime = now.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
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

    async function runBootSequence() {
        // Phase 0: Black screen (already set)
        await delay(500);
        bootPhase = 1; // Show ASCII logo
        await delay(1500);
        bootPhase = 2; // Show loading
        await delay(1000);
        bootPhase = 3; // Fade out
        await delay(500);
        showBoot = false; // Show terminal
    }

    function delay(ms: any) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    import { goto } from "$app/navigation";

    function navigateTo(view: string) {
        const paths: Record<string, string> = {
            landing: "/",
            portfolio: "/get-to-know-me",
        };
        goto(paths[view] || "/");
    }

    function openLink(url: any) {
        window.open(url, "_blank");
    }
</script>

<div class="desktop-wrapper">
    <!-- Animated Gradient Background -->
    <div class="wallpaper"></div>

    <!-- Menu Bar -->
    <div class="menu-bar">
        <div class="menu-left">
            <button
                class="menu-brand-btn"
                onclick={() => (showAboutModal = true)}
            >
                <span class="menu-brand">Dave Dichoson</span>
            </button>
        </div>
        <div class="menu-right">
            <button
                class="menu-icon"
                onclick={toggleTheme}
                title="Toggle theme"
            >
                {isDark ? "☀️" : "🌙"}
            </button>
            <span class="menu-time">{currentTime}</span>
        </div>
    </div>

    <!-- About Modal -->
    {#if showAboutModal}
        <AboutModal onClose={() => (showAboutModal = false)} />
    {/if}

    <!-- Boot Sequence -->
    {#if showBoot}
        <div class="boot-screen" class:fade-out={bootPhase === 3}>
            {#if bootPhase >= 1}
                <pre class="boot-logo">
 ____   ____ _   _  ___  ____  _____ _   _ 
|  _ \ / ___| | | |/ _ \/ ___|| ____| \ | |
| | | | |   | |_| | | | \___ \|  _| |  \| |
| |_| | |___|  _  | |_| |___) | |___| |\  |
|____/ \____|_| |_|\___/|____/|_____|_| \_|
        </pre>
            {/if}
            {#if bootPhase >= 2}
                <p class="boot-loading">
                    Initializing terminal<span class="dots">...</span>
                </p>
            {/if}
        </div>
    {:else}
        <!-- Terminal Window -->
        <div class="terminal-area">
            <Terminal />
        </div>
    {/if}

    <!-- Dock -->
    <div class="dock">
        <div class="dock-container">
            <button
                class="dock-item"
                onclick={() => navigateTo("landing")}
                title="Home"
            >
                <span class="dock-icon">🏠</span>
            </button>

            <div class="dock-divider"></div>

            <button class="dock-item active" title="Terminal">
                <span class="dock-icon">💻</span>
            </button>

            <button
                class="dock-item"
                onclick={() => navigateTo("portfolio")}
                title="Portfolio"
            >
                <span class="dock-icon">📁</span>
            </button>

            <div class="dock-divider"></div>

            <button
                class="dock-item"
                onclick={() => openLink("mailto:lowiedave30@gmail.com")}
                title="Email"
            >
                <span class="dock-icon">📧</span>
            </button>

            <button
                class="dock-item"
                onclick={() => openLink("https://linkedin.com/in/davedichoson")}
                title="LinkedIn"
            >
                <span class="dock-icon">💼</span>
            </button>

            <button
                class="dock-item"
                onclick={() => openLink("https://github.com/dchosendave")}
                title="GitHub"
            >
                <span class="dock-icon">🐙</span>
            </button>

            <div class="dock-divider"></div>

            <!-- Games Section -->
            <button
                class="dock-item"
                onclick={() => goto("/playground/snake")}
                title="Snake AI - BFS Pathfinding"
            >
                <span class="dock-icon">🐍</span>
            </button>

            <button
                class="dock-item"
                onclick={() => goto("/playground/pacman")}
                title="Pac-Man AI - A* Pathfinding"
            >
                <span class="dock-icon">👻</span>
            </button>
        </div>
    </div>
</div>

<style>
    .desktop-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        background-color: var(--color-bg);
        overflow: hidden;
    }

    /* ===== ANIMATED WALLPAPER ===== */
    .wallpaper {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(
                circle at 20% 80%,
                rgba(120, 119, 198, 0.3) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 119, 198, 0.2) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 40% 40%,
                rgba(90, 200, 250, 0.2) 0%,
                transparent 40%
            );
        animation: gradientMove 20s ease-in-out infinite;
        z-index: 0;
    }

    :global(:root.light) .wallpaper {
        background: radial-gradient(
                circle at 20% 80%,
                rgba(120, 119, 198, 0.15) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 119, 198, 0.1) 0%,
                transparent 50%
            ),
            radial-gradient(
                circle at 40% 40%,
                rgba(90, 200, 250, 0.1) 0%,
                transparent 40%
            );
    }

    @keyframes gradientMove {
        0%,
        100% {
            transform: translate(0, 0) rotate(0deg);
        }
        33% {
            transform: translate(2%, 2%) rotate(1deg);
        }
        66% {
            transform: translate(-1%, 1%) rotate(-1deg);
        }
    }

    /* ===== MENU BAR ===== */
    .menu-bar {
        position: relative;
        z-index: 200;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1.5rem;
        background: var(--color-glass);
        backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--color-glass-border);
    }

    .menu-left {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .menu-brand-btn {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .menu-brand {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--color-text-primary);
    }

    .menu-right {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .menu-icon {
        background: none;
        border: none;
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .menu-icon:hover {
        background: var(--color-glass);
    }

    .menu-time {
        font-size: 0.85rem;
        color: var(--color-text-secondary);
    }

    /* ===== BOOT SEQUENCE ===== */
    .boot-screen {
        position: absolute;
        inset: 0;
        z-index: 150;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #000;
        transition: opacity 0.5s ease;
    }

    .boot-screen.fade-out {
        opacity: 0;
    }

    .boot-logo {
        font-family: var(--font-mono);
        font-size: clamp(0.4rem, 1.5vw, 0.8rem);
        color: #00ff00;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        animation: fadeIn 0.5s ease;
        text-align: center;
        white-space: pre;
    }

    .boot-loading {
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: #00ff00;
        margin-top: 2rem;
        animation: fadeIn 0.5s ease;
    }

    .dots {
        animation: blink 1s infinite;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes blink {
        0%,
        50% {
            opacity: 1;
        }
        51%,
        100% {
            opacity: 0;
        }
    }

    /* ===== TERMINAL AREA ===== */
    .terminal-area {
        position: relative;
        z-index: 10;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        padding-top: 1rem;
        padding-bottom: 100px;
        animation: fadeIn 0.5s ease;
    }

    /* ===== DOCK ===== */
    .dock {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        padding: 0.75rem;
        z-index: 100;
    }

    .dock-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--color-glass);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        border: 1px solid var(--color-glass-border);
    }

    .dock-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        background: transparent;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .dock-item:hover {
        background: var(--color-glass);
        transform: translateY(-4px) scale(1.1);
    }

    .dock-item.active {
        background: var(--color-glass);
    }

    .dock-item.active::after {
        content: "";
        position: absolute;
        bottom: -4px;
        width: 4px;
        height: 4px;
        background: var(--color-text-primary);
        border-radius: 50%;
    }

    .dock-icon {
        font-size: 1.75rem;
    }

    .dock-divider {
        width: 1px;
        height: 40px;
        background: var(--color-glass-border);
        margin: 0 0.25rem;
    }
</style>
