/**
 * Pac-Man Game Types
 * Type definitions for the Pac-Man AI game
 */

export interface Point {
    x: number;
    y: number;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'NONE';

export type CellType = 'wall' | 'empty' | 'pellet' | 'power';

export type GameMode = 'manual' | 'ai' | 'paused';

export type GhostColor = 'red' | 'pink' | 'cyan' | 'orange';

export interface Entity {
    position: Point;
    direction: Direction;
    speed: number;
}

export interface Ghost extends Entity {
    color: GhostColor;
    targetPosition: Point;
    scatterTarget: Point;
}

export interface GameState {
    pacman: Entity;
    ghosts: Ghost[];
    score: number;
    pelletsEaten: number;
    totalPellets: number;
    lives: number;
    isGameOver: boolean;
    mode: GameMode;
}

export interface PathNode {
    point: Point;
    gCost: number; // Cost from start
    hCost: number; // Heuristic cost to goal
    fCost: number; // gCost + hCost
    parent: PathNode | null;
}
