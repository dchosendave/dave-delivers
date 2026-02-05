<script>
    import MatrixRain from "./effects/MatrixRain.svelte";
    import { onMount } from "svelte";

    // Typewriter state
    let displayedTagline = $state("");
    const fullTagline =
        "Backend Developer • System Architect • Code Enthusiast";
    let showCursor = $state(true);
    let showContent = $state(false);

    onMount(() => {
        // Fade in content after a brief delay
        setTimeout(() => {
            showContent = true;
        }, 300);

        // Start typewriter after name appears
        setTimeout(() => {
            typeWriter();
        }, 1500);

        // Blinking cursor
        const cursorInterval = setInterval(() => {
            showCursor = !showCursor;
        }, 530);

        return () => clearInterval(cursorInterval);
    });

    async function typeWriter() {
        for (let i = 0; i <= fullTagline.length; i++) {
            displayedTagline = fullTagline.slice(0, i);
            await new Promise((r) => setTimeout(r, 50));
        }
    }

    function navigateTo(view) {
        // Dispatch custom event for App.svelte to handle
        const event = new CustomEvent("navigate", {
            detail: { view },
            bubbles: true,
        });
        document.dispatchEvent(event);
    }
</script>

<div class="landing-wrapper">
    <MatrixRain />

    <div class="content" class:visible={showContent}>
        <h1 class="glitch" data-text="DAVE DICHOSON">DAVE DICHOSON</h1>

        <p class="tagline">
            {displayedTagline}<span class="cursor" class:visible={showCursor}
                >|</span
            >
        </p>

        <div class="cta-container">
            <button
                class="cta-btn terminal"
                onclick={() => navigateTo("terminal")}
            >
                <span class="icon">🖥️</span>
                <span class="label">Enter Terminal</span>
            </button>

            <button
                class="cta-btn portfolio"
                onclick={() => navigateTo("portfolio")}
            >
                <span class="icon">✨</span>
                <span class="label">View Portfolio</span>
            </button>
        </div>
    </div>
</div>

<style>
    .landing-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #0d1117;
    }

    .content {
        position: relative;
        z-index: 10;
        text-align: center;
        opacity: 0;
        transform: translateY(10px);
        transition: all 1s ease-out;
    }

    .content.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== MINIMAL NAME ===== */
    .glitch {
        font-family: "Courier New", Courier, monospace;
        font-size: clamp(1.5rem, 5vw, 2.5rem);
        font-weight: 400;
        letter-spacing: 0.3em;
        color: rgba(255, 255, 255, 0.9);
        position: relative;
        text-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
        animation: subtle-glitch 5s infinite;
    }

    .glitch::before,
    .glitch::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
    }

    .glitch::before {
        color: #0ff;
        animation: glitch-1 5s infinite;
    }

    .glitch::after {
        color: #f0f;
        animation: glitch-2 5s infinite;
    }

    @keyframes subtle-glitch {
        0%,
        95%,
        100% {
            transform: translate(0);
        }
        96% {
            transform: translate(-1px, 0);
        }
        97% {
            transform: translate(1px, 0);
        }
    }

    @keyframes glitch-1 {
        0%,
        94%,
        100% {
            opacity: 0;
            transform: translate(0);
        }
        95% {
            opacity: 0.3;
            transform: translate(-2px, 0);
        }
        96% {
            opacity: 0;
        }
    }

    @keyframes glitch-2 {
        0%,
        96%,
        100% {
            opacity: 0;
            transform: translate(0);
        }
        97% {
            opacity: 0.3;
            transform: translate(2px, 0);
        }
        98% {
            opacity: 0;
        }
    }

    /* ===== TAGLINE ===== */
    .tagline {
        font-family: "Courier New", Courier, monospace;
        font-size: clamp(0.7rem, 1.5vw, 0.9rem);
        color: rgba(136, 136, 136, 0.6);
        letter-spacing: 0.1em;
        margin: 2rem 0 4rem;
        min-height: 1.5em;
    }

    .cursor {
        color: #00ff00;
        opacity: 0;
        transition: opacity 0.1s;
    }

    .cursor.visible {
        opacity: 0.6;
    }

    /* ===== MINIMAL CTA BUTTONS ===== */
    .cta-container {
        display: flex;
        gap: 3rem;
        justify-content: center;
        flex-wrap: wrap;
    }

    .cta-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.5rem;
        font-family: "Courier New", Courier, monospace;
        font-size: 0.8rem;
        letter-spacing: 0.05em;
        border: none;
        border-radius: 0;
        cursor: pointer;
        transition: all 0.3s ease;
        background: transparent;
    }

    .cta-btn.terminal {
        color: rgba(0, 255, 0, 0.5);
        border-bottom: 1px solid rgba(0, 255, 0, 0.2);
    }

    .cta-btn.terminal:hover {
        color: rgba(0, 255, 0, 0.9);
        border-bottom-color: rgba(0, 255, 0, 0.6);
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }

    .cta-btn.portfolio {
        color: rgba(189, 94, 255, 0.5);
        border-bottom: 1px solid rgba(189, 94, 255, 0.2);
    }

    .cta-btn.portfolio:hover {
        color: rgba(189, 94, 255, 0.9);
        border-bottom-color: rgba(189, 94, 255, 0.6);
        text-shadow: 0 0 10px rgba(189, 94, 255, 0.3);
    }

    .icon {
        font-size: 1rem;
        opacity: 0.7;
    }
</style>
