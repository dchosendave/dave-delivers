/**
 * Pac-Man Game Logic
 * Core game state and mechanics
 */

import type { Point, Direction, Entity, Ghost, GameMode, GameState, GhostColor } from './types';
import { MAZE_DATA, PACMAN_START, GHOST_STARTS, MAZE_WIDTH, MAZE_HEIGHT } from './maze-data';

export class PacmanGame {
    pacman!: Entity;
    ghosts!: Ghost[];
    maze!: number[][];
    score!: number;
    pelletsEaten!: number;
    totalPellets!: number;
    lives!: number;
    isGameOver!: boolean;
    mode!: GameMode;

    constructor() {
        this.reset();
    }

    reset(): void {
        // Initialize Pac-Man
        this.pacman = {
            position: { ...PACMAN_START },
            direction: 'NONE',
            speed: 1,
        };

        // Initialize ghosts
        this.ghosts = GHOST_STARTS.map((start) => ({
            position: { x: start.x, y: start.y },
            direction: 'NONE',
            speed: 1,
            color: start.color,
            targetPosition: { ...PACMAN_START },
            scatterTarget: { ...start.scatter },
        }));

        // Clone maze data
        this.maze = MAZE_DATA.map((row) => [...row]);

        // Count pellets
        this.totalPellets = 0;
        for (const row of this.maze) {
            for (const cell of row) {
                if (cell === 2 || cell === 3) {
                    this.totalPellets++;
                }
            }
        }

        this.score = 0;
        this.pelletsEaten = 0;
        this.lives = 3;
        this.isGameOver = false;
        this.mode = 'paused';
    }

    /**
     * Move Pac-Man in given direction
     */
    movePacman(direction: Direction): void {
        if (direction === 'NONE') return;

        const newPos = this.getNextPosition(this.pacman.position, direction);

        if (this.isWalkable(newPos)) {
            this.pacman.position = newPos;
            this.pacman.direction = direction;

            // Check for pellet
            this.checkPelletCollision();

            // Check for ghost collision
            this.checkGhostCollision();
        }
    }

    /**
     * Move a specific ghost
     */
    moveGhost(ghost: Ghost, direction: Direction): void {
        if (direction === 'NONE') return;

        const newPos = this.getNextPosition(ghost.position, direction);

        if (this.isWalkable(newPos)) {
            ghost.position = newPos;
            ghost.direction = direction;
        }
    }

    /**
     * Update all ghost target positions
     */
    updateGhostTargets(): void {
        for (const ghost of this.ghosts) {
            ghost.targetPosition = { ...this.pacman.position };
        }
    }

    /**
     * Check if Pac-Man ate a pellet
     */
    private checkPelletCollision(): void {
        const cell = this.maze[this.pacman.position.y][this.pacman.position.x];

        if (cell === 2) {
            // Normal pellet
            this.score += 10;
            this.pelletsEaten++;
            this.maze[this.pacman.position.y][this.pacman.position.x] = 0;
        } else if (cell === 3) {
            // Power pellet
            this.score += 50;
            this.pelletsEaten++;
            this.maze[this.pacman.position.y][this.pacman.position.x] = 0;
        }

        // Check win condition
        if (this.pelletsEaten === this.totalPellets) {
            this.isGameOver = true;
        }
    }

    /**
     * Check if Pac-Man collided with ghost
     */
    private checkGhostCollision(): void {
        for (const ghost of this.ghosts) {
            if (
                ghost.position.x === this.pacman.position.x &&
                ghost.position.y === this.pacman.position.y
            ) {
                this.lives--;
                if (this.lives <= 0) {
                    this.isGameOver = true;
                } else {
                    this.respawn();
                }
                break;
            }
        }
    }

    /**
     * Respawn Pac-Man and ghosts
     */
    private respawn(): void {
        this.pacman.position = { ...PACMAN_START };
        this.pacman.direction = 'NONE';

        GHOST_STARTS.forEach((start, index) => {
            this.ghosts[index].position = { x: start.x, y: start.y };
            this.ghosts[index].direction = 'NONE';
        });
    }

    /**
     * Get next position given current position and direction
     */
    private getNextPosition(pos: Point, dir: Direction): Point {
        const newPos = { ...pos };

        switch (dir) {
            case 'UP':
                newPos.y--;
                break;
            case 'DOWN':
                newPos.y++;
                break;
            case 'LEFT':
                newPos.x--;
                break;
            case 'RIGHT':
                newPos.x++;
                break;
        }

        // Wrap around (tunnel effect)
        if (newPos.x < 0) newPos.x = MAZE_WIDTH - 1;
        if (newPos.x >= MAZE_WIDTH) newPos.x = 0;

        return newPos;
    }

    /**
     * Check if position is walkable
     */
    private isWalkable(pos: Point): boolean {
        if (pos.y < 0 || pos.y >= MAZE_HEIGHT) return false;
        if (pos.x < 0 || pos.x >= MAZE_WIDTH) return false;
        return this.maze[pos.y][pos.x] !== 1;
    }

    /**
     * Get current game state
     */
    getState(): GameState {
        return {
            pacman: this.pacman,
            ghosts: this.ghosts,
            score: this.score,
            pelletsEaten: this.pelletsEaten,
            totalPellets: this.totalPellets,
            lives: this.lives,
            isGameOver: this.isGameOver,
            mode: this.mode,
        };
    }

    /**
     * Get maze for AI pathfinding (convert to 0/1 array)
     */
    getMazeForPathfinding(): number[][] {
        return this.maze.map((row) => row.map((cell) => (cell === 1 ? 1 : 0)));
    }
}
