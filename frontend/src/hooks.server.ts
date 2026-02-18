/**
 * SvelteKit Server Hooks
 * 
 * Initializes the database connection and tables on server startup.
 * Auto-seeds when tables are empty (first run).
 * 
 * The ".NET Bridge":
 * - Similar to C# Program.cs startup pipeline
 * - initializeOnce() ≈ ConfigureServices + DbInitializer.Seed()
 * - handle() ≈ app.Use() middleware pipeline
 */

import { initializeDatabase, checkDatabaseConnection } from '$lib/server/db/connection';
import { isDatabaseEmpty, seedDatabase } from '$lib/server/db/seed';
import type { Handle } from '@sveltejs/kit';

// Initialize database on server startup
let databaseInitialized = false;

async function initializeOnce(): Promise<void> {
    if (!databaseInitialized) {
        console.log('🔄 Initializing database connection...');

        const isConnected = await checkDatabaseConnection();
        if (!isConnected) {
            console.error('❌ Failed to connect to database');
            throw new Error('Database connection failed');
        }

        await initializeDatabase();

        // Auto-seed if tables are empty (first run)
        if (await isDatabaseEmpty()) {
            console.log('📭 Database is empty — auto-seeding...');
            await seedDatabase();
        }

        databaseInitialized = true;
        console.log('✅ Database initialized successfully');
    }
}

/**
 * SvelteKit handle hook
 * 
 * Runs on every request (like middleware in .NET)
 * Initialize database once on first request
 */
export const handle: Handle = async ({ event, resolve }) => {
    // Initialize database on first request
    if (!databaseInitialized) {
        try {
            await initializeOnce();
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            // Continue anyway - error will be caught in individual routes
        }
    }

    // Continue with request handling
    return await resolve(event);
};
