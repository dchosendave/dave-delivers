<script lang="ts">
    import type {
        WindowState,
        WindowComponentProps,
    } from "./types/window-types";
    import Terminal from "./Terminal.svelte";
    import ISSTracker from "./ISSTracker.svelte";

    let {
        window: windowData,
        isActive,
        onClose,
        onMinimize,
        onFocus,
    }: {
        window: WindowState;
        isActive: boolean;
        onClose: () => void;
        onMinimize: () => void;
        onFocus: () => void;
    } = $props();

    // Map window type to component
    const componentMap = {
        terminal: Terminal,
        "iss-tracker": ISSTracker,
    };

    const WindowComponent = componentMap[windowData.id];
</script>

{#if !windowData.isMinimized}
    <div
        class="window-wrapper"
        class:active={isActive}
        style="z-index: {windowData.zIndex}"
        onclick={onFocus}
        role="button"
        tabindex="0"
    >
        <!-- Window Chrome (macOS style) -->
        <div class="window-chrome">
            <div class="window-controls">
                <button
                    class="control-btn close"
                    onclick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    title="Close"
                    aria-label="Close window"
                ></button>
                <button
                    class="control-btn minimize"
                    onclick={(e) => {
                        e.stopPropagation();
                        onMinimize();
                    }}
                    title="Minimize"
                    aria-label="Minimize window"
                ></button>
                <button
                    class="control-btn maximize"
                    title="Maximize"
                    aria-label="Maximize window"
                ></button>
            </div>
            <div class="window-title">
                <span class="title-icon">{windowData.icon}</span>
                <span class="title-text">{windowData.title}</span>
            </div>
            <div class="window-spacer"></div>
        </div>

        <!-- Window Content -->
        <div class="window-content">
            <WindowComponent {onClose} />
        </div>
    </div>
{/if}

<style>
    .window-wrapper {
        position: absolute;
        left: 50%;
        top: 10%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 900px;
        height: 85vh;
        max-height: 700px;
        background: rgba(20, 20, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(40px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition:
            box-shadow 0.2s,
            border-color 0.2s,
            opacity 0.2s;
        opacity: 0.85;
    }

    .window-wrapper.active {
        opacity: 1;
        border-color: rgba(255, 255, 255, 0.2);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    /* Window Chrome */
    .window-chrome {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.02);
        flex-shrink: 0;
    }

    .window-controls {
        display: flex;
        gap: 0.5rem;
        z-index: 10;
    }

    .control-btn {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: filter 0.2s;
    }

    .control-btn:hover {
        filter: brightness(1.2);
    }

    .control-btn.close {
        background: #ff5f56;
    }
    .control-btn.minimize {
        background: #ffbd2e;
    }
    .control-btn.maximize {
        background: #27c93f;
    }

    .window-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;
        transition: opacity 0.2s;
    }

    .window-wrapper:not(.active) .window-title {
        opacity: 0.6;
    }

    .title-icon {
        font-size: 1.25rem;
    }

    .title-text {
        font-size: 0.875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
    }

    .window-spacer {
        width: 60px;
    }

    /* Window Content */
    .window-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .window-wrapper {
            width: 95%;
            height: 90vh;
        }
    }
</style>
