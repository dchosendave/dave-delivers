<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { SnakeGame } from "./SnakeGame";
    import { SnakeAI } from "./snake-ai";
    import type { Direction, GameMode } from "./types";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    let game: SnakeGame;
    let ai: SnakeAI;
    let gameLoop: number | undefined;
    let animationFrame: number | undefined;

    const CELL_SIZE = 20;
    const GRID_SIZE = 20;
    const GAME_SPEED = 120; // milliseconds per move

    onMount(() => {
        game = new SnakeGame(GRID_SIZE, CELL_SIZE);
        ai = new SnakeAI(GRID_SIZE);
        ctx = canvas.getContext("2d");
        render();
    });

    onDestroy(() => {
        stopGame();
    });

    function startGame(mode: GameMode) {
        stopGame();
        game.reset();
        game.mode = mode;

        gameLoop = window.setInterval(() => {
            if (game.mode === "ai" && !game.isGameOver) {
                // AI makes the decision
                const aiMove = ai.findBestMove(game.snake, game.food);
                game.setDirection(aiMove);
            }

            if (game.mode !== "paused") {
                game.move();
            }

            render();
        }, GAME_SPEED);
    }

    function stopGame() {
        if (gameLoop) {
            clearInterval(gameLoop);
        }
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    }

    function togglePause() {
        if (game.mode === "paused") {
            game.mode = "manual";
        } else {
            game.mode = "paused";
        }
    }

    function render() {
        if (!ctx || !canvas) return;

        const width = GRID_SIZE * CELL_SIZE;
        const height = GRID_SIZE * CELL_SIZE;

        // Clear canvas with dark background
        ctx.fillStyle = "#1a1a1d";
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines (subtle)
        ctx.strokeStyle = "#2a2a2d";
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= GRID_SIZE; i++) {
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, height);
            ctx.stroke();

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(width, i * CELL_SIZE);
            ctx.stroke();
        }

        // Draw food (red with glow)
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff3366";
        ctx.fillStyle = "#ff3366";
        ctx.fillRect(
            game.food.x * CELL_SIZE + 2,
            game.food.y * CELL_SIZE + 2,
            CELL_SIZE - 4,
            CELL_SIZE - 4,
        );
        ctx.shadowBlur = 0;

        // Draw snake
        game.snake.forEach((segment, index) => {
            const isHead = index === 0;
            const opacity = 1 - (index / game.snake.length) * 0.3;

            // Head is brighter green
            if (isHead) {
                if (ctx) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = "#00ff88";
                    ctx.fillStyle = "#00ff88";
                }
            } else {
                if (ctx) {
                    ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
                }
            }

            if (ctx) {
                ctx.fillRect(
                    segment.x * CELL_SIZE + 2,
                    segment.y * CELL_SIZE + 2,
                    CELL_SIZE - 4,
                    CELL_SIZE - 4,
                );

                ctx.shadowBlur = 0;
            }
        });

        // Draw game over overlay
        if (game.isGameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 24px monospace";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", width / 2, height / 2 - 20);

            ctx.font = "16px monospace";
            ctx.fillText(`Score: ${game.score}`, width / 2, height / 2 + 10);
            ctx.fillText(
                `High Score: ${game.highScore}`,
                width / 2,
                height / 2 + 35,
            );
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (game.mode !== "manual" || game.isGameOver) return;

        const keyMap: Record<string, Direction> = {
            ArrowUp: "UP",
            w: "UP",
            W: "UP",
            ArrowDown: "DOWN",
            s: "DOWN",
            S: "DOWN",
            ArrowLeft: "LEFT",
            a: "LEFT",
            A: "LEFT",
            ArrowRight: "RIGHT",
            d: "RIGHT",
            D: "RIGHT",
        };

        const newDir = keyMap[e.key];
        if (newDir) {
            e.preventDefault();
            game.setDirection(newDir);
        }

        // Pause/unpause with spacebar
        if (e.key === " ") {
            e.preventDefault();
            togglePause();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="snake-container">
    <div class="game-header">
        <div class="score-board">
            <div class="score-item">
                <span class="score-label">Score</span>
                <span class="score-value">{game?.score || 0}</span>
            </div>
            <div class="score-item">
                <span class="score-label">High Score</span>
                <span class="score-value">{game?.highScore || 0}</span>
            </div>
        </div>

        <div class="mode-indicator">
            {#if game?.mode === "manual"}
                <span class="mode-badge manual">👤 Manual</span>
            {:else if game?.mode === "ai"}
                <span class="mode-badge ai">🤖 AI Playing</span>
            {:else}
                <span class="mode-badge paused">⏸ Paused</span>
            {/if}
        </div>
    </div>

    <div class="canvas-wrapper">
        <canvas
            bind:this={canvas}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
        ></canvas>
    </div>

    <div class="controls">
        <button class="control-btn primary" onclick={() => startGame("manual")}>
            👤 Play Manual
        </button>

        <button class="control-btn ai" onclick={() => startGame("ai")}>
            🤖 Watch AI
        </button>

        <button
            class="control-btn secondary"
            onclick={() => togglePause()}
            disabled={game?.isGameOver}
        >
            {game?.mode === "paused" ? "▶ Resume" : "⏸ Pause"}
        </button>

        <button
            class="control-btn secondary"
            onclick={() => startGame(game?.mode || "manual")}
        >
            🔄 Restart
        </button>
    </div>

    <div class="instructions">
        <p><strong>Manual Mode:</strong> Use arrow keys or WASD to control</p>
        <p><strong>AI Mode:</strong> Watch the AI use BFS pathfinding</p>
        <p><strong>Spacebar:</strong> Pause/Resume</p>
    </div>
</div>

<style>
    .snake-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem;
        min-height: 100vh;
        background: linear-gradient(135deg, #1a1a1d 0%, #2d2d30 100%);
    }

    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 400px;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    }

    .score-board {
        display: flex;
        gap: 2rem;
    }

    .score-item {
        display: flex;
        flex-direction: column;
    }

    .score-label {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: monospace;
    }

    .score-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #00ff88;
        font-family: monospace;
    }

    .mode-indicator {
        display: flex;
        align-items: center;
    }

    .mode-badge {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        font-family: monospace;
    }

    .mode-badge.manual {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.3);
    }

    .mode-badge.ai {
        background: rgba(168, 85, 247, 0.2);
        color: #a855f7;
        border: 1px solid rgba(168, 85, 247, 0.3);
    }

    .mode-badge.paused {
        background: rgba(156, 163, 175, 0.2);
        color: #9ca3af;
        border: 1px solid rgba(156, 163, 175, 0.3);
    }

    .canvas-wrapper {
        position: relative;
        border-radius: 0.75rem;
        overflow: hidden;
        box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.1);
    }

    canvas {
        display: block;
    }

    .controls {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: center;
    }

    .control-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .control-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .control-btn.primary {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
    }

    .control-btn.primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
    }

    .control-btn.ai {
        background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
        color: white;
    }

    .control-btn.ai:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(168, 85, 247, 0.3);
    }

    .control-btn.secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .control-btn.secondary:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
    }

    .instructions {
        text-align: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.875rem;
        font-family: monospace;
        line-height: 1.6;
    }

    .instructions p {
        margin: 0.25rem 0;
    }

    .instructions strong {
        color: rgba(255, 255, 255, 0.9);
    }

    @media (max-width: 640px) {
        .snake-container {
            padding: 1rem;
        }

        .game-header {
            flex-direction: column;
            gap: 1rem;
        }

        .controls {
            flex-direction: column;
            width: 100%;
            max-width: 300px;
        }

        .control-btn {
            width: 100%;
        }
    }
</style>
