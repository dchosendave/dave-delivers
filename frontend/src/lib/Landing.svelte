<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import ParticleNetwork from "./ParticleNetwork.svelte";

    let showName = $state(false);
    let showTagline = $state(false);
    let showButtons = $state(false);
    let showPreview = $state(false);
    let showStatus = $state(false);

    // Theme state
    let isDark = $state(true);

    let roles = $state<string[]>([]);
    let currentRoleIndex = 0;
    let displayedTagline = $state("");
    let isDeleting = false;
    let typingSpeed = 100;

    // Glitch State
    let displayedName = $state("");
    const finalName = "<Dave />";
    const glitchChars = "!<>-_\\/[]{}—=+*^?#________";

    // Interactive State
    let mouseX = $state(50);
    let mouseY = $state(50);
    let tiltX = $state(0);
    let tiltY = $state(0);

    onMount(() => {
        // Load saved theme
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            isDark = false;
            document.documentElement.classList.add("light");
        } else {
            document.documentElement.classList.remove("light");
        }

        const hour = new Date().getHours();
        let greeting = "Hello.";
        if (hour < 12) greeting = "Had your coffee?";
        else if (hour < 18) greeting = "You're just in time.";
        else if (hour < 22) greeting = "Good evening.";
        else greeting = "Staying up late?";
        roles = [
            greeting, // First role is the greeting
            "Backend Developer",
            "System Architect",
            "Database Engineer",
            "AI-assisted Development",
        ];

        // Staggered reveal animation
        setTimeout(() => {
            showName = true;
            runGlitchEffect(); // 2. TRIGGER GLITCH
        }, 300);
        setTimeout(() => (showName = true), 300);
        setTimeout(() => (showTagline = true), 600);
        setTimeout(() => (showButtons = true), 900);
        setTimeout(() => (showPreview = true), 1200);
        setTimeout(() => (showStatus = true), 1500);

        // Start typing loop
        typeLoop();
    });

    function runGlitchEffect() {
        // Start with the full final name
        displayedName = finalName;

        let iterations = 0;
        const maxIterations = 15; // Shorter duration

        const interval = setInterval(() => {
            // Only glitch 1 or 2 characters at a time, keeping the rest readable
            displayedName = finalName
                .split("")
                .map((letter, index) => {
                    // 95% chance to show the correct letter, 5% glitch
                    if (Math.random() < 0.95) {
                        return finalName[index];
                    }
                    return glitchChars[
                        Math.floor(Math.random() * glitchChars.length)
                    ];
                })
                .join("");
            if (iterations >= maxIterations) {
                clearInterval(interval);
                displayedName = finalName; // Ensure clean finish
            }
            iterations++;
        }, 70); // Slower updates (was 30)
    }

    function typeLoop() {
        const fullText = roles[currentRoleIndex];

        // Guard: roles may be empty on first call before onMount populates them
        if (!fullText) {
            setTimeout(typeLoop, 200);
            return;
        }

        if (isDeleting) {
            displayedTagline = fullText.substring(
                0,
                displayedTagline.length - 1,
            );
            typingSpeed = 50;
        } else {
            displayedTagline = fullText.substring(
                0,
                displayedTagline.length + 1,
            );
            typingSpeed = 100;
        }

        if (!isDeleting && displayedTagline === fullText) {
            isDeleting = true;
            typingSpeed = currentRoleIndex === 0 ? 3000 : 2000; // Pause at end
        } else if (isDeleting && displayedTagline === "") {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before new word
        }

        setTimeout(typeLoop, typingSpeed);
    }

    function handleMouseMove(
        e: MouseEvent & { currentTarget: HTMLDivElement },
    ) {
        // 1. Interactive Background Logic
        const { clientX, clientY, currentTarget } = e;
        const { width, height } = currentTarget.getBoundingClientRect();

        mouseX = (clientX / width) * 100;
        mouseY = (clientY / height) * 100;

        // 2. 3D Tilt Logic
        // Calculate rotational values based on mouse position relative to center
        // Range: -10deg to 10deg
        const xPct = clientX / width - 0.5;
        const yPct = clientY / height - 0.5;

        tiltX = yPct * -20; // Invert Y axis for natural tilt
        tiltY = xPct * 20;
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

    function navigateTo(view: string) {
        const paths: Record<string, string> = {
            terminal: "/desktop",
            portfolio: "/get-to-know-me",
        };

        goto(paths[view] || "/");
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="landing-wrapper"
    onmousemove={handleMouseMove}
    style="--mouse-x: {mouseX}%; --mouse-y: {mouseY}%;"
>
    <!-- Theme Toggle -->
    <button class="theme-toggle" onclick={toggleTheme} title="Toggle theme">
        {isDark ? "☀️" : "🌙"}
    </button>

    <!-- Interactive Gradient Background -->
    <div class="gradient-bg"></div>

    <ParticleNetwork {isDark} />

    <div class="content">
        <h1 class="name" class:visible={showName}>
            {displayedName}
        </h1>

        <!-- Typing Tagline -->
        <p class="tagline" class:visible={showTagline}>
            {displayedTagline}<span class="cursor">|</span>
        </p>

        <div class="cta-container" class:visible={showButtons}>
            <button
                class="cta-btn primary"
                onclick={() => navigateTo("terminal")}
            >
                View Desktop
            </button>
            <button
                class="cta-btn secondary"
                onclick={() => navigateTo("portfolio")}
            >
                Explore Portfolio
            </button>
        </div>

        <!-- 3D Tilt Terminal Preview -->
        <div class="perspective-container">
            <div
                class="terminal-preview"
                class:visible={showPreview}
                style="transform: rotateX({tiltX}deg) rotateY({tiltY}deg)"
            >
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
                <!-- Glossy reflection overlay -->
                <div class="gloss-overlay"></div>
            </div>
        </div>
    </div>

    <!-- Status Pill -->
    <div class="status-pill" class:visible={showStatus}>
        <span class="status-dot"></span>
        <span class="status-text">Available for hire</span>
        <span class="status-divider">•</span>
        <span class="status-loc">Taguig City, PH</span>
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
        background-color: var(--color-bg);
        overflow: hidden;
        perspective: 1000px; /* Required for 3D tilt */
    }

    /* ===== THEME TOGGLE ===== */
    .theme-toggle {
        position: absolute;
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

    /* ===== INTERACTIVE GRADIENT BACKGROUND ===== */
    .gradient-bg {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        /* Use mouse coordinates to move gradient center */
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
        transition: background 0.2s ease; /* Smooth follow delay */
        z-index: 0;
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
        color: var(--color-text-primary);
        margin: 0;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .name.visible {
        opacity: 1;
        transform: translateY(0);
    }

    /* ===== TAGLINE & TYPING ===== */
    .tagline {
        font-family:
            "Inter",
            -apple-system,
            sans-serif;
        font-size: clamp(1rem, 2.5vw, 1.4rem);
        font-weight: 400;
        color: var(--color-text-secondary);
        margin: 0;
        opacity: 0;
        min-height: 1.5em; /* Prevent layout shift */
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .tagline.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .cursor {
        color: var(--color-accent);
        font-weight: 300;
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
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
        color: var(--color-text-primary);
        border: 1px solid var(--color-glass-border);
    }

    .cta-btn.secondary:hover {
        background: var(--color-glass);
        border-color: var(--color-text-primary);
    }

    /* ===== 3D TERMINAL PREVIEW ===== */
    .perspective-container {
        margin-top: 4rem;
        perspective: 1000px;
        width: 100%;
        max-width: 500px;
    }

    .terminal-preview {
        width: 100%;
        background: rgba(30, 30, 30, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 12px;
        overflow: hidden;
        box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        opacity: 0;
        /* Start slightly tilted down */
        transform: translateY(30px) rotateX(20deg);
        transition:
            opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.1s ease-out; /* Fast transform for smooth tilt */

        position: relative;
    }

    .terminal-preview.visible {
        opacity: 1;
        /* Allow inline style to take over for tilt */
    }

    .gloss-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
        );
        pointer-events: none;
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
        margin-right: 52px;
    }

    .preview-content {
        padding: 20px;
        font-family: var(--font-mono);
        font-size: 0.9rem;
        color: #cccccc;
        line-height: 1.6;
        text-align: left;
    }

    .preview-content .prompt {
        color: #007aff;
        font-weight: 600;
    }
    .preview-content .output {
        color: #86868b;
    }

    /* ===== STATUS PILL ===== */
    .status-pill {
        position: absolute;
        bottom: 2rem;
        right: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--color-glass);
        backdrop-filter: blur(10px);
        border: 1px solid var(--color-glass-border);
        border-radius: 30px;
        font-family: "Inter", sans-serif;
        font-size: 0.8rem;
        color: var(--color-text-secondary);

        opacity: 0;
        transform: translateY(20px);
        transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .status-pill.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .status-dot {
        width: 8px;
        height: 8px;
        background-color: #28c840;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(40, 200, 64, 0.5);
        animation: pulse 2s infinite;
    }

    .status-divider {
        opacity: 0.3;
    }

    @keyframes pulse {
        0% {
            transform: scale(0.95);
            opacity: 0.7;
        }
        50% {
            transform: scale(1.1);
            opacity: 1;
        }
        100% {
            transform: scale(0.95);
            opacity: 0.7;
        }
    }
</style>
