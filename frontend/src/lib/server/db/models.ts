/**
 * Server-side Database Models
 *
 * The ".NET Bridge":
 * - This file is the server-side counterpart to `src/lib/types/database.ts`.
 * - It re-exports the shared TypeScript interfaces (usable everywhere) and
 *   adds Zod schemas for *runtime* validation (server-only).
 * - Zod schemas are like C# Data Annotations + FluentValidation combined:
 *   they enforce shape AND business rules at the API boundary.
 *
 * Why split?
 *   SvelteKit enforces that files inside `src/lib/server/` cannot be
 *   imported by client-side code. Shared types live in `src/lib/types/`
 *   so Svelte components can use them without violating that boundary.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Re-export shared types so server code can import from one place
// ---------------------------------------------------------------------------

export type { Project, Skill, Contact, Experience, CommandRequest, CommandResponse } from '$lib/types';
export { ContactType } from '$lib/types';

// ---------------------------------------------------------------------------
// Zod Validation Schemas (Runtime Type Checking — server-only)
// ---------------------------------------------------------------------------

/**
 * Runtime validation for incoming terminal command requests.
 *
 * C# equivalent:
 *   public class CommandRequestValidator : AbstractValidator<CommandRequest> {
 *     RuleFor(x => x.Command).NotEmpty().MaximumLength(500);
 *   }
 */
export const CommandRequestSchema = z.object({
    command: z.string().min(1, 'Command cannot be empty').max(500, 'Command too long')
});

/**
 * Validation schema for ContactType enum values.
 * Ensures only valid enum values are accepted from external input.
 */
export const ContactTypeSchema = z.enum(['gmail', 'github', 'linkedin', 'viber', 'whatsapp']);

// ---------------------------------------------------------------------------
// Type Guards (runtime narrowing helpers)
// ---------------------------------------------------------------------------

/**
 * Checks if a value is a valid ContactType string.
 * C# equivalent: value is ContactType (pattern matching)
 */
export function isContactType(value: string): boolean {
    return ContactTypeSchema.safeParse(value).success;
}
