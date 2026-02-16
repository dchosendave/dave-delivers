/**
 * Terminal Execute API Endpoint
 * 
 * Replaces: FastAPI @router.post("/execute", response_model=CommandResponse)
 * 
 * The ".NET Bridge":
 * - FastAPI route decorator → SvelteKit +server.ts file with exported POST function
 * - Similar to C# Web API: [HttpPost("execute")] public async Task<IActionResult> Execute(...)
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { TerminalService } from '$lib/server/services/terminal-service';
import { CommandRequestSchema } from '$lib/server/db/models';
import { z } from 'zod';

// Singleton service instance (like scoped service in .NET DI)
const terminalService = new TerminalService();

/**
 * POST /api/execute
 * 
 * Processes terminal commands and returns formatted output
 * 
 * @example
 * Request: POST /api/execute
 * Body: { "command": "help" }
 * Response: { "output": "...", "user": "", "path": "" }
 */
export const POST: RequestHandler = async ({ request }) => {
    try {
        // Parse and validate request body
        const body = await request.json();

        // Runtime validation (like C# ModelState.IsValid or [ApiController] auto-validation)
        const validated = CommandRequestSchema.parse(body);

        // Process command
        const response = await terminalService.processCommand(validated.command);

        // Return JSON response
        return json(response);
    } catch (error) {
        // Handle validation errors from Zod
        if (error instanceof z.ZodError) {
            return json(
                {
                    output: 'Invalid command format',
                    user: '',
                    path: '',
                    errors: error.issues
                },
                { status: 400 }
            );
        }

        // Handle other errors
        console.error('❌ Terminal command execution failed:', error);
        return json(
            {
                output: 'Internal server error',
                user: '',
                path: ''
            },
            { status: 500 }
        );
    }
};
