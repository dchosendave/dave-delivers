/**
 * Snake AI - Pathfinding with BFS
 * Implements Breadth-First Search to find the shortest path to food
 */

import type { Point, Direction } from './types';

export class SnakeAI {
    private gridSize: number;

    constructor(gridSize: number) {
        this.gridSize = gridSize;
    }

    /**
     * Find the best move for the AI snake
     * Uses BFS to find shortest path to food, falls back to safe moves
     */
    findBestMove(snake: Point[], food: Point): Direction {
        const head = snake[0];

        // Try BFS pathfinding first
        const bfsMove = this.bfs(head, food, snake);
        if (bfsMove) {
            return bfsMove;
        }

        // Fallback: find any safe move
        const safeMoves = this.getSafeMoves(head, snake);
        if (safeMoves.length > 0) {
            // Pick the move that gives most space (prevents trapping itself)
            return this.findSafestMove(safeMoves, snake);
        }

        // No safe moves - game over imminent
        return 'UP';
    }

    /**
     * Breadth-First Search to find shortest path to food
     */
    private bfs(start: Point, goal: Point, snake: Point[]): Direction | null {
        const queue: Array<{ point: Point; path: Direction[] }> = [];
        const visited = new Set<string>();
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

        // Initialize queue with first moves
        for (const dir of directions) {
            const next = this.getNextPoint(start, dir);
            if (this.isValid(next, snake)) {
                queue.push({ point: next, path: [dir] });
                visited.add(this.pointToKey(next));
            }
        }

        // BFS loop
        while (queue.length > 0) {
            const current = queue.shift()!;

            // Found the food!
            if (current.point.x === goal.x && current.point.y === goal.y) {
                return current.path[0]; // Return first direction in path
            }

            // Explore neighbors
            for (const dir of directions) {
                const next = this.getNextPoint(current.point, dir);
                const key = this.pointToKey(next);

                if (this.isValid(next, snake) && !visited.has(key)) {
                    queue.push({
                        point: next,
                        path: [...current.path, dir],
                    });
                    visited.add(key);
                }
            }
        }

        return null; // No path found
    }

    /**
     * Get all safe moves (don't hit walls or snake body)
     */
    private getSafeMoves(head: Point, snake: Point[]): Direction[] {
        const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const safeMoves: Direction[] = [];

        for (const dir of directions) {
            const next = this.getNextPoint(head, dir);
            if (this.isValid(next, snake)) {
                safeMoves.push(dir);
            }
        }

        return safeMoves;
    }

    /**
     * Pick the move that gives the most open space (flood fill)
     */
    private findSafestMove(moves: Direction[], snake: Point[]): Direction {
        let bestMove = moves[0];
        let maxSpace = 0;

        for (const move of moves) {
            const next = this.getNextPoint(snake[0], move);
            const space = this.countReachableSpace(next, snake);

            if (space > maxSpace) {
                maxSpace = space;
                bestMove = move;
            }
        }

        return bestMove;
    }

    /**
     * Count how many cells are reachable from a point (flood fill)
     */
    private countReachableSpace(start: Point, snake: Point[]): number {
        const visited = new Set<string>();
        const queue: Point[] = [start];
        visited.add(this.pointToKey(start));

        while (queue.length > 0) {
            const current = queue.shift()!;
            const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

            for (const dir of directions) {
                const next = this.getNextPoint(current, dir);
                const key = this.pointToKey(next);

                if (this.isValid(next, snake) && !visited.has(key)) {
                    visited.add(key);
                    queue.push(next);
                }
            }
        }

        return visited.size;
    }

    /**
     * Check if a point is valid (not wall, not snake body)
     */
    private isValid(point: Point, snake: Point[]): boolean {
        // Check walls
        if (point.x < 0 || point.x >= this.gridSize) return false;
        if (point.y < 0 || point.y >= this.gridSize) return false;

        // Check snake body (skip tail since it will move)
        for (let i = 0; i < snake.length - 1; i++) {
            if (snake[i].x === point.x && snake[i].y === point.y) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get next point given direction
     */
    private getNextPoint(point: Point, direction: Direction): Point {
        switch (direction) {
            case 'UP':
                return { x: point.x, y: point.y - 1 };
            case 'DOWN':
                return { x: point.x, y: point.y + 1 };
            case 'LEFT':
                return { x: point.x - 1, y: point.y };
            case 'RIGHT':
                return { x: point.x + 1, y: point.y };
        }
    }

    /**
     * Convert point to string key for Set/Map
     */
    private pointToKey(point: Point): string {
        return `${point.x},${point.y}`;
    }
}
