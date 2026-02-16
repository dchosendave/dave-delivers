<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { PacmanGame } from "./PacmanGame";
    import { PacmanAI } from "./pacman-ai";
    import { CELL_SIZE } from "./maze-data";
    import type { Direction, GameMode } from "./types";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null = null;
    let game: PacmanGame;
    let ai: PacmanAI;
    let gameLoop: number | undefined;

    const GAME_SPEED = 150; // milliseconds per move

    onMount(() => {
        game = new PacmanGame();
        ai = new PacmanAI(game.getMazeForPathfinding());
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
            if (game.mode === "paused" || game.isGameOver) return;

            // AI mode: Pac-Man uses evasion AI
            if (game.mode === "ai") {
                const ghostPositions = game.ghosts.map((g) => g.position);
                const pacmanMove = ai.findEvasionMove(
                    game.pacman.position,
                    ghostPositions,
                );
                game.movePacman(pacmanMove);
            }

            // Move all ghosts using A* pathfinding
            game.updateGhostTargets();
            for (const ghost of game.ghosts) {
                const ghostMove = ai.findPath(
                    ghost.position,
                    ghost.targetPosition,
                );
                game.moveGhost(ghost, ghostMove);
            }

            render();
        }, GAME_SPEED);
    }

    function stopGame() {
        if (gameLoop) {
            clearInterval(gameLoop);
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

        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, width, height);

        // Draw maze
        for (let y = 0; y < game.maze.length; y++) {
            for (let x = 0; x < game.maze[y].length; x++) {
                const cell = game.maze[y][x];
                const px = x * CELL_SIZE;
                const py = y * CELL_SIZE;

                if (cell === 1) {
                    // Wall
                    ctx.fillStyle = "#1e40ff";
                    ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
                } else if (cell === 2) {
                    // Pellet
                    ctx.fillStyle = "#ffb8ae";
                    ctx.beginPath();
                    ctx.arc(
                        px + CELL_SIZE / 2,
                        py + CELL_SIZE / 2,
                        2,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                } else if (cell === 3) {
                    // Power pellet
                    ctx.fillStyle = "#ffb8ae";
                    ctx.beginPath();
                    ctx.arc(
                        px + CELL_SIZE / 2,
                        py + CELL_SIZE / 2,
                        5,
                        0,
                        Math.PI * 2,
                    );
                    ctx.fill();
                }
            }
        }

        // Draw ghosts
        for (const ghost of game.ghosts) {
            const px = ghost.position.x * CELL_SIZE;
            const py = ghost.position.y * CELL_SIZE;

            const colors = {
                red: "#ff0000",
                pink: "#ffb8ff",
                cyan: "#00ffff",
                orange: "#ffb851",
            };

            ctx.fillStyle = colors[ghost.color];
            ctx.shadowBlur = 10;
            ctx.shadowColor = colors[ghost.color];

            // Ghost body (rounded rectangle)
            ctx.beginPath();
            ctx.arc(
                px + CELL_SIZE / 2,
                py + CELL_SIZE / 2,
                CELL_SIZE / 2 - 2,
                0,
                Math.PI * 2,
            );
            ctx.fill();

            ctx.shadowBlur = 0;

            // Ghost eyes
            ctx.fillStyle = "#fff";
            ctx.fillRect(px + 4, py + 6, 4, 4);
            ctx.fillRect(px + 12, py + 6, 4, 4);

            ctx.fillStyle = "#000";
            ctx.fillRect(px + 5, py + 7, 2, 2);
            ctx.fillRect(px + 13, py + 7, 2, 2);
        }

        // Draw Pac-Man
        const px = game.pacman.position.x * CELL_SIZE;
        const py = game.pacman.position.y * CELL_SIZE;

        ctx.fillStyle = "#ffff00";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ffff00";

        ctx.beginPath();
        ctx.arc(
            px + CELL_SIZE / 2,
            py + CELL_SIZE / 2,
            CELL_SIZE / 2 - 2,
            0.2 * Math.PI,
            1.8 * Math.PI,
        );
        ctx.lineTo(px + CELL_SIZE / 2, py + CELL_SIZE / 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Draw game over overlay
        if (game.isGameOver) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#ffff00";
            ctx.font = "bold 32px Arial";
            ctx.textAlign = "center";

            if (game.pelletsEaten === game.totalPellets) {
                ctx.fillText("YOU WIN!", width / 2, height / 2 - 20);
            } else {
                ctx.fillText("GAME OVER", width / 2, height / 2 - 20);
            }

            ctx.font = "20px Arial";
            ctx.fillText(`Score: ${game.score}`, width / 2, height / 2 + 20);
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
            game.movePacman(newDir);
            render();
        }

        if (e.key === " ") {
            e.preventDefault();
            togglePause();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="pacman-container">
    <div class="game-header">
        <div class="stats">
            <div class="stat-item">
                <span class="stat-label">Score</span>
                <span class="stat-value">{game?.score || 0}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Lives</span>
                <span class="stat-value">{"❤️".repeat(game?.lives || 3)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Pellets</span>
                <span class="stat-value"
                    >{game?.pelletsEaten || 0}/{game?.totalPellets || 0}</span
                >
            </div>
        </div>

        <div class="mode-indicator">
            {#if game?.mode === "manual"}
                <span class="mode-badge manual">👤 Playing</span>
            {:else if game?.mode === "ai"}
                <span class="mode-badge ai">🤖 5 AIs Fighting!</span>
            {:else}
                <span class="mode-badge paused">⏸ Paused</span>
            {/if}
        </div>
    </div>

    <div class="canvas-wrapper">
        <canvas
            bind:this={canvas}
            width={19 * CELL_SIZE}
            height={20 * CELL_SIZE}
        ></canvas>
    </div>

    <div class="controls">
        <button class="control-btn primary" onclick={() => startGame("manual")}>
            👤 Play Manual
        </button>

        <button class="control-btn ai" onclick={() => startGame("ai")}>
            🤖 Watch AI Battle
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
        <p>
            <strong>Manual Mode:</strong> Use arrow keys or WASD • Avoid ghosts!
        </p>
        <p>
            <strong>AI Mode:</strong> Watch Pac-Man AI evade 4 ghost AIs using pathfinding
        </p>
        <p>
            <strong>Red:</strong> Aggressive chase •
            <strong>Pink/Cyan/Orange:</strong> Different strategies
        </p>
    </div>
</div>

<style>
    .pacman-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 2rem;
        min-height: 100vh;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
    }

    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        max-width: 500px;
        padding: 1rem;
        background: rgba(30, 64, 255, 0.1);
        border-radius: 0.75rem;
        border: 1px solid rgba(30, 64, 255, 0.3);
        backdrop-filter: blur(10px);
    }

    .stats {
        display: flex;
        gap: 1.5rem;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
    }

    .stat-label {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-family: "Press Start 2P", monospace;
    }

    .stat-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: #ffff00;
        font-family: "Press Start 2P", monospace;
        margin-top: 0.25rem;
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
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
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
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 0 2px rgba(30, 64, 255, 0.3),
            0 0 20px rgba(30, 64, 255, 0.2);
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
        background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
        color: #000;
    }

    .control-btn.primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(255, 204, 0, 0.4);
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
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.875rem;
        font-family: monospace;
        line-height: 1.8;
        max-width: 600px;
    }

    .instructions p {
        margin: 0.25rem 0;
    }

    .instructions strong {
        color: rgba(255, 255, 255, 0.95);
    }

    @media (max-width: 640px) {
        .pacman-container {
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
