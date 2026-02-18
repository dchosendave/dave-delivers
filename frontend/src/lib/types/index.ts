/**
 * Types barrel — re-exports every public type from this directory.
 *
 * Usage:
 *   import type { Project, Skill, CommandResponse } from '$lib/types';
 *
 * The ".NET Bridge":
 *   Similar to a C# namespace that groups related types together,
 *   or a "using" alias that simplifies long import paths.
 */

export type { Project, Skill, Contact, Experience, CommandRequest, CommandResponse } from './database';
export { ContactType } from './database';
export type {
    GitHubUser,
    GitHubRepo,
    LanguageStats,
    LanguagePercentage,
    GitHubStats,
    ContributionYear,
    ContributionDay
} from './github-types';
export type { ISSPosition, ISSData, ISSStats, ISSTrackerProps } from './iss-types';
export type { WindowType, WindowState, WindowConfig, WindowComponentProps } from './window-types';

