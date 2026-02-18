/**
 * Application-wide Constants
 *
 * The ".NET Bridge":
 * - Equivalent to C# `static readonly` fields in a constants class,
 *   or `const` values in a shared configuration file.
 * - Centralising magic strings/numbers here means you only change
 *   them in one place.
 */

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/** Base path for all internal SvelteKit API routes. */
export const API_BASE = '/api' as const;

// ---------------------------------------------------------------------------
// Contact channel labels & icons (text fallback)
// ---------------------------------------------------------------------------

/**
 * Human-readable labels for each ContactType value.
 * C# equivalent: a Dictionary<ContactType, string> lookup.
 */
export const CONTACT_LABELS: Record<string, string> = {
    gmail: 'Email',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    viber: 'Viber'
} as const;

// ---------------------------------------------------------------------------
// Animation defaults
// ---------------------------------------------------------------------------

/** Default stagger interval (ms) between animated list items. */
export const DEFAULT_STAGGER_MS = 150 as const;

/** Default stagger interval for contact buttons. */
export const CONTACT_STAGGER_MS = 100 as const;

// ---------------------------------------------------------------------------
// Pagination / limits
// ---------------------------------------------------------------------------

/** Maximum number of projects shown in the grid. */
export const MAX_PROJECTS_DISPLAY = 12 as const;

/** Maximum number of skills shown in the grid. */
export const MAX_SKILLS_DISPLAY = 18 as const;
