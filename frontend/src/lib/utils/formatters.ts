/**
 * Formatting Utilities
 *
 * The ".NET Bridge":
 * - These are the TypeScript equivalent of C# extension methods or
 *   static helper classes (e.g. `StringExtensions`, `DateHelper`).
 * - Pure functions — no side effects, easy to unit-test.
 */

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Formats an ISO 8601 date string into a human-readable short date.
 * @example formatDate('2024-03-15T10:00:00') → "Mar 15, 2024"
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Formats an ISO 8601 date string into a relative time label.
 * @example formatRelativeDate('2023-01-01') → "2 years ago"
 */
export function formatRelativeDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

// ---------------------------------------------------------------------------
// Skill helpers
// ---------------------------------------------------------------------------

/**
 * Converts a 0–100 proficiency value into a label.
 * @example getProficiencyLabel(95) → "Expert"
 */
export function getProficiencyLabel(proficiency: number): string {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 60) return 'Intermediate';
    if (proficiency >= 40) return 'Familiar';
    return 'Learning';
}

// ---------------------------------------------------------------------------
// Tag / string helpers
// ---------------------------------------------------------------------------

/**
 * Splits a comma-separated tag string into a trimmed array.
 * @example parseTags("TypeScript, Svelte, SQL") → ["TypeScript", "Svelte", "SQL"]
 */
export function parseTags(tags: string): string[] {
    return tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
}

/**
 * Truncates a string to `maxLength` characters, appending "…" if needed.
 * @example truncate("Hello World", 8) → "Hello Wo…"
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '…';
}
