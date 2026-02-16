<script lang="ts">
    import PacmanGame from "$lib/games/pacman/PacmanGame.svelte";
    import { goto } from "$app/navigation";
</script>

<div class="page-container">
    <div class="header">
        <button class="back-btn" onclick={() => goto("/desktop")}>
            ← Back to Desktop
        </button>
        <h1 class="title">
            <span class="emoji">👻</span>
            Pac-Man AI
        </h1>
        <p class="subtitle">4 Ghost AIs with A* pathfinding vs Evasion AI</p>
    </div>

    <PacmanGame />
</div>

<style>
    .page-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
        padding: 2rem 1rem;
    }

    .header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .back-btn {
        position: fixed;
        top: 1.5rem;
        left: 1.5rem;
        padding: 0.75rem 1.25rem;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        color: white;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        z-index: 100;
    }

    .back-btn:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateX(-2px);
    }

    .title {
        font-size: 3rem;
        font-weight: 700;
        color: #ffff00;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        text-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
    }

    .emoji {
        font-size: 3rem;
        animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
        0%,
        100% {
            transform: translateY(0) rotate(0deg);
        }
        25% {
            transform: translateY(-10px) rotate(-5deg);
        }
        75% {
            transform: translateY(-10px) rotate(5deg);
        }
    }

    .subtitle {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.7);
        margin: 0.5rem 0 0;
        font-family: monospace;
    }

    @media (max-width: 640px) {
        .title {
            font-size: 2rem;
        }

        .emoji {
            font-size: 2rem;
        }

        .back-btn {
            position: static;
            margin-bottom: 1rem;
        }
    }
</style>
