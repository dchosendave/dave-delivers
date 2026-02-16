<script lang="ts">
    let { onClose } = $props();

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onClose();
        }
    }

    function handleDivKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" || e.key === " ") {
            if (
                e.target &&
                (e.target as HTMLElement).classList?.contains("modal-overlay")
            ) {
                onClose();
            }
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
    class="modal-overlay"
    onclick={onClose}
    role="button"
    tabindex="0"
    onkeydown={handleDivKeydown}
>
    <div
        class="about-window"
        onclick={(e) => e.stopPropagation()}
        role="button"
        tabindex="0"
        onkeydown={(e) => e.stopPropagation()}
    >
        <div class="window-header">
            <div class="traffic-lights">
                <button class="light red" onclick={onClose} aria-label="Close"
                ></button>
                <div class="light yellow"></div>
                <div class="light green"></div>
            </div>
        </div>

        <div class="window-content">
            <div class="logo-section">
                <div class="logo-circle">
                    <span class="memoji">👨🏻‍💻</span>
                </div>
            </div>

            <div class="info-section">
                <h2 class="dev-name">Dave Dichoson</h2>
                <p class="dev-title">Full Stack Developer</p>

                <div class="specs-grid">
                    <div class="spec-label">Processor</div>
                    <div class="spec-value">Python + Svelte 5</div>

                    <div class="spec-label">Memory</div>
                    <div class="spec-value">Infinite Curiosity</div>

                    <div class="spec-label">Graphics</div>
                    <div class="spec-value">CSS / Tailwind / Canvas</div>

                    <div class="spec-label">Startup</div>
                    <div class="spec-value">Portfolio v2.0</div>
                </div>

                <div class="buttons-row">
                    <button
                        class="action-btn"
                        onclick={() =>
                            window.open(
                                "https://github.com/dchosendave",
                                "_blank",
                            )}
                    >
                        Github Ops...
                    </button>
                    <button
                        class="action-btn"
                        onclick={() =>
                            window.open(
                                "https://linkedin.com/in/davedichoson",
                                "_blank",
                            )}
                    >
                        Network...
                    </button>
                </div>
            </div>
        </div>

        <div class="copyright">
            tm and © 2000-2026 Dave Dichoson Inc.<br />
            All Rights Reserved.
        </div>
    </div>
</div>

<style>
    .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(2px);
    }

    .about-window {
        width: 580px;
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-glass-border);
        border-radius: 12px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes popIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .window-header {
        padding: 12px 16px;
        background: transparent;
        display: flex;
        align-items: center;
    }

    .traffic-lights {
        display: flex;
        gap: 8px;
    }

    .light {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .light.red {
        background: #ff5f57;
        cursor: pointer;
    }
    .light.red:hover {
        box-shadow: inset 0 0 0 4px rgba(0, 0, 0, 0.1);
    }
    .light.yellow {
        background: #ffbd2e;
    }
    .light.green {
        background: #28c840;
    }

    .window-content {
        padding: 20px 40px;
        display: flex;
        gap: 40px;
        align-items: flex-start;
    }

    .logo-circle {
        width: 120px;
        height: 120px;
        background: linear-gradient(135deg, #e0e0e0 0%, #ffffff 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .memoji {
        font-size: 4rem;
    }

    .info-section {
        flex: 1;
    }

    .dev-name {
        font-family: var(--font-system);
        font-size: 2rem;
        font-weight: 600;
        margin: 0;
        color: var(--color-text-primary);
    }

    .dev-title {
        font-family: var(--font-system);
        font-size: 0.9rem;
        color: var(--color-text-secondary);
        margin: 0 0 1.5rem 0;
        font-weight: 500;
    }

    .specs-grid {
        display: grid;
        grid-template-columns: 80px 1fr;
        gap: 6px 16px;
        margin-bottom: 20px;
    }

    .spec-label {
        text-align: right;
        font-size: 0.8rem;
        color: var(--color-text-secondary);
        font-weight: 500;
    }

    .spec-value {
        font-size: 0.8rem;
        color: var(--color-text-primary);
        font-weight: 400;
    }

    .buttons-row {
        display: flex;
        gap: 10px;
    }

    .action-btn {
        background: var(--color-glass);
        border: 1px solid var(--color-glass-border);
        color: var(--color-text-primary);
        padding: 4px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .action-btn:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    :global(:root.light) .action-btn:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    .copyright {
        text-align: center;
        font-size: 0.7rem;
        color: var(--color-text-secondary);
        padding: 15px;
        border-top: 1px solid var(--color-glass-border);
        margin-top: 10px;
        background: rgba(0, 0, 0, 0.02);
    }
</style>
