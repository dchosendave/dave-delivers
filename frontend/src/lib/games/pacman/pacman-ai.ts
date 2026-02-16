/**
 * A* Pathfinding Algorithm
 * Used by ghosts to chase Pac-Man
 */

import type { Point, Direction } from './types';

export class PacmanAI {
    private maze: number[][];
    private width: number;
    private height: number;

    constructor(maze: number[][]) {
        this.maze = maze;
        this.height = maze.length;
        this.width = maze[0].length;
    }

    /**
     * A* pathfinding to find shortest path
     * More efficient than BFS for game AI
     */
    findPath(start: Point, goal: Point): Direction {
        const openSet: PathNode[] = [];
        const closedSet = new Set<string>();

        const startNode: PathNode = {
            point: start,
            gCost: 0,
            hCost: this.heuristic(start, goal),
            fCost: 0,
            parent: null,
        };
        startNode.fCost = startNode.gCost + startNode.hCost;

        openSet.push(startNode);

        while (openSet.length > 0) {
            // Get node with lowest fCost
            openSet.sort((a, b) => a.fCost - b.fCost);
            const current = openSet.shift()!;

            if (current.point.x === goal.x && current.point.y === goal.y) {
                return this.reconstructPath(current);
            }

            closedSet.add(this.pointToKey(current.point));

            // Check all neighbors
            const neighbors = this.getNeighbors(current.point);
            for (const neighbor of neighbors) {
                const key = this.pointToKey(neighbor);
                if (closedSet.has(key)) continue;

                const gCost = current.gCost + 1;
                const hCost = this.heuristic(neighbor, goal);
                const fCost = gCost + hCost;

                const existingNode = openSet.find(
                    (n) => n.point.x === neighbor.x && n.point.y === neighbor.y
                );

                if (!existingNode) {
                    openSet.push({
                        point: neighbor,
                        gCost,
                        hCost,
                        fCost,
                        parent: current,
                    });
                } else if (gCost < existingNode.gCost) {
                    existingNode.gCost = gCost;
                    existingNode.fCost = fCost;
                    existingNode.parent = current;
                }
            }
        }

        // No path found - move randomly
        return this.getRandomDirection(start);
    }

    /**
     * Pac-Man evasion AI - moves away from nearest ghost
     */
    findEvasionMove(pacmanPos: Point, ghostPositions: Point[]): Direction {
        if (ghostPositions.length === 0) {
            return this.getRandomDirection(pacmanPos);
        }

        // Find nearest ghost
        let nearestGhost = ghostPositions[0];
        let minDist = this.heuristic(pacmanPos, ghostPositions[0]);

        for (const ghost of ghostPositions) {
            const dist = this.heuristic(pacmanPos, ghost);
            if (dist < minDist) {
                minDist = dist;
                nearestGhost = ghost;
            }
        }

        // If ghost is far, move randomly (collect pellets)
        if (minDist > 5) {
            return this.getRandomDirection(pacmanPos);
        }

        // Find move that maximizes distance from nearest ghost
        const neighbors = this.getNeighbors(pacmanPos);
        let bestMove = pacmanPos;
        let maxDist = 0;

        for (const neighbor of neighbors) {
            const dist = this.heuristic(neighbor, nearestGhost);
            if (dist > maxDist) {
                maxDist = dist;
                bestMove = neighbor;
            }
        }

        return this.getDirection(pacmanPos, bestMove);
    }

    /**
     * Manhattan distance heuristic
     */
    private heuristic(a: Point, b: Point): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    /**
     * Reconstruct path from A* and return first direction
     */
    private reconstructPath(node: PathNode): Direction {
        const path: Point[] = [];
        let current: PathNode | null = node;

        while (current !== null) {
            path.unshift(current.point);
            current = current.parent;
        }

        if (path.length < 2) {
            return 'NONE';
        }

        const start = path[0];
        const next = path[1];

        return this.getDirection(start, next);
    }

    /**
     * Get direction from one point to another
     */
    private getDirection(from: Point, to: Point): Direction {
        if (to.x > from.x) return 'RIGHT';
        if (to.x < from.x) return 'LEFT';
        if (to.y > from.y) return 'DOWN';
        if (to.y < from.y) return 'UP';
        return 'NONE';
    }

    /**
     * Get valid neighbor cells
     */
    private getNeighbors(point: Point): Point[] {
        const neighbors: Point[] = [];
        const directions = [
            { x: 0, y: -1 }, // UP
            { x: 0, y: 1 },  // DOWN
            { x: -1, y: 0 }, // LEFT
            { x: 1, y: 0 },  // RIGHT
        ];

        for (const dir of directions) {
            const newX = point.x + dir.x;
            const newY = point.y + dir.y;

            if (this.isWalkable(newX, newY)) {
                neighbors.push({ x: newX, y: newY });
            }
        }

        return neighbors;
    }

    /**
     * Get random valid direction
     */
    private getRandomDirection(point: Point): Direction {
        const neighbors = this.getNeighbors(point);
        if (neighbors.length === 0) return 'NONE';

        const random = neighbors[Math.floor(Math.random() * neighbors.length)];
        return this.getDirection(point, random);
    }

    /**
     * Check if cell is walkable
     */
    private isWalkable(x: number, y: number): boolean {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return false;
        }
        return this.maze[y][x] !== 1; // 1 = wall
    }

    /**
     * Convert point to string key
     */
    private pointToKey(point: Point): string {
        return `${point.x},${point.y}`;
    }
}

interface PathNode {
    point: Point;
    gCost: number;
    hCost: number;
    fCost: number;
    parent: PathNode | null;
}
