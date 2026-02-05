<script>
    import Terminal from "./Terminal.svelte";

    function navigateTo(view) {
        const event = new CustomEvent("navigate", {
            detail: { view },
            bubbles: true,
        });
        document.dispatchEvent(event);
    }

    function openLink(url) {
        window.open(url, "_blank");
    }
</script>

<div class="desktop-wrapper">
    <!-- Animated Gradient Background -->
    <div class="wallpaper"></div>

    <!-- Terminal Window -->
    <div class="terminal-area">
        <Terminal />
    </div>

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
        background-color: #1d1d1f;
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

    /* ===== TERMINAL AREA ===== */
    .terminal-area {
        position: relative;
        z-index: 10;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        padding-bottom: 100px; /* Space for dock */
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
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(20px);
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .dock-item {
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
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-4px) scale(1.1);
    }

    .dock-item.active {
        background: rgba(255, 255, 255, 0.1);
    }

    .dock-item.active::after {
        content: "";
        position: absolute;
        bottom: 4px;
        width: 4px;
        height: 4px;
        background: white;
        border-radius: 50%;
    }

    .dock-icon {
        font-size: 1.75rem;
    }

    .dock-divider {
        width: 1px;
        height: 40px;
        background: rgba(255, 255, 255, 0.15);
        margin: 0 0.25rem;
    }
</style>
