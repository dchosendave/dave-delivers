/**
 * Terminal API — typed wrapper for the terminal execute endpoint.
 *
 * The ".NET Bridge":
 * - Equivalent to a C# service method:
 *   `public Task<CommandResponse> ExecuteAsync(string command)`
 * - Keeps the Terminal component free of HTTP plumbing.
 *
 * Usage:
 *   import { executeCommand } from '$lib/api/terminal';
 *   const response = await executeCommand('help');
 */

import { apiPost } from './client';
import type { CommandRequest, CommandResponse } from '$lib/types';

/**
 * Sends a terminal command to the server and returns the formatted output.
 *
 * @param command - Raw command string typed by the user (e.g. "help", "projects")
 * @returns       - CommandResponse with `output`, `user`, and `path` fields
 * @throws        - Error if the server returns a non-2xx status
 */
export async function executeCommand(command: string): Promise<CommandResponse> {
    const body: CommandRequest = { command };
    return apiPost<CommandRequest, CommandResponse>('/execute', body);
}
