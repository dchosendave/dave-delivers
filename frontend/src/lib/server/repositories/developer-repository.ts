/**
 * Developer Information Repository
 * 
 * Replaces: backend/app/repositories/developer_repository.py
 * 
 * The ".NET Bridge":
 * - Same Repository pattern used in .NET (Repository/UnitOfWork)
 * - Python: session.exec(select(Project)).all() → TypeScript: db.execute('SELECT...')
 * - Similar to using Dapper in .NET (raw SQL with type safety)
 * - All methods are async (like Entity Framework Core async methods)
 */

import { db } from '../db/connection';
import type { Project, Skill, Contact, Experience, Message } from '../db/models';
import type { ResultSet } from '@libsql/client';

/**
 * Repository class for accessing developer portfolio data
 * 
 * C# equivalent:
 * public class DeveloperInformationRepository : IRepository
 * {
 *     private readonly DbContext _context;
 *     public async Task<List<Project>> GetProjectsAsync() { ... }
 * }
 */
export class DeveloperInformationRepository {
    /**
     * Get all projects
     * 
     * Python: def get_projects(self)
     * SQL: SELECT * FROM project
     */
    async getProjects(): Promise<Project[]> {
        try {
            const result: ResultSet = await db.execute('SELECT * FROM project');

            // Cast rows to Project[] with proper type safety
            return result.rows.map((row) => ({
                id: row.id as number,
                name: row.name as string,
                description: row.description as string,
                tags: row.tags as string,
                url: row.url as string | null,
                created_at: row.created_at as string
            }));
        } catch (error) {
            console.error('❌ Failed to fetch projects:', error);
            throw new Error('Database query failed: projects');
        }
    }

    /**
     * Get all skills ordered by proficiency (descending)
     * 
     * Python: select(Skill).order_by(Skill.proficiency.desc())
     * SQL: SELECT * FROM skill ORDER BY proficiency DESC
     */
    async getSkills(): Promise<Skill[]> {
        try {
            const result: ResultSet = await db.execute(
                'SELECT * FROM skill ORDER BY proficiency DESC'
            );

            return result.rows.map((row) => ({
                id: row.id as number,
                name: row.name as string,
                proficiency: row.proficiency as number,
                created_at: row.created_at as string
            }));
        } catch (error) {
            console.error('❌ Failed to fetch skills:', error);
            throw new Error('Database query failed: skills');
        }
    }

    /**
     * Get all contacts ordered by type (ascending)
     * 
     * Python: select(Contact).order_by(Contact.type.asc())
     * SQL: SELECT * FROM contact ORDER BY type ASC
     */
    async getContacts(): Promise<Contact[]> {
        try {
            const result: ResultSet = await db.execute('SELECT * FROM contact ORDER BY type ASC');

            return result.rows.map((row) => ({
                id: row.id as number,
                type: row.type as Contact['type'],
                value: row.value as string,
                url: row.url as string | null,
                created_at: row.created_at as string
            }));
        } catch (error) {
            console.error('❌ Failed to fetch contacts:', error);
            throw new Error('Database query failed: contacts');
        }
    }

    /**
     * Get all experience records
     * 
     * Python: def get_experience(self)
     * SQL: SELECT * FROM experience
     */
    async getExperience(): Promise<Experience[]> {
        try {
            const result: ResultSet = await db.execute('SELECT * FROM experience');

            return result.rows.map((row) => ({
                id: row.id as number,
                company: row.company as string,
                duration: row.duration as string,
                description: row.description as string,
                tech_stack: row.tech_stack as string,
                created_at: row.created_at as string
            }));
        } catch (error) {
            console.error('❌ Failed to fetch experience:', error);
            throw new Error('Database query failed: experience');
        }
    }

    /**
     * Save a contact form message
     * 
     * SQL: INSERT INTO message (name, email, content) VALUES (?, ?, ?)
     */
    async saveMessage(name: string, email: string, content: string): Promise<void> {
        try {
            await db.execute({
                sql: 'INSERT INTO message (name, email, content, created_at) VALUES (?, ?, ?, datetime(\'now\'))',
                args: [name, email, content]
            });
        } catch (error) {
            console.error('❌ Failed to save message:', error);
            throw new Error('Database query failed: save message');
        }
    }

    /**
     * Get all messages ordered by newest first
     * 
     * SQL: SELECT * FROM message ORDER BY created_at DESC
     */
    async getMessages(): Promise<Message[]> {
        try {
            const result: ResultSet = await db.execute(
                'SELECT * FROM message ORDER BY created_at DESC'
            );

            return result.rows.map((row) => ({
                id: row.id as number,
                name: row.name as string,
                email: row.email as string,
                content: row.content as string,
                created_at: row.created_at as string
            }));
        } catch (error) {
            console.error('❌ Failed to fetch messages:', error);
            throw new Error('Database query failed: messages');
        }
    }
}
