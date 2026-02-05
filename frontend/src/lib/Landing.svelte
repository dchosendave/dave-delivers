<script>
    import { onMount } from "svelte";

    let showName = $state(false);
    let showTagline = $state(false);
    let showButtons = $state(false);
    let showPreview = $state(false);

    onMount(() => {
        // Staggered reveal animation (faster for Apple feel)
        setTimeout(() => (showName = true), 300);
        setTimeout(() => (showTagline = true), 600);
        setTimeout(() => (showButtons = true), 900);
        setTimeout(() => (showPreview = true), 1200);
    });

    function navigateTo(view) {
        const event = new CustomEvent("navigate", {
            detail: { view },
            bubbles: true,
        });
        document.dispatchEvent(event);
    }
</script>

<div class="landing-wrapper">
    <!-- Gradient Mesh Background -->
    <div class="gradient-bg"></div>

    <div class="content">
        <h1 class="name" class:visible={showName}>Dave Dichoson</h1>

        <p class="tagline" class:visible={showTagline}>
            Backend Developer, Database Engineer, & Systems Architect
        </p>

        <div class="cta-container" class:visible={showButtons}>
            <button
                class="cta-btn primary"
                onclick={() => navigateTo("terminal")}
            >
                View Terminal
            </button>
            <button
                class="cta-btn secondary"
                onclick={() => navigateTo("portfolio")}
            >
                Explore Portfolio
            </button>
        </div>

        <!-- Optional: Floating Terminal Preview -->
        <div class="terminal-preview" class:visible={showPreview}>
            <div class="preview-header">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
                <span class="preview-title">visitor@dchosen:~</span>
            </div>
            <div class="preview-content">
                <span class="prompt">$</span> help<br />
                <span class="output"
                    >Available commands: about, projects, skills...</span
                >
            </div>
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
        background-color: #1d1d1f;
        overflow: hidden;
    }

    /* ===== ANIMATED GRADIENT BACKGROUND ===== */
    .gradient-bg {
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
        animation: gradientMove 15s ease-in-out infinite;
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

    .content {
        position: relative;
        z-index: 10;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem;
    }

    /* ===== NAME ===== */
    .name {
        font-family:
            "Inter",
            -apple-system,
            sans-serif;
        font-size: clamp(2.5rem, 8vw, 5rem);
        font-weight: 600;
        letter-spacing: -0.02em;
        color: #ffffff;
        margin: 0;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .name.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== TAGLINE ===== */
    .tagline {
        font-family:
            "Inter",
            -apple-system,
            sans-serif;
        font-size: clamp(1rem, 2.5vw, 1.4rem);
        font-weight: 400;
        color: #86868b;
        margin: 0;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .tagline.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== CTA BUTTONS ===== */
    .cta-container {
        display: flex;
        gap: 1rem;
        margin-top: 1.5rem;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cta-container.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .cta-btn {
        font-family:
            "Inter",
            -apple-system,
            sans-serif;
        font-size: 1rem;
        font-weight: 500;
        padding: 0.875rem 2rem;
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }

    .cta-btn.primary {
        background: linear-gradient(135deg, #007aff 0%, #5856d6 100%);
        color: #ffffff;
        box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
    }

    .cta-btn.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 122, 255, 0.4);
    }

    .cta-btn.secondary {
        background: transparent;
        color: #ffffff;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .cta-btn.secondary:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.5);
    }

    /* ===== TERMINAL PREVIEW ===== */
    .terminal-preview {
        margin-top: 4rem;
        width: 100%;
        max-width: 500px;
        background: rgba(30, 30, 30, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        overflow: hidden;
        box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        opacity: 0;
        transform: translateY(30px);
        transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .terminal-preview.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .preview-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(60, 60, 60, 0.5);
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .dot.red {
        background: #ff5f57;
    }
    .dot.yellow {
        background: #ffbd2e;
    }
    .dot.green {
        background: #28c840;
    }

    .preview-title {
        flex: 1;
        text-align: center;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: #86868b;
        margin-right: 52px; /* Balance the dots */
    }

    .preview-content {
        padding: 20px;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: #cccccc;
        line-height: 1.6;
    }

    .preview-content .prompt {
        color: #007aff;
        font-weight: 600;
    }

    .preview-content .output {
        color: #86868b;
    }
</style>
