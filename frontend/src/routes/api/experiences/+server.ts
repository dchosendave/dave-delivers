/**
 * Experience API Endpoint
 * 
 * Replaces: FastAPI @router.get("/experiences", response_model=List[Experience])
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { DeveloperInformationRepository } from '$lib/server/repositories/developer-repository';

const repository = new DeveloperInformationRepository();

/**
 * GET /api/experiences
 * 
 * Retrieves all professional experience records
 */
export const GET: RequestHandler = async () => {
    try {
        const experiences = await repository.getExperience();
        return json(experiences);
    } catch (error) {
        console.error('❌ Failed to fetch experiences:', error);
        return json(
            { error: 'Failed to fetch experiences' },
            { status: 500 }
        );
    }
};
