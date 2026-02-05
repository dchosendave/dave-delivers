<script>
    import MatrixRain from "./effects/MatrixRain.svelte";
    import { onMount } from "svelte";

    let showGreeting = $state(false);
    let showName = $state(false);
    let showTagline = $state(false);
    let showButtons = $state(false);

    onMount(() => {
        // Staggered reveal animation
        setTimeout(() => (showGreeting = true), 500);
        setTimeout(() => (showName = true), 1200);
        setTimeout(() => (showTagline = true), 2000);
        setTimeout(() => (showButtons = true), 2800);
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
    <MatrixRain />

    <div class="content">
        <p class="greeting" class:visible={showGreeting}>
            H E L L O &nbsp; W O R L D
        </p>

        <h1 class="name" class:visible={showName}>
            D A V Ǝ &nbsp; D I C H O Ƨ O И
        </h1>

        <p class="tagline" class:visible={showTagline}>backend developer</p>

        <nav class="cta-container" class:visible={showButtons}>
            <button class="cta-link" onclick={() => navigateTo("terminal")}>
                Enter Terminal
            </button>
            <span class="divider">/</span>
            <button class="cta-link" onclick={() => navigateTo("portfolio")}>
                View Portfolio
            </button>
        </nav>
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
        background-color: #0a0a0a;
    }

    .content {
        position: relative;
        z-index: 10;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    /* ===== GREETING ===== */
    .greeting {
        font-family: "Courier New", Courier, monospace;
        font-size: clamp(0.6rem, 1.5vw, 0.9rem);
        font-weight: 300;
        letter-spacing: 0.5em;
        color: rgba(255, 255, 255, 0.4);
        margin: 0;
        opacity: 0;
        transform: translateY(10px);
        transition: all 1.5s ease-out;
    }

    .greeting.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== NAME ===== */
    .name {
        font-family: "Courier New", Courier, monospace;
        font-size: clamp(1.2rem, 4vw, 2.2rem);
        font-weight: 200;
        letter-spacing: 0.4em;
        color: rgba(255, 255, 255, 0.85);
        margin: 0.5rem 0;
        opacity: 0;
        transform: translateY(10px);
        transition: all 1.5s ease-out;
        text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
    }

    .name.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== TAGLINE ===== */
    .tagline {
        font-family: "Courier New", Courier, monospace;
        font-size: clamp(0.5rem, 1.2vw, 0.75rem);
        font-weight: 300;
        letter-spacing: 0.3em;
        color: rgba(255, 255, 255, 0.3);
        margin: 0;
        opacity: 0;
        transform: translateY(10px);
        transition: all 1.5s ease-out;
    }

    .tagline.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== MINIMAL CTA LINKS ===== */
    .cta-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 3rem;
        opacity: 0;
        transform: translateY(10px);
        transition: all 1.5s ease-out;
    }

    .cta-container.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .cta-link {
        font-family: "Courier New", Courier, monospace;
        font-size: 0.7rem;
        font-weight: 300;
        letter-spacing: 0.15em;
        color: rgba(255, 255, 255, 0.35);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 0;
        transition: all 0.3s ease;
        text-decoration: none;
    }

    .cta-link:hover {
        color: rgba(255, 255, 255, 0.9);
        text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }

    .divider {
        color: rgba(255, 255, 255, 0.15);
        font-weight: 200;
    }
</style>
