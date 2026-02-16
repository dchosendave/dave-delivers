/**
 * Skills API Endpoint
 * 
 * Replaces: FastAPI @router.get("/skills", response_model=List[Skill])
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { DeveloperInformationRepository } from '$lib/server/repositories/developer-repository';

const repository = new DeveloperInformationRepository();

/**
 * GET /api/skills
 * 
 * Retrieves all skills ordered by proficiency (descending)
 */
export const GET: RequestHandler = async () => {
    try {
        const skills = await repository.getSkills();
        return json(skills);
    } catch (error) {
        console.error('❌ Failed to fetch skills:', error);
        return json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        );
    }
};
