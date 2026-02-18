/**
 * Database Seeding Module
 * 
 * Replaces: backend/seed.py
 * 
 * Called automatically from hooks.server.ts on first run when tables are empty.
 * This populates the database with initial portfolio data.
 */

import { db } from './connection';
import type { Project, Skill, Contact, Experience } from './models';
import { ContactType } from './models';

/**
 * Checks if all database tables are empty.
 * Used by hooks.server.ts to decide whether to auto-seed.
 */
export async function isDatabaseEmpty(): Promise<boolean> {
    const tables = ['project', 'skill', 'contact', 'experience'];
    for (const table of tables) {
        const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result.rows[0]?.count as number;
        if (count > 0) return false;
    }
    return true;
}

/**
 * Seed data function - populates database with initial data.
 * Called from hooks.server.ts when tables are empty.
 */
export async function seedDatabase(): Promise<void> {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Seed Projects
        console.log('📂 Seeding projects...');
        const projects: Omit<Project, 'id' | 'created_at'>[] = [
            {
                name: 'PEMI ClientEase',
                description: 'Client-facing system made for registration of investor accounts and KYC',
                tags: 'Angular, .NET Web API, PostgreSQL, AWS LightSail',
                url: null
            },
            {
                name: 'Report Generator System',
                description: 'Implemented user access management and role-based access control (RBAC), password recovery and enforcement, and dynamic role-driven navigation',
                tags: 'HTML/CSS, jQuery, ASP.NET Web Forms, MS SQL Server, IIS Manager',
                url: 'Company Internal System'
            },
            {
                name: 'PEMI Website',
                description: 'Maintained and supported the website by delivering over 20+ production deployments',
                tags: 'HTML/CSS, JavaScript, PHP, MySQL, Linux',
                url: 'http://www.philequity.net'
            },
            {
                name: 'Letter-of-Intent Generator',
                description: 'Developed a web-based tool that automates the generation of letters of intent for investment transactions and integrated it into an external legacy Oracle Database',
                tags: 'Alpine.js, ASP.NET MVC, Oracle Database, IIS Manager',
                url: 'Company Internal System'
            },
            {
                name: 'Apple-themed Portfolio',
                description: "A modern minimalist portfolio inspired by Apple's UI/UX design",
                tags: 'Svelte, SvelteKit, SQLite, TypeScript',
                url: null
            },
            {
                name: 'Terminal Portfolio',
                description: 'A retro terminal-style personal portfolio website',
                tags: 'Svelte, SvelteKit, SQLite, TypeScript',
                url: null
            },
            {
                name: 'Macro Recorder',
                description: 'A macro recorder for Windows',
                tags: 'Python, Customtkinter',
                url: null
            }
        ];

        for (const project of projects) {
            await db.execute({
                sql: 'INSERT INTO project (name, description, tags, url, created_at) VALUES (?, ?, ?, ?, datetime(\'now\'))',
                args: [project.name, project.description, project.tags, project.url]
            });
        }
        console.log(`✅ Seeded ${projects.length} projects\n`);

        // Step 4: Seed Skills
        console.log('💪 Seeding skills...');
        const skills: Omit<Skill, 'id' | 'created_at'>[] = [
            { name: 'Python', proficiency: 70 },
            { name: 'C# / .NET', proficiency: 90 },
            { name: 'JavaScript', proficiency: 90 },
            { name: 'SQL Server', proficiency: 90 },
            { name: 'PostgreSQL', proficiency: 80 },
            { name: 'FastAPI', proficiency: 70 },
            { name: 'Svelte', proficiency: 70 },
            { name: 'Git', proficiency: 90 },
            { name: 'REST APIs', proficiency: 90 },
            { name: 'Angular', proficiency: 70 },
            { name: 'jQuery', proficiency: 90 },
            { name: 'HTML/CSS', proficiency: 90 },
            { name: 'Alpine.js', proficiency: 90 },
            { name: 'PHP', proficiency: 90 }
        ];

        for (const skill of skills) {
            await db.execute({
                sql: 'INSERT INTO skill (name, proficiency, created_at) VALUES (?, ?, datetime(\'now\'))',
                args: [skill.name, skill.proficiency]
            });
        }
        console.log(`✅ Seeded ${skills.length} skills\n`);

        // Step 5: Seed Contacts
        console.log('📧 Seeding contacts...');
        const contacts: Omit<Contact, 'id' | 'created_at'>[] = [
            {
                type: ContactType.Gmail,
                value: 'lowiedave30@gmail.com',
                url: 'mailto:lowiedave30@gmail.com'
            },
            {
                type: ContactType.Github,
                value: 'GitHub',
                url: 'https://github.com/dchosendave'
            },
            {
                type: ContactType.LinkedIn,
                value: 'LinkedIn',
                url: 'https://linkedin.com/in/davedichoson'
            },
            {
                type: ContactType.Viber,
                value: '+639150833518',
                url: null
            },
            {
                type: ContactType.WhatsApp,
                value: '+639150833518',
                url: null
            }
        ];

        for (const contact of contacts) {
            await db.execute({
                sql: 'INSERT INTO contact (type, value, url, created_at) VALUES (?, ?, ?, datetime(\'now\'))',
                args: [contact.type, contact.value, contact.url]
            });
        }
        console.log(`✅ Seeded ${contacts.length} contacts\n`);

        // Step 6: Seed Experience
        console.log('💼 Seeding experience records...');
        const experiences: Omit<Experience, 'id' | 'created_at'>[] = [
            {
                company: 'VANTAGE FINANCIAL CORP.',
                duration: '2023 - Present',
                description: 'Backend Developer building scalable APIs and microservices, and maintaining legacy systems.',
                tech_stack: '.NET Core, .NET Framework, VB.NET, SQL Server / MySQL / Oracle SQL / PostgreSQL, AWS EC2/RDS/S3, Git'
            },
            {
                company: 'EASTWEST BANKING CORP.',
                duration: 'March 2023 - July 2023',
                description: 'Software QA Intern who performed manual & automated testing on different Automatic Teller Machines.',
                tech_stack: 'Manual/Automated Testing, Defect Tracking, Reporting, Banking Domain, Agile/Scrum'
            },
            {
                company: 'UNIVERSITY OF MAKATI',
                duration: 'Sept 2022 - August 2023',
                description: 'Wrote a thesis about the comparison in performance of pathfinding algorithms in a grid-based environment. Integrated it into a 2D educational game.',
                tech_stack: 'Unity, C#, Pathfinding Algorithms, Sprites, UI Design, Adobe Photoshop/Premiere Pro'
            },
            {
                company: 'UNIVERSITY OF MAKATI',
                duration: 'Sept 2021 - May 2022',
                description: 'Developed a web-based voting system for the student council.',
                tech_stack: 'HTML/CSS, C#, ASP.NET Web Forms, MySQL'
            },
            {
                company: 'UNIVERSITY OF MAKATI',
                duration: 'Sept 2020 - May 2021',
                description: 'Developed a mobile-based appointment system for a pet clinic.',
                tech_stack: 'Android Studio, Java, XML UI, Firebase'
            },
            {
                company: 'UNIVERSITY OF MAKATI',
                duration: '2019',
                description: 'Debugged my first program. It was a mess.',
                tech_stack: 'Java, jGrasp'
            }
        ];

        for (const experience of experiences) {
            await db.execute({
                sql: 'INSERT INTO experience (company, duration, description, tech_stack, created_at) VALUES (?, ?, ?, ?, datetime(\'now\'))',
                args: [experience.company, experience.duration, experience.description, experience.tech_stack]
            });
        }
        console.log(`✅ Seeded ${experiences.length} experience records\n`);

        console.log('🎉 Database seeded successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - Projects: ${projects.length}`);
        console.log(`   - Skills: ${skills.length}`);
        console.log(`   - Contacts: ${contacts.length}`);
        console.log(`   - Experience: ${experiences.length}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}
