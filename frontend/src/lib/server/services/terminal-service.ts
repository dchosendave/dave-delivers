/**
 * Terminal Service - Business Logic Layer
 * 
 * Replaces: backend/app/services/terminal_service.py
 * 
 * The ".NET Bridge":
 * - Python service class → TypeScript service class (same OOP pattern)
 * - Similar to C# service layer in Clean Architecture
 * - processCommand() is like a controller action/service method
 * - Returns CommandResponse DTO (like returning ActionResult<T>)
 */

import { DeveloperInformationRepository } from '../repositories/developer-repository';
import type { CommandResponse } from '../db/models';

/**
 * Terminal command processor service
 * 
 * C# equivalent:
 * public class TerminalService : ITerminalService
 * {
 *     private readonly DeveloperInformationRepository _repository;
 *     public async Task<CommandResponse> ProcessCommandAsync(string commandText) { ... }
 * }
 */
export class TerminalService {
    private readonly repository: DeveloperInformationRepository;

    constructor() {
        this.repository = new DeveloperInformationRepository();
    }

    /**
     * Process terminal command and return formatted response
     * 
     * Python: def process_command(self, command_text: str) -> CommandResponse
     * C#: public async Task<CommandResponse> ProcessCommandAsync(string commandText)
     * 
     * @param commandText - The command entered by the user
     * @returns CommandResponse with formatted output
     */
    async processCommand(commandText: string): Promise<CommandResponse> {
        const cmd = commandText.toLowerCase().trim();

        // Command: help
        if (cmd === 'help') {
            return this.handleHelpCommand();
        }

        // Command: about
        if (cmd === 'about') {
            return this.handleAboutCommand();
        }

        // Command: projects
        if (cmd === 'projects') {
            return await this.handleProjectsCommand();
        }

        // Command: skills
        if (cmd === 'skills') {
            return await this.handleSkillsCommand();
        }

        // Command: contacts
        if (cmd === 'contacts') {
            return await this.handleContactsCommand();
        }

        // Command: experience
        if (cmd === 'experience') {
            return await this.handleExperienceCommand();
        }

        // Command: stack
        if (cmd === 'stack') {
            return this.handleStackCommand();
        }

        // Command: resume
        if (cmd === 'resume') {
            return this.handleResumeCommand();
        }

        // Command: neofetch (easter egg)
        if (cmd === 'neofetch') {
            return this.handleNeofetchCommand();
        }

        // Command: sudo* (easter egg)
        if (cmd.startsWith('sudo')) {
            return this.handleSudoCommand(cmd);
        }

        // Command: rm* (easter egg)
        if (cmd.startsWith('rm')) {
            return this.handleRmCommand();
        }

        // Command: shutdown (easter egg)
        if (cmd === 'shutdown') {
            return this.handleShutdownCommand();
        }

        // Unknown command
        return this.handleUnknownCommand(cmd);
    }

    // --- Command Handlers ---

    private handleHelpCommand(): CommandResponse {
        let output = 'Available commands:\n';
        output += '- help: you\'re looking at it, genius\n';
        output += '- about: who\'s behind this terminal?\n';
        output += '- experience: war stories from back in the day\n';
        output += '- projects: stuff i\'ve shipped\n';
        output += '- skills: my tech arsenal and loadout\n';
        output += '- contacts: slide into my DMs\n';
        output += '- stack: how i built this thing\n';
        output += '- resume: the formal stuff adults like (PDF)\n';
        output += '- clear: wipe the slate clean\n';

        return { output, user: '', path: '' };
    }

    private handleAboutCommand(): CommandResponse {
        let output = 'ABOUT ME\n';
        output += '========\n\n';
        output += 'Hi, I\'m <span style=\'color:#4facfe;font-weight:bold;\'>Dave Dichoson</span>.\n\n';
        output += 'I\'m a <span style=\'color:#bd5eff;\'>Backend Developer</span> with experience building\n';
        output += 'scalable APIs, database systems, and maintaining enterprise applications.\n\n';
        output += 'My core stack includes:\n';
        output += '  • .NET Core / C#\n';
        output += '  • JavaScript / TypeScript\n';
        output += '  • SQL Server / PostgreSQL / Oracle SQL / MySQL\n\n';
        output += 'but for this specific project, I used: Svelte, TypeScript, SvelteKit, and Turso (SQLite).\n';
        output += 'I\'m passionate about clean code, system design, automation, and AI.\n';
        output += 'Type <span style=\'color:#00ff00;\'>contacts</span> to get in touch!';

        return { output, user: '', path: '' };
    }

    private async handleProjectsCommand(): Promise<CommandResponse> {
        const projects = await this.repository.getProjects();

        if (projects.length === 0) {
            return { output: 'No projects found.', user: '', path: '' };
        }

        let output = '<span style=\'color:#00ff00;\'>STUFF I\'VE SHIPPED</span>\n';
        output += '━━━━━━━━━━━━━━━━━━━━\n\n';

        for (const project of projects) {
            output += `<span style='color:#4facfe;'>▸ ${project.name}</span>\n`;
            output += `  ${project.description}\n`;
            output += `  <span style='color:#888;'>[ ${project.tags} ]</span>\n\n`;
        }

        output += '<span style=\'color:#bd5eff; font-style:italic;\'>Type a project name to dive deeper... (coming soon)</span>';

        return { output, user: '', path: '' };
    }

    private async handleSkillsCommand(): Promise<CommandResponse> {
        const skills = await this.repository.getSkills();

        if (skills.length === 0) {
            return { output: 'Lowie is cooked. Damn.', user: '', path: '' };
        }

        let output = 'TECHNICAL SKILLS\n';
        output += '===================\n\n';

        // Calculate max name length for alignment
        const maxLen = Math.max(...skills.map((s) => s.name.length)) + 2;

        for (const skill of skills) {
            // 100% = 20 blocks
            const barLen = Math.floor(skill.proficiency / 5);
            const bar = '█'.repeat(barLen);
            const empty = '░'.repeat(20 - barLen);
            const namePadded = skill.name.padEnd(maxLen, ' ');

            output += `${namePadded} [${bar}${empty}] ${skill.proficiency}%\n`;
        }

        return { output, user: '', path: '' };
    }

    private async handleContactsCommand(): Promise<CommandResponse> {
        const contacts = await this.repository.getContacts();

        if (contacts.length === 0) {
            return { output: 'No contacts found.', user: '', path: '' };
        }

        let output = 'CONTACT CHANNELS\n';
        output += '----------------\n';

        // Icon mapping
        const icons: Record<string, string> = {
            gmail: '📧',
            github: '🐙',
            linkedin: '💼',
            viber: '📱',
            whatsapp: '💬'
        };

        for (const contact of contacts) {
            const icon = icons[contact.type] || '📞';
            const label = contact.type.charAt(0).toUpperCase() + contact.type.slice(1);
            const labelPadded = label.padEnd(10, ' ');

            if (contact.url) {
                const linkHtml = `<a href='${contact.url}' target='_blank' style='color: #4facfe; text-decoration: underline; cursor: pointer;'>${contact.value}</a>`;
                output += `${icon} ${labelPadded} : ${linkHtml}\n`;
            } else {
                output += `${icon} ${labelPadded} : ${contact.value}\n`;
            }
        }

        output += '\n<span style=\'color: #bd5eff; font-style: italic;\'>Open for opportunities. Don\'t hesitate to say hi!</span>';

        return { output, user: '', path: '' };
    }

    private async handleExperienceCommand(): Promise<CommandResponse> {
        const experiences = await this.repository.getExperience();

        if (experiences.length === 0) {
            return { output: 'No experience records found.', user: '', path: '' };
        }

        let output = '<span style=\'color:#00ff00;\'>WAR STORIES FROM THE TRENCHES</span>\n';
        output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

        for (const exp of experiences) {
            output += `<span style='color:#4facfe;'>⚡ ${exp.company}</span>  <span style='color:#888;'>(${exp.duration})</span>\n`;
            output += `   └─ ${exp.description}\n`;
            output += `   <span style='color:#bd5eff;'>⚙ ${exp.tech_stack}</span>\n\n`;
        }

        output += '<span style=\'color:#888; font-style:italic;\'>Still writing new chapters...</span>';

        return { output, user: '', path: '' };
    }

    private handleStackCommand(): CommandResponse {
        let output = 'SYSTEM ARCHITECTURE\n';
        output += '===================\n';
        output += 'Frontend: <span style=\'color:#bd5eff;\'>Svelte 5</span> + Vite\n';
        output += 'Backend:  <span style=\'color:#bd5eff;\'>SvelteKit</span> (TypeScript)\n';
        output += 'Database: <span style=\'color:#bd5eff;\'>Turso</span> (SQLite-compatible)\n';
        output += 'Styling:  <span style=\'color:#bd5eff;\'>CSS3</span> (CRT Effect, Scanlines)\n';

        return { output, user: '', path: '' };
    }

    private handleResumeCommand(): CommandResponse {
        let output = '📄 <b>RESUME</b>\n\n';
        output += 'Click below to download my resume:\n\n';
        output += '<a href=\'/public/LDD - Resume January 2026 V2.pdf\' target=\'_blank\' style=\'color: #4facfe; text-decoration: underline; font-size: 1.1em;\'>📥 Download Resume (PDF)</a>\n\n';
        output += '<span style=\'color:#888;\'>Last updated: February 2026</span>';

        return { output, user: '', path: '' };
    }

    private handleNeofetchCommand(): CommandResponse {
        const output = `
             <span style='color:#00ff00;'>
                .-/+oossssoo+/-.               visitor@dchosen
            \`:+ssssssssssssssssss+:\`           ---------------
          -+ssssssssssssssssssyyssss+-         OS: PortfolioOS v1.0
        .ossssssssssssssssssdMMMNysssso.       Host: Browser
       /ssssssssssshdmmNNmmyNMMMMhssssss/      Kernel: Svelte 5.0
      +ssssssssshmydMMMMMMMNddddyssssssss+     Uptime: Forever
     /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    Packages: 0 (npm), 0 (pip)
    .ssssssssdMMMNhsssssssssshNMMMdssssssss.   Shell: ZSH
    +sssshhhyNMMNyssssssssssssyNMMMysssssss+   CPU: Cloud Compute
    ossyNMMMNyMMhsssssssssssssshmmmhssssssso   GPU: WebGL
    ossyNMMMNyMMhsssssssssssssshmmmhssssssso   Memory: 640KB
    +sssshhhyNMMNyssssssssssssyNMMMysssssss+
    .ssssssssdMMMNhsssssssssshNMMMdssssssss.
     /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/
      +ssssssssshmydMMMMMMMNddddyssssssss+
       /ssssssssssshdmmNNmmyNMMMMhssssss/
        .ossssssssssssssssssdMMMNysssso.
          -+ssssssssssssssssssyyssss+-
            \`:+ssssssssssssssssss+:\`
                .-/+oossssoo+/-.
             </span>
             `;

        return { output, user: '', path: '' };
    }

    private handleSudoCommand(cmd: string): CommandResponse {
        if (cmd.includes('hire')) {
            return {
                output: 'Access Granted. Contact me at: <a href=\'mailto:[EMAIL_ADDRESS]\'>[EMAIL_ADDRESS]</a>',
                user: 'root',
                path: '/dchosen'
            };
        }

        return {
            output: 'visitor is not in the sudoers file. This incident will be reported.',
            user: '',
            path: ''
        };
    }

    private handleRmCommand(): CommandResponse {
        return { output: 'Permission denied: filesystem is read-only.', user: '', path: '' };
    }

    private handleShutdownCommand(): CommandResponse {
        return {
            output: 'System is eternal. You cannot kill what is already dead (or static).',
            user: '',
            path: ''
        };
    }

    private handleUnknownCommand(cmd: string): CommandResponse {
        return { output: `Command not found: ${cmd}`, user: '', path: '' };
    }
}
