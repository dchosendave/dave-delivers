<script>
    export let skill;

    let rotX = 0;
    let rotY = 0;
    let isflipped = false;

    function handleMouseMove(e) {
        // Get card dimensions and position
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to center of card
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Calculate rotation (max 15 degrees)
        rotY = (x / (rect.width / 2)) * 15;
        rotX = -(y / (rect.height / 2)) * 15;
    }

    function handleMouseLeave() {
        rotX = 0;
        rotY = 0;
    }

    // Determine color based on proficiency for the back glow
    function getGlowColor(proficiency) {
        if (proficiency >= 90) return "rgba(168,85,247,0.5)"; // Purple
        if (proficiency >= 75) return "rgba(59,130,246,0.5)"; // Blue
        return "rgba(100,116,139,0.5)"; // Slate
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="card-wrapper"
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    on:click={() => (isflipped = !isflipped)}
>
    <div
        class="card-inner"
        style="transform: rotateX({isflipped
            ? 180
            : rotX}deg) rotateY({isflipped ? 0 : rotY}deg)"
    >
        <!-- FRONT -->
        <div class="card-front">
            <!-- Shininess/Reflection gradient -->
            <div
                class="card-reflection"
                style="transform: translateX({rotY}%) translateY({rotX}%)"
            ></div>

            <div class="card-content">
                <h3 class="skill-name">
                    {skill.name}
                </h3>
                <div class="skill-accent"></div>
            </div>

            <div class="skill-hint">
                <span class="hint-dot"></span>
                CLICK TO ANALYZE
            </div>
        </div>

        <!-- BACK -->
        <div class="card-back">
            <div class="progress-ring-container">
                <!-- Circular Progress Ring Background -->
                <svg class="progress-ring">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="transparent"
                        class="ring-background"
                    />
                    <!-- Progress Ring Foreground -->
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="transparent"
                        stroke-dasharray={2 * Math.PI * 40}
                        stroke-dashoffset={2 *
                            Math.PI *
                            40 *
                            (1 - skill.proficiency / 100)}
                        class="ring-progress"
                        style="color: {skill.proficiency >= 90
                            ? '#a855f7'
                            : '#3b82f6'}"
                    />
                </svg>
                <div class="progress-percentage">{skill.proficiency}%</div>
            </div>
            <p class="progress-label">Proficiency Level</p>
        </div>
    </div>
</div>

<style>
    .card-wrapper {
        position: relative;
        height: 12rem;
        width: 100%;
        perspective: 1000px;
        cursor: pointer;
    }

    .card-inner {
        position: relative;
        height: 100%;
        width: 100%;
        transition: all 0.2s ease-out;
        transform-style: preserve-3d;
    }

    .card-front,
    .card-back {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        border-radius: 0.75rem;
        border: 1px solid var(--color-glass-border);
        backdrop-filter: blur(12px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
    }

    .card-front {
        background: var(--color-surface);
        padding: 1.5rem;
    }

    .card-reflection {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            to top right,
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0)
        );
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }

    .card-wrapper:hover .card-reflection {
        opacity: 1;
    }

    .card-content {
        z-index: 10;
    }

    .skill-name {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        letter-spacing: -0.01em;
    }

    .skill-accent {
        height: 0.25rem;
        width: 2rem;
        background: #60a5fa;
        border-radius: 9999px;
        margin-top: 0.5rem;
    }

    .skill-hint {
        font-size: 0.75rem;
        color: var(--color-text-tertiary);
        font-family: var(--font-mono);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 10;
    }

    .hint-dot {
        width: 0.375rem;
        height: 0.375rem;
        border-radius: 50%;
        background: #34d399;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }

    .card-back {
        background: rgba(30, 30, 35, 0.9);
        backdrop-filter: blur(20px);
        padding: 1.5rem;
        justify-content: center;
        align-items: center;
        text-align: center;
        transform: rotateX(180deg);
    }

    :global(:root.light) .card-back {
        background: rgba(250, 250, 250, 0.95);
    }

    .progress-ring-container {
        position: relative;
        width: 6rem;
        height: 6rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .progress-ring {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }

    .ring-background {
        color: var(--color-glass-border);
    }

    .ring-progress {
        transition: all 1s ease-out;
    }

    .progress-percentage {
        position: absolute;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text-primary);
        font-family: var(--font-mono);
    }

    .progress-label {
        margin-top: 1rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        font-weight: 300;
    }
</style>
