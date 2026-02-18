/**
 * Messages API Endpoint
 * 
 * POST /api/messages — Accept and store a contact form submission.
 * 
 * C# equivalent:
 *   [HttpPost("api/messages")]
 *   public async Task<IActionResult> CreateMessage([FromBody] MessageRequest request)
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { DeveloperInformationRepository } from '$lib/server/repositories/developer-repository';
import { MessageRequestSchema } from '$lib/server/db/models';

const repository = new DeveloperInformationRepository();

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();

        // Validate input with Zod
        const parsed = MessageRequestSchema.safeParse(body);
        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            return json(
                { error: 'Validation failed', details: errors },
                { status: 400 }
            );
        }

        const { name, email, content } = parsed.data;

        // Save to database
        await repository.saveMessage(name, email, content);

        console.log(`📬 New message from ${name} (${email})`);

        return json(
            { message: 'Message sent successfully!' },
            { status: 201 }
        );
    } catch (error) {
        console.error('❌ Failed to process message:', error);
        return json(
            { error: 'Failed to send message. Please try again.' },
            { status: 500 }
        );
    }
};
