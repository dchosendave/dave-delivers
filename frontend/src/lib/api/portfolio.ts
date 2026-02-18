/**
 * Portfolio API — typed wrappers for portfolio data endpoints.
 *
 * The ".NET Bridge":
 * - This is the TypeScript equivalent of a C# service class that wraps
 *   HttpClient calls, e.g. `PortfolioService.GetProjectsAsync()`.
 * - Components import these functions instead of calling fetch() directly,
 *   keeping HTTP concerns out of the UI layer.
 *
 * Usage in a Svelte component:
 *   import { getProjects, getSkills } from '$lib/api/portfolio';
 *   const projects = await getProjects();
 */

import { apiGet } from './client';
import type { Project, Skill, Contact, Experience } from '$lib/types';

/**
 * Fetches all portfolio projects.
 * Replaces: fetch('/api/projects') with any[]
 */
export async function getProjects(): Promise<Project[]> {
    return apiGet<Project[]>('/projects');
}

/**
 * Fetches all skills ordered by proficiency (descending).
 * Replaces: fetch('/api/skills') with any[]
 */
export async function getSkills(): Promise<Skill[]> {
    return apiGet<Skill[]>('/skills');
}

/**
 * Fetches all contact channels.
 * Replaces: fetch('/api/contacts') with any[]
 */
export async function getContacts(): Promise<Contact[]> {
    return apiGet<Contact[]>('/contacts');
}

/**
 * Fetches all work experience records.
 * Replaces: fetch('/api/experiences') with any[]
 */
export async function getExperiences(): Promise<Experience[]> {
    return apiGet<Experience[]>('/experiences');
}
