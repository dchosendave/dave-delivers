from sqlmodel import select
from .models import CommandResponse, Project, Skill, Contact, ContactType, Experience
from .database import get_session

class CommandProcessor:
    def process_command(self, command_text: str) -> CommandResponse:
        # sanitize the input
        command_text = command_text.lower().strip()

        if (command_text == "help"):
            out = "Available commands:\n"
            out += "- help: Show this message\n"
            out += "- about: Show information about me\n"
            out += "- experience: Show my work experience\n"
            out += "- projects: Show my projects\n"
            out += "- skills: Show my skills\n"
            out += "- contacts: Show my contact information\n"
            out += "- resume: Show my resume\n"
            out += "- clear: Clear the terminal\n"
            out += "- exit: Exit the terminal\n"
            return CommandResponse(output=out, user="", path="")
        elif command_text == "about":
            out = "ABOUT ME\n"
            out += "========\n\n"
            out += "Hi, I'm <span style='color:#4facfe;font-weight:bold;'>Dave Dichoson</span>.\n\n"
            out += "I'm a <span style='color:#bd5eff;'>Backend Developer</span> with experience building\n"
            out += "scalable APIs, database systems, and enterprise applications.\n\n"
            out += "My core stack includes:\n"
            out += "  • .NET Core / C#\n"
            out += "  • JavaScript\n"
            out += "  • SQL Server / PostgreSQL\n\n"
            out += "but for these specific project, I used: Svelte, Python, FastAPI, and Sqlite.\n"
            out += "I'm passionate about clean code, system design, and automation.\n"
            out += "Type <span style='color:#00ff00;'>contacts</span> to get in touch!"
            
            return CommandResponse(output=out, user="", path="")
        elif command_text == "projects":
            with get_session() as session:
                projects = session.exec(select(Project)).all()
                if not projects:
                    out = "No projects found."
                else:
                    # Simple text formatting for now, we can make it HTML later
                    out = "AVAILABLE PROJECTS:\n"
                    out += "-------------------\n"
                    for p in projects:
                        out += f"* {p.name}: {p.description} [{p.tags}]\n"
            
            return CommandResponse(output=out, user="", path="")
        elif command_text == "skills":
            with get_session() as session:
                skills = session.exec(select(Skill).order_by(Skill.proficiency.desc())).all()
                if not skills:
                    return CommandResponse(output="Lowie is cooked. Damn.", user="", path="")
                else:
                    out = "TECHNICAL SKILLS\n"
                    out += "===================\n\n"

                    max_len = max(len(s.name) for s in skills) + 2

                    for s in skills:
                        # 100% = 20 blocks
                        bar_len = int(s.proficiency /5)
                        bar = "█" * bar_len
                        empty = "░" * (20 - bar_len)

                        name_padded = s.name.ljust(max_len)
                        out += f"{name_padded} [{bar}{empty}] {s.proficiency}%\n"

            return CommandResponse(output=out, user="", path="")
        elif command_text == "contacts":
            with get_session() as session:
                contacts = session.exec(select(Contact).order_by(Contact.type.asc())).all()
                if not contacts:
                    return CommandResponse(output="No contacts found.", user="", path="")
                else:
                    out = "CONTACT CHANNELS\n"
                out += "----------------\n"
                
                # Map enums to Emojis for visual flair
                icons = {
                    "gmail": "📧",
                    "github": "🐙",
                    "linkedin": "💼",
                    "viber": "📱",
                    "whatsapp": "💬"
                }
                for c in contacts:
                    # Get icon or default to phone
                    icon = icons.get(c.type.value, "📞")
                    
                    # Align the labels (e.g., "Github    :")
                    label = c.type.value.capitalize().ljust(10)
                    
                    # The Magic: Inject HTML <a> tags
                    if c.url:
                        # We force the color to inherit or pop, and open in new tab
                        link_html = f"<a href='{c.url}' target='_blank' style='color: #4facfe; text-decoration: underline; cursor: pointer;'>{c.value}</a>"
                        out += f"{icon} {label} : {link_html}\n"
                    else:
                        out += f"{icon} {label} : {c.value}\n"
                # Add a stylized CTA footer
                out += "\n<span style='color: #bd5eff; font-style: italic;'>Open for opportunities. Don't hesitate to say hi!</span>"
                
            return CommandResponse(output=out, user="", path="")
        elif command_text == "experience":
            with get_session() as session:
                experiences = session.exec(select(Experience)).all()
                
                if not experiences:
                    return CommandResponse(output="No experience records found.", user="", path="")
                out = "WORK EXPERIENCE\n"
                out += "===============\n\n"
                
                for exp in experiences:
                    out += f"📅 <span style='color:#4facfe;'>{exp.duration}</span> | <b>{exp.company}</b>\n"
                    out += f"   > {exp.description}\n"
                    out += f"   <span style='color:#888;'>[ {exp.tech_stack} ]</span>\n\n"
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

        # --- EASTER EGGS ---
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