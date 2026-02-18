/**
 * Base API Client
 *
 * The ".NET Bridge":
 * - This is the TypeScript equivalent of a typed HttpClient wrapper in C#.
 * - Instead of writing `new HttpClient().GetAsync(...)` everywhere, you
 *   inject a pre-configured client. Here we export typed helper functions.
 * - All internal SvelteKit API calls go through this module so that:
 *     1. The base path is defined in one place (constants.ts).
 *     2. Error handling is consistent across the app.
 *     3. Content-Type headers are always set correctly.
 */

import { API_BASE } from '$lib/utils/constants';

// ---------------------------------------------------------------------------
// Core request helper
// ---------------------------------------------------------------------------

/**
 * Performs a typed fetch request against the internal SvelteKit API.
 *
 * @param endpoint - Path relative to API_BASE, e.g. "/projects"
 * @param options  - Standard RequestInit options (method, body, headers…)
 * @returns        - Parsed JSON response cast to T
 * @throws         - Error with HTTP status message on non-2xx responses
 *
 * C# equivalent:
 *   public async Task<T> GetAsync<T>(string endpoint) { ... }
 */
export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`API error ${response.status}: ${response.statusText} (${endpoint})`);
    }

    return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

/**
 * GET request helper.
 * C# equivalent: httpClient.GetFromJsonAsync<T>(url)
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
    return apiRequest<T>(endpoint, { method: 'GET' });
}

/**
 * POST request helper.
 * C# equivalent: httpClient.PostAsJsonAsync(url, body)
 */
export async function apiPost<TBody, TResponse>(
    endpoint: string,
    body: TBody
): Promise<TResponse> {
    return apiRequest<TResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    });
}
