/**
 * Snake Game Types
 * Core type definitions for the Snake AI game
 */

export interface Point {
    x: number;
    y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameMode = 'manual' | 'ai' | 'paused';

export interface GameState {
    snake: Point[];
    direction: Direction;
    food: Point;
    score: number;
    highScore: number;
    isGameOver: boolean;
    mode: GameMode;
}

export interface Move {
    point: Point;
    path: Direction[];
}
