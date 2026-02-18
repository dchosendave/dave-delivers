/**
 * Turso Database Connection Manager
 * 
 * Replaces: backend/app/database.py
 * 
 * The ".NET Bridge":
 * - Python: create_engine() + get_session() → createClient() singleton
 * - Similar to C#: DbContext with Singleton/Scoped lifetime in DI container
 * - Async operations like Entity Framework Core async methods
 * 
 * IMPORTANT: Before deployment, you need to:
 * 1. Create a Turso database: `turso db create dave-delivers`
 * 2. Get the URL: `turso db show dave-delivers`
 * 3. Create an auth token: `turso db tokens create dave-delivers`
 * 4. Add environment variables to `.env` file
 */

import { createClient } from '@libsql/client';
import { TURSO_DB_URL, TURSO_DB_AUTH_TOKEN } from '$env/static/private';

/**
 * Singleton database connection
 * 
 * For local development without Turso (optional):
 * - Install `turso dev` CLI tool
 * - Or use: url: 'file:../database/portfolio.db' (local SQLite file)
 */
export const db = createClient({
	url: TURSO_DB_URL || 'file:../database/portfolio.db', // Fallback to local file
	authToken: TURSO_DB_AUTH_TOKEN || undefined
});

/**
 * Initialize database tables
 * 
 * Python equivalent: SQLModel.metadata.create_all(engine)
 * C# equivalent: dbContext.Database.EnsureCreated() or EF Migrations
 * 
 * Creates all tables if they don't exist (DDL statements)
 */
export async function initializeDatabase(): Promise<void> {
	try {
		// Create Project table
		await db.execute(`
			CREATE TABLE IF NOT EXISTS project (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				description TEXT NOT NULL,
				tags TEXT NOT NULL,
				url TEXT,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);

		// Create Skill table
		await db.execute(`
			CREATE TABLE IF NOT EXISTS skill (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				proficiency INTEGER NOT NULL CHECK(proficiency >= 0 AND proficiency <= 100),
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);

		// Create Contact table
		await db.execute(`
			CREATE TABLE IF NOT EXISTS contact (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				type TEXT NOT NULL CHECK(type IN ('gmail', 'github', 'linkedin', 'viber', 'whatsapp')),
				value TEXT NOT NULL,
				url TEXT,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);

		// Create Experience table
		await db.execute(`
			CREATE TABLE IF NOT EXISTS experience (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				company TEXT NOT NULL,
				duration TEXT NOT NULL,
				description TEXT NOT NULL,
				tech_stack TEXT NOT NULL,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);

		// Create Message table (contact form submissions)
		await db.execute(`
			CREATE TABLE IF NOT EXISTS message (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				email TEXT NOT NULL,
				content TEXT NOT NULL,
				created_at TEXT NOT NULL DEFAULT (datetime('now'))
			)
		`);

		console.log('✅ Database tables initialized successfully');
	} catch (error) {
		console.error('❌ Failed to initialize database:', error);
		throw error;
	}
}

/**
 * Health check for database connection
 * Useful for debugging and startup verification
 */
export async function checkDatabaseConnection(): Promise<boolean> {
	try {
		await db.execute('SELECT 1');
		return true;
	} catch (error) {
		console.error('❌ Database connection failed:', error);
		return false;
	}
}
