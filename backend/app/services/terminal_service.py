from ..repositories.developer_repository import DeveloperInformationRepository
from ..models import CommandResponse

class TerminalService:
    def __init__(self):
        self.repository = DeveloperInformationRepository()
    
    def process_command(self, command_text: str) -> CommandResponse:
        command_text = command_text.lower().strip()

        if command_text == "help":
            out = "Available commands:\n"
            out += "- help: you're looking at it, genius\n"
            out += "- about: who's behind this terminal?\n"
            out += "- experience: war stories from back in the day\n"
            out += "- projects: stuff i've shipped\n"
            out += "- skills: my tech arsenal and loadout\n"
            out += "- contacts: slide into my DMs\n"
            out += "- stack: how i built this thing\n"
            out += "- resume: the formal stuff adults like (PDF)\n"
            out += "- clear: wipe the slate clean\n"
            return CommandResponse(output=out, user="", path="")
            
        elif command_text == "about":
            out = "ABOUT ME\n"
            out += "========\n\n"
            out += "Hi, I'm <span style='color:#4facfe;font-weight:bold;'>Dave Dichoson</span>.\n\n"
            out += "I'm a <span style='color:#bd5eff;'>Backend Developer</span> with experience building\n"
            out += "scalable APIs, database systems, and maintaining enterprise applications.\n\n"
            out += "My core stack includes:\n"
            out += "  • .NET Core / C#\n"
            out += "  • JavaScript / TypeScript\n"
            out += "  • SQL Server / PostgreSQL / Oracle SQL / MySQL\n\n"
            out += "but for this specific project, I used: Svelte, Python, FastAPI, and Sqlite.\n"
            out += "I'm passionate about clean code, system design, automation, and AI.\n"
            out += "Type <span style='color:#00ff00;'>contacts</span> to get in touch!"
            return CommandResponse(output=out, user="", path="")

        elif command_text == "projects":
            projects = self.repository.get_projects()
            if not projects:
                out = "No projects found."
            else:
                out = "<span style='color:#00ff00;'>STUFF I'VE SHIPPED</span>\n"
                out += "━━━━━━━━━━━━━━━━━━━━\n\n"
                for p in projects:
                    out += f"<span style='color:#4facfe;'>▸ {p.name}</span>\n"
                    out += f"  {p.description}\n"
                    out += f"  <span style='color:#888;'>[ {p.tags} ]</span>\n\n"
                out += "<span style='color:#bd5eff; font-style:italic;'>Type a project name to dive deeper... (coming soon)</span>"
            return CommandResponse(output=out, user="", path="")

        elif command_text == "skills":
            skills = self.repository.get_skills()
            if not skills:
                return CommandResponse(output="Lowie is cooked. Damn.", user="", path="")
            else:
                out = "TECHNICAL SKILLS\n"
                out += "===================\n\n"
                max_len = max(len(s.name) for s in skills) + 2
                for s in skills:
                    # 100% = 20 blocks
                    bar_len = int(s.proficiency / 5)
                    bar = "█" * bar_len
                    empty = "░" * (20 - bar_len)
                    name_padded = s.name.ljust(max_len)
                    out += f"{name_padded} [{bar}{empty}] {s.proficiency}%\n"
            return CommandResponse(output=out, user="", path="")

        elif command_text == "contacts":
            contacts = self.repository.get_contacts()
            if not contacts:
                return CommandResponse(output="No contacts found.", user="", path="")
            
            out = "CONTACT CHANNELS\n"
            out += "----------------\n"
            
            icons = {
                "gmail": "📧",
                "github": "🐙",
                "linkedin": "💼",
                "viber": "📱",
                "whatsapp": "💬"
            }
            
            for c in contacts:
                icon = icons.get(c.type.value, "📞")
                label = c.type.value.capitalize().ljust(10)
                
                if c.url:
                    link_html = f"<a href='{c.url}' target='_blank' style='color: #4facfe; text-decoration: underline; cursor: pointer;'>{c.value}</a>"
                    out += f"{icon} {label} : {link_html}\n"
                else:
                    out += f"{icon} {label} : {c.value}\n"
            
            out += "\n<span style='color: #bd5eff; font-style: italic;'>Open for opportunities. Don't hesitate to say hi!</span>"
            return CommandResponse(output=out, user="", path="")

        elif command_text == "experience":
            experiences = self.repository.get_experience()
            if not experiences:
                return CommandResponse(output="No experience records found.", user="", path="")
                
            out = "<span style='color:#00ff00;'>WAR STORIES FROM THE TRENCHES</span>\n"
            out += "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            for exp in experiences:
                out += f"<span style='color:#4facfe;'>⚡ {exp.company}</span>  <span style='color:#888;'>({exp.duration})</span>\n"
                out += f"   └─ {exp.description}\n"
                out += f"   <span style='color:#bd5eff;'>⚙ {exp.tech_stack}</span>\n\n"
            out += "<span style='color:#888; font-style:italic;'>Still writing new chapters...</span>"
            return CommandResponse(output=out, user="", path="")
            
        elif command_text == "resume":
            out = "📄 <b>RESUME</b>\n\n"
            out += "Click below to download my resume:\n\n"
            out += "<a href='/public/LDD - Resume January 2026 V2.pdf' target='_blank' style='color: #4facfe; text-decoration: underline; font-size: 1.1em;'>📥 Download Resume (PDF)</a>\n\n"
            out += "<span style='color:#888;'>Last updated: February 2026</span>"
            return CommandResponse(output=out, user="", path="")
            
        elif command_text == "stack":
            out = "SYSTEM ARCHITECTURE\n"
            out += "===================\n"
            out += "Frontend: <span style='color:#bd5eff;'>Svelte 5</span> + Vite\n"
            out += "Backend:  <span style='color:#bd5eff;'>FastAPI</span> (Python 3.12)\n"
            out += "Database: <span style='color:#bd5eff;'>SQLite</span> (via SQLModel)\n"
            out += "Styling:  <span style='color:#bd5eff;'>CSS3</span> (CRT Effect, Scanlines)\n"
            return CommandResponse(output=out, user="", path="")

        elif command_text == "neofetch":
             out = """
             <span style='color:#00ff00;'>
                .-/+oossssoo+/-.               visitor@dchosen
            `:+ssssssssssssssssss+:`           ---------------
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
            `:+ssssssssssssssssss+:`
                .-/+oossssoo+/-.
             </span>
             """
             return CommandResponse(output=out, user="", path="")

        elif command_text.startswith("sudo"):
            if "hire" in command_text:
                return CommandResponse(output="Access Granted. Contact me at: <a href='mailto:[EMAIL_ADDRESS]'>[EMAIL_ADDRESS]</a>", user="root", path="/dchosen")
            else:
                return CommandResponse(output="visitor is not in the sudoers file. This incident will be reported.", user="", path="")
                
        elif command_text.startswith("rm"):
            return CommandResponse(output="Permission denied: filesystem is read-only.", user="", path="")
            
        elif command_text == "shutdown":
             return CommandResponse(output="System is eternal. You cannot kill what is already dead (or static).", user="", path="")

        else:
            return CommandResponse(output=f'Command not found {command_text}', user="", path="")
