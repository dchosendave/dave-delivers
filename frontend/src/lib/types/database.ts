/**
 * Database Entity Types — Shared between frontend and server
 *
 * The ".NET Bridge":
 * - These are the TypeScript equivalent of C# DTOs / record types.
 * - They live in `src/lib/types/` (NOT `src/lib/server/`) so that
 *   Svelte components can import them without hitting SvelteKit's
 *   server-only boundary.
 * - The Zod validation schemas that enforce these shapes at runtime
 *   stay in `src/lib/server/db/models.ts` (server-only).
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/**
 * Contact channel type.
 * C# equivalent: public enum ContactType { Gmail, Github, LinkedIn, ... }
 */
export enum ContactType {
    Gmail = 'gmail',
    Github = 'github',
    LinkedIn = 'linkedin',
    Viber = 'viber',
    WhatsApp = 'whatsapp'
}

// ---------------------------------------------------------------------------
// Database entity interfaces
// ---------------------------------------------------------------------------

/**
 * Project entity.
 * C# equivalent: public record Project(int? Id, string Name, ...);
 */
export interface Project {
    id?: number;
    name: string;
    description: string;
    /** Comma-separated list of technology tags */
    tags: string;
    url: string | null;
    created_at: string;
}

/**
 * Skill entity — represents a technical proficiency level.
 */
export interface Skill {
    id?: number;
    name: string;
    /** 0–100 percentage */
    proficiency: number;
    created_at: string;
}

/**
 * Contact entity — a single contact channel (email, GitHub, etc.).
 */
export interface Contact {
    id?: number;
    type: ContactType;
    value: string;
    url: string | null;
    created_at: string;
}

/**
 * Experience entity — a professional work-history record.
 */
export interface Experience {
    id?: number;
    company: string;
    /** Human-readable range, e.g. "2023 – Present" */
    duration: string;
    description: string;
    /** Comma-separated list of technologies */
    tech_stack: string;
    created_at: string;
}

// ---------------------------------------------------------------------------
// Terminal API request / response shapes
// ---------------------------------------------------------------------------

/**
 * Body sent to POST /api/execute.
 * C# equivalent: public record CommandRequest(string Command);
 */
export interface CommandRequest {
    command: string;
}

/**
 * Response returned by POST /api/execute.
 * C# equivalent: public record CommandResponse(string Output, string User, string Path);
 */
export interface CommandResponse {
    output: string;
    user: string;
    path: string;
}
