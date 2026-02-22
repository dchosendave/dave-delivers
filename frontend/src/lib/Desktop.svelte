<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import Terminal from "./Terminal.svelte";
    import AboutModal from "./AboutModal.svelte";
    import ISSTracker from "./ISSTracker.svelte";
    import Window from "./Window.svelte";
    import ClockWidget from "./widgets/ClockWidget.svelte";
    import WeatherWidget from "./widgets/WeatherWidget.svelte";
    import type {
        WindowType,
        WindowState,
        WindowConfig,
    } from "./types/window-types";

    // Theme state
    let isDark = $state(true);
    let currentTime = $state("");
    let showBoot = $state(true);
    let bootPhase = $state(0);
    let showAboutModal = $state(false);

    // Window management state
    let openWindows = $state<WindowState[]>([]);
    let activeWindowId = $state<WindowType | null>(null);
    let nextZIndex = $state(100);

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
        await delay(400);
        bootPhase = 1; // Show logo
        await delay(800);
        bootPhase = 2; // Show progress bar + animate fill
        await delay(1500);
        bootPhase = 3; // Fade out
        await delay(600);
        showBoot = false; // Reveal desktop
    }

    function delay(ms: any) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Window Management Functions
    function getWindowConfig(type: WindowType): WindowConfig {
        switch (type) {
            case "terminal":
                return {
                    id: "terminal",
                    title: "Terminal",
                    icon: "⌘",
                };
            case "iss-tracker":
                return {
                    id: "iss-tracker",
                    title: "ISS Live Tracker",
                    icon: "🛰️",
                };
            case "nasa-apod":
                return {
                    id: "nasa-apod",
                    title: "NASA APOD",
                    icon: "🔭",
                };
        }
    }

    function openWindow(type: WindowType) {
        // Check if already open
        const existing = openWindows.find((w) => w.id === type);
        if (existing) {
            // Just focus it
            focusWindow(type);
            if (existing.isMinimized) {
                existing.isMinimized = false;
            }
            return;
        }

        // Create new window
        const config = getWindowConfig(type);
        openWindows.push({
            ...config,
            isMinimized: false,
            zIndex: nextZIndex++,
        });
        activeWindowId = type;
    }

    function closeWindow(id: WindowType) {
        openWindows = openWindows.filter((w) => w.id !== id);
        if (activeWindowId === id) {
            // Focus next visible window
            const visibleWindows = openWindows.filter((w) => !w.isMinimized);
            activeWindowId =
                visibleWindows[visibleWindows.length - 1]?.id ?? null;
        }
    }

    function minimizeWindow(id: WindowType) {
        const window = openWindows.find((w) => w.id === id);
        if (window) {
            window.isMinimized = true;
            // Focus next visible window
            const visibleWindows = openWindows.filter((w) => !w.isMinimized);
            activeWindowId =
                visibleWindows[visibleWindows.length - 1]?.id ?? null;
        }
    }

    function focusWindow(id: WindowType) {
        const window = openWindows.find((w) => w.id === id);
        if (window) {
            window.zIndex = nextZIndex++;
            activeWindowId = id;
        }
    }

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

    // Desktop icon definitions
    interface DesktopIcon {
        id: string;
        label: string;
        icon: string;
        action: () => void;
    }

    const desktopIcons: DesktopIcon[] = [
        {
            id: "resume",
            label: "Resume.pdf",
            icon: "📄",
            action: () =>
                window.open("/LDD - Resume January 2026 V2.pdf", "_blank"),
        },
        {
            id: "projects",
            label: "Projects",
            icon: "📁",
            action: () => navigateTo("portfolio"),
        },
        {
            id: "terminal",
            label: "Terminal",
            icon: "💻",
            action: () => openWindow("terminal"),
        },
        {
            id: "snake",
            label: "Snake AI",
            icon: "🐍",
            action: () => goto("/playground/snake"),
        },
        {
            id: "pacman",
            label: "Pac-Man AI",
            icon: "👻",
            action: () => goto("/playground/pacman"),
        },
        {
            id: "iss",
            label: "ISS Tracker",
            icon: "🛰️",
            action: () => openWindow("iss-tracker"),
        },
        {
            id: "nasa",
            label: "NASA APOD",
            icon: "🔭",
            action: () => openWindow("nasa-apod"),
        },
    ];

    let selectedIcon = $state<string | null>(null);
    let isTouchDevice = $state(false);

    onMount(() => {
        // Detect touch device once
        isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;
    });

    function handleIconClick(icon: DesktopIcon) {
        selectedIcon = icon.id;
        icon.action();
    }

    /** On touch devices, single-tap opens the icon (double-tap is unreliable). */
    function handleIconTap(e: TouchEvent, icon: DesktopIcon) {
        e.preventDefault(); // Prevent the subsequent mouse event
        handleIconClick(icon);
    }

    function handleDesktopClick(e: MouseEvent) {
        // Deselect icon if clicking on empty desktop area
        const target = e.target as HTMLElement;
        if (!target.closest(".desktop-icon")) {
            selectedIcon = null;
        }
    }
</script>

<div class="desktop-wrapper">
    <!-- Animated Gradient Background -->
    <div class="wallpaper"></div>
    <div class="wallpaper-grain"></div>

    <!-- Menu Bar -->
    <div class="menu-bar">
        <div class="menu-left">
            <button
                class="menu-brand-btn"
                onclick={() => (showAboutModal = true)}
            >
                <span class="menu-brand">Lowie Dave Dichoson</span>
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

    <!-- Boot Sequence (macOS-style) -->
    {#if showBoot}
        <div class="boot-screen" class:fade-out={bootPhase === 3}>
            {#if bootPhase >= 1}
                <div class="boot-logo">
                    <span class="boot-monogram">LDD</span>
                </div>
            {/if}
            {#if bootPhase >= 2}
                <div class="boot-progress-track">
                    <div class="boot-progress-fill"></div>
                </div>
            {/if}
        </div>
    {:else}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="desktop-area" onclick={handleDesktopClick}>
            <!-- macOS Desktop Icons (top-right grid) -->
            <div class="desktop-icons">
                {#each desktopIcons as icon (icon.id)}
                    <button
                        class="desktop-icon"
                        class:selected={selectedIcon === icon.id}
                        ondblclick={() => handleIconClick(icon)}
                        onclick={() => (selectedIcon = icon.id)}
                        ontouchend={(e) => handleIconTap(e, icon)}
                        title={icon.label}
                    >
                        <span class="desktop-icon-img">{icon.icon}</span>
                        <span class="desktop-icon-label">{icon.label}</span>
                    </button>
                {/each}
            </div>

            <!-- macOS Desktop Widgets (bottom-left) -->
            <div class="desktop-widgets">
                <ClockWidget />
                <WeatherWidget />
            </div>

            <!-- Windows -->
            {#each openWindows as window (window.id)}
                <Window
                    {window}
                    isActive={activeWindowId === window.id}
                    onClose={() => closeWindow(window.id)}
                    onMinimize={() => minimizeWindow(window.id)}
                    onFocus={() => focusWindow(window.id)}
                />
            {/each}
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

            <!-- Terminal -->
            <button
                class="dock-item"
                class:active={openWindows.some((w) => w.id === "terminal")}
                onclick={() => openWindow("terminal")}
                title="Terminal"
            >
                <span class="dock-icon">💻</span>
                {#if openWindows.some((w) => w.id === "terminal")}
                    <div class="dock-indicator"></div>
                {/if}
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

            <div class="dock-divider"></div>

            <!-- ISS Tracker -->
            <button
                class="dock-item"
                class:active={openWindows.some((w) => w.id === "iss-tracker")}
                onclick={() => openWindow("iss-tracker")}
                title="ISS Live Tracker"
            >
                <span class="dock-icon">🛰️</span>
                {#if openWindows.some((w) => w.id === "iss-tracker")}
                    <div class="dock-indicator"></div>
                {/if}
            </button>

            <button
                class="dock-item"
                class:active={openWindows.some((w) => w.id === "nasa-apod")}
                onclick={() => openWindow("nasa-apod")}
                title="NASA APOD"
            >
                <span class="dock-icon">🔭</span>
                {#if openWindows.some((w) => w.id === "nasa-apod")}
                    <div class="dock-indicator"></div>
                {/if}
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
                rgba(100, 80, 220, 0.55) 0%,
                transparent 45%
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 100, 180, 0.45) 0%,
                transparent 45%
            ),
            radial-gradient(
                circle at 50% 50%,
                rgba(60, 180, 255, 0.35) 0%,
                transparent 40%
            ),
            radial-gradient(
                circle at 70% 70%,
                rgba(255, 170, 60, 0.25) 0%,
                transparent 35%
            );
        animation: gradientMove 20s ease-in-out infinite;
        z-index: 0;
        /* Promote to own GPU compositing layer — prevents the infinite animation
           from triggering repaints on other page elements (huge win on integrated graphics) */
        will-change: transform;
        transform: translateZ(0);
    }

    :global(:root.light) .wallpaper {
        background: radial-gradient(
                circle at 20% 80%,
                rgba(100, 80, 220, 0.3) 0%,
                transparent 45%
            ),
            radial-gradient(
                circle at 80% 20%,
                rgba(255, 100, 180, 0.25) 0%,
                transparent 45%
            ),
            radial-gradient(
                circle at 50% 50%,
                rgba(60, 180, 255, 0.2) 0%,
                transparent 40%
            ),
            radial-gradient(
                circle at 70% 70%,
                rgba(255, 170, 60, 0.15) 0%,
                transparent 35%
            );
    }

    /* Subtle noise/grain texture — mimics macOS wallpaper grain */
    .wallpaper-grain {
        position: absolute;
        inset: 0;
        z-index: 1;
        opacity: 0.035;
        pointer-events: none;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 256px 256px;
    }

    :global(:root.light) .wallpaper-grain {
        opacity: 0.04;
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

    @media (max-width: 480px) {
        .menu-bar {
            padding: 0.5rem 0.75rem;
        }
        .menu-brand {
            font-size: 0.8rem;
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .menu-time {
            font-size: 0.75rem;
        }
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

    /* ===== BOOT SEQUENCE (macOS-style) ===== */
    .boot-screen {
        position: absolute;
        inset: 0;
        z-index: 150;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2.5rem;
        background: #000;
        transition: opacity 0.6s ease;
    }

    .boot-screen.fade-out {
        opacity: 0;
    }

    .boot-logo {
        animation: bootFadeIn 0.6s ease;
    }

    .boot-monogram {
        font-size: 4.5rem;
        font-weight: 700;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display",
            "Segoe UI", sans-serif;
        letter-spacing: -0.04em;
        display: block;
        text-align: center;
        opacity: 0.95;
    }

    .boot-progress-track {
        width: 200px;
        height: 4px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        overflow: hidden;
        animation: bootFadeIn 0.3s ease;
    }

    .boot-progress-fill {
        height: 100%;
        width: 0%;
        background: #fff;
        border-radius: 4px;
        animation: bootFill 1.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes bootFadeIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @keyframes bootFill {
        0% {
            width: 0%;
        }
        20% {
            width: 15%;
        }
        50% {
            width: 55%;
        }
        80% {
            width: 85%;
        }
        100% {
            width: 100%;
        }
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

    /* ===== DESKTOP AREA ===== */
    .desktop-area {
        position: relative;
        z-index: 10;
        flex: 1;
        animation: fadeIn 0.5s ease;
    }

    /* ===== DESKTOP WIDGETS ===== */
    .desktop-widgets {
        position: absolute;
        bottom: 5.5rem;
        left: 1.5rem;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        z-index: 5;
        animation: fadeIn 0.8s ease 0.3s both;
    }

    @media (max-width: 768px) {
        .desktop-widgets {
            bottom: 5rem;
            left: 0.75rem;
            gap: 0.5rem;
            flex-direction: column;
        }
    }

    @media (max-width: 480px) {
        .desktop-widgets {
            display: none;
        }
    }

    /* ===== DESKTOP ICONS (macOS-style) ===== */
    .desktop-icons {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: auto;
        gap: 0.25rem 0.5rem;
        justify-items: center;
        z-index: 5;
    }

    .desktop-icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        width: 80px;
        padding: 0.5rem 0.25rem;
        border: none;
        background: transparent;
        border-radius: 8px;
        cursor: default;
        transition: background 0.15s ease;
        user-select: none;
    }

    .desktop-icon:hover {
        background: rgba(255, 255, 255, 0.06);
    }

    .desktop-icon.selected {
        background: rgba(59, 130, 246, 0.25);
        outline: 1.5px solid rgba(59, 130, 246, 0.5);
        border-radius: 6px;
    }

    :global(:root.light) .desktop-icon:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    :global(:root.light) .desktop-icon.selected {
        background: rgba(59, 130, 246, 0.15);
        outline-color: rgba(59, 130, 246, 0.4);
    }

    .desktop-icon-img {
        font-size: 2.75rem;
        line-height: 1;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    .desktop-icon-label {
        font-size: 0.6875rem;
        font-weight: 500;
        color: #fff;
        text-align: center;
        line-height: 1.2;
        text-shadow:
            0 1px 3px rgba(0, 0, 0, 0.8),
            0 0 6px rgba(0, 0, 0, 0.4);
        word-break: break-word;
        max-width: 72px;
    }

    :global(:root.light) .desktop-icon-label {
        color: #1a1a1a;
        text-shadow:
            0 1px 3px rgba(255, 255, 255, 0.8),
            0 0 6px rgba(255, 255, 255, 0.4);
    }

    .desktop-icon.selected .desktop-icon-label {
        background: rgba(59, 130, 246, 0.7);
        color: #fff;
        text-shadow: none;
        border-radius: 3px;
        padding: 0 3px;
    }

    :global(:root.light) .desktop-icon.selected .desktop-icon-label {
        background: rgba(59, 130, 246, 0.6);
        color: #fff;
        text-shadow: none;
    }

    @media (max-width: 768px) {
        .desktop-icons {
            grid-template-columns: repeat(2, 1fr);
            right: 0.75rem;
            top: 0.5rem;
        }

        .desktop-icon {
            width: 68px;
        }

        .desktop-icon-img {
            font-size: 2.25rem;
        }

        .desktop-icon-label {
            font-size: 0.625rem;
        }
    }

    @media (max-width: 480px) {
        .desktop-icons {
            grid-template-columns: 1fr;
            right: 0.5rem;
            top: 0.5rem;
        }

        .desktop-icon {
            width: 60px;
        }

        .desktop-icon-img {
            font-size: 2rem;
        }
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
        max-width: 100vw;
        overflow-x: auto;
        /* Hide scrollbar for aesthetics */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE/Edge */
    }

    .dock-container::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    @media (max-width: 768px) {
        .dock-container {
            gap: 0.25rem;
            padding: 0.375rem 0.5rem;
        }

        .dock-item {
            width: 40px;
            height: 40px;
            min-width: 40px;
        }

        .dock-icon {
            font-size: 1.35rem;
        }

        .dock-divider {
            height: 28px;
            margin: 0 0.125rem;
        }
    }

    @media (max-width: 480px) {
        .dock {
            padding: 0.5rem;
        }

        .dock-container {
            gap: 0.125rem;
            padding: 0.25rem 0.375rem;
            border-radius: 16px;
        }

        .dock-item {
            width: 36px;
            height: 36px;
            min-width: 36px;
            border-radius: 10px;
        }

        .dock-icon {
            font-size: 1.2rem;
        }

        .dock-divider {
            height: 24px;
        }
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

    .dock-indicator {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
        animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
        0%,
        100% {
            opacity: 0.8;
        }
        50% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }
    }

    .dock-divider {
        width: 1px;
        height: 40px;
        background: var(--color-glass-border);
        margin: 0 0.25rem;
    }
</style>
