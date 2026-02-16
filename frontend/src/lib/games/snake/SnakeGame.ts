/**
 * Snake Game Logic
 * Core game state and mechanics
 */

import type { Point, Direction, GameMode, GameState } from './types';

export class SnakeGame {
    snake!: Point[];
    direction!: Direction;
    nextDirection!: Direction;
    food!: Point;
    score!: number;
    highScore: number;
    isGameOver!: boolean;
    mode!: GameMode;
    gridSize: number;
    cellSize: number;

    constructor(gridSize: number = 20, cellSize: number = 20) {
        this.gridSize = gridSize;
        this.cellSize = cellSize;
        this.highScore = this.loadHighScore();

        this.reset();
    }

    /**
     * Reset game to initial state
     */
    reset(): void {
        const center = Math.floor(this.gridSize / 2);
        this.snake = [
            { x: center, y: center },
            { x: center - 1, y: center },
            { x: center - 2, y: center },
        ];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.score = 0;
        this.isGameOver = false;
        this.mode = 'paused';
        this.spawnFood();
    }

    /**
     * Main game loop - move snake one step
     */
    move(): void {
        if (this.isGameOver) return;

        // Update direction (prevents 180° turns)
        if (!this.isOppositeDirection(this.nextDirection, this.direction)) {
            this.direction = this.nextDirection;
        }

        const newHead = this.getNewHead();

        // Check collision with walls or self
        if (this.checkCollision(newHead)) {
            this.isGameOver = true;
            this.updateHighScore();
            return;
        }

        // Add new head
        this.snake.unshift(newHead);

        // Check if ate food
        if (this.isFood(newHead)) {
            this.score++;
            this.spawnFood();
        } else {
            // Remove tail (snake doesn't grow)
            this.snake.pop();
        }
    }

    /**
     * Change direction (queued for next move)
     */
    setDirection(newDirection: Direction): void {
        this.nextDirection = newDirection;
    }

    /**
     * Get the new head position based on current direction
     */
    private getNewHead(): Point {
        const head = this.snake[0];

        switch (this.direction) {
            case 'UP':
                return { x: head.x, y: head.y - 1 };
            case 'DOWN':
                return { x: head.x, y: head.y + 1 };
            case 'LEFT':
                return { x: head.x - 1, y: head.y };
            case 'RIGHT':
                return { x: head.x + 1, y: head.y };
        }
    }

    /**
     * Check if point collides with walls or snake body
     */
    private checkCollision(point: Point): boolean {
        // Wall collision
        if (point.x < 0 || point.x >= this.gridSize) return true;
        if (point.y < 0 || point.y >= this.gridSize) return true;

        // Self collision (check all body segments)
        for (const segment of this.snake) {
            if (segment.x === point.x && segment.y === point.y) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if point is food
     */
    private isFood(point: Point): boolean {
        return point.x === this.food.x && point.y === this.food.y;
    }

    /**
     * Spawn food at random empty location
     */
    private spawnFood(): void {
        let attempts = 0;
        const maxAttempts = 1000;

        while (attempts < maxAttempts) {
            const newFood: Point = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize),
            };

            // Check if food spawns on snake
            const isOnSnake = this.snake.some(
                (segment) => segment.x === newFood.x && segment.y === newFood.y
            );

            if (!isOnSnake) {
                this.food = newFood;
                return;
            }

            attempts++;
        }

        // Fallback: place in top-left corner
        this.food = { x: 0, y: 0 };
    }

    /**
     * Check if two directions are opposite
     */
    isOppositeDirection(dir1: Direction, dir2: Direction): boolean {
        return (
            (dir1 === 'UP' && dir2 === 'DOWN') ||
            (dir1 === 'DOWN' && dir2 === 'UP') ||
            (dir1 === 'LEFT' && dir2 === 'RIGHT') ||
            (dir1 === 'RIGHT' && dir2 === 'LEFT')
        );
    }

    /**
     * Get current game state
     */
    getState(): GameState {
        return {
            snake: this.snake,
            direction: this.direction,
            food: this.food,
            score: this.score,
            highScore: this.highScore,
            isGameOver: this.isGameOver,
            mode: this.mode,
        };
    }

    /**
     * Load high score from localStorage
     */
    private loadHighScore(): number {
        if (typeof window === 'undefined') return 0;
        const saved = localStorage.getItem('snake-high-score');
        return saved ? parseInt(saved, 10) : 0;
    }

    /**
     * Update high score if current score is higher
     */
    private updateHighScore(): void {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            if (typeof window !== 'undefined') {
                localStorage.setItem('snake-high-score', this.score.toString());
            }
        }
    }
}
