/**
 * Contacts API Endpoint
 * 
 * Replaces: FastAPI @router.get("/contacts", response_model=List[Contact])
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { DeveloperInformationRepository } from '$lib/server/repositories/developer-repository';

const repository = new DeveloperInformationRepository();

/**
 * GET /api/contacts
 * 
 * Retrieves all contact information ordered by type
 */
export const GET: RequestHandler = async () => {
    try {
        const contacts = await repository.getContacts();
        return json(contacts);
    } catch (error) {
        console.error('❌ Failed to fetch contacts:', error);
        return json(
            { error: 'Failed to fetch contacts' },
            { status: 500 }
        );
    }
};
