/**
 * Database Models - TypeScript interfaces replacing Python SQLModel classes
 * 
 * The ".NET Bridge":
 * - Python: class Project(SQLModel, table=True) → TypeScript: interface Project
 * - Similar to C# DTOs / record types with strict typing
 * - Optional fields use ? (like nullable types in C#)
 */

import { z } from 'zod';

// --- Enums ---

/**
 * Contact type enumeration
 * Python equivalent: class ContactType(str, Enum)
 * C# equivalent: public enum ContactType { Gmail, Github, ... }
 */
export enum ContactType {
    Gmail = 'gmail',
    Github = 'github',
    LinkedIn = 'linkedin',
    Viber = 'viber',
    WhatsApp = 'whatsapp'
}

// --- Database Entity Interfaces ---

/**
 * Project entity
 * Python: class Project(SQLModel, table=True)
 * C# equivalent: public record Project(int? Id, string Name, ...)
 */
export interface Project {
    id?: number; // Optional = nullable in C# (auto-increment primary key)
    name: string;
    description: string;
    tags: string; // Comma-separated tags
    url: string | null; // Explicitly nullable
    created_at: string; // ISO 8601 datetime string from SQLite
}

/**
 * Skill entity
 * Represents technical proficiency levels
 */
export interface Skill {
    id?: number;
    name: string;
    proficiency: number; // 0-100 percentage
    created_at: string;
}

/**
 * Contact entity
 * Stores contact information with different channel types
 */
export interface Contact {
    id?: number;
    type: ContactType; // Uses enum for type safety
    value: string;
    url: string | null;
    created_at: string;
}

/**
 * Experience entity
 * Professional experience records
 */
export interface Experience {
    id?: number;
    company: string;
    duration: string; // e.g., "2023 - Present"
    description: string;
    tech_stack: string; // Comma-separated technologies
    created_at: string;
}

// --- Request/Response Models for Terminal API ---

/**
 * Terminal command request
 * Python: class CommandRequest(BaseModel)
 * C# equivalent: public record CommandRequest(string Command);
 */
export interface CommandRequest {
    command: string;
}

/**
 * Terminal command response
 * Python: class CommandResponse(BaseModel)
 */
export interface CommandResponse {
    output: string;
    user: string;
    path: string;
}

// --- Zod Validation Schemas (Runtime Type Checking) ---

/**
 * Runtime validation for command requests
 * Similar to C# Data Annotations: [Required, StringLength(100)]
 * or FluentValidation rules
 */
export const CommandRequestSchema = z.object({
    command: z.string().min(1, 'Command cannot be empty').max(500, 'Command too long')
});

/**
 * Validation schema for ContactType enum values
 * Ensures only valid enum values are accepted
 */
export const ContactTypeSchema = z.nativeEnum(ContactType);

// --- Type Guards (Optional, for runtime type checking) ---

/**
 * Checks if a value is a valid ContactType
 * C# equivalent: value is ContactType type guard
 */
export function isContactType(value: string): value is ContactType {
    return Object.values(ContactType).includes(value as ContactType);
}
