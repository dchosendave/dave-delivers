/**
 * Projects API Endpoint
 * 
 * Replaces: FastAPI @router.get("/projects", response_model=List[Project])
 * 
 * The ".NET Bridge":
 * - Similar to C#: [HttpGet("projects")] public async Task<ActionResult<List<Project>>> GetProjects()
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { DeveloperInformationRepository } from '$lib/server/repositories/developer-repository';

// Singleton repository instance
const repository = new DeveloperInformationRepository();

/**
 * GET /api/projects
 * 
 * Retrieves all projects as JSON array
 * 
 * @example
 * Request: GET /api/projects
 * Response: [{ id: 1, name: "...", description: "...", ... }]
 */
export const GET: RequestHandler = async () => {
    try {
        const projects = await repository.getProjects();
        return json(projects);
    } catch (error) {
        console.error('❌ Failed to fetch projects:', error);
        return json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
};
