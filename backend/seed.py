"""
Seed script to populate the database with initial data.
Run this from the backend directory: python seed.py
"""
from app.database import create_db_and_tables, get_session
from app.models import Project, Skill, Contact, ContactType, Experience


def seed_data():
    create_db_and_tables()

    # implement deletion before repopulation
    with get_session() as session:
        session.query(Project).delete()
        session.query(Skill).delete()
        session.query(Contact).delete()
        session.query(Experience).delete()
        session.commit()

    with get_session() as session:
        # --- Projects ---
        projects = [
            Project(
                name="PEMI ClientEase",
                description="Client-facing system made for registration of investor accounts and KYC",
                tags="Angular, .NET Web API, PostgreSQL, AWS LightSail",
                url=None
            ),
            Project(
                name="Terminal Portfolio",
                description="A retro terminal-style portfolio website",
                tags="Svelte, FastAPI, SQLite, Python",
                url=None
            ),
            Project(
                name="Macro Recorder",
                description="A macro recorder for Windows",
                tags="Python, Customtkinter",
                url=None
            ),
        ]
        for p in projects:
            session.add(p)

        # --- Skills ---
        skills = [
            Skill(name="Python", proficiency=70),
            Skill(name="C# / .NET", proficiency=90),
            Skill(name="JavaScript", proficiency=90),
            Skill(name="SQL Server", proficiency=90),
            Skill(name="PostgreSQL", proficiency=80),
            Skill(name="FastAPI", proficiency=70),
            Skill(name="Svelte", proficiency=70),
            Skill(name="Git", proficiency=90),
            Skill(name="REST APIs", proficiency=90),
            Skill(name="Angular", proficiency=70),
            Skill(name="jQuery", proficiency=90),
            Skill(name="HTML/CSS", proficiency=90),
            Skill(name="Alpine.js", proficiency=90),
            Skill(name="PHP", proficiency=90)
        ]
        for s in skills:
            session.add(s)

        # --- Contacts ---
        contacts = [
            Contact(
                type=ContactType.gmail,
                value="lowiedave30@gmail.com",
                url="mailto:lowiedave30@gmail.com"
            ),
            Contact(
                type=ContactType.github,
                value="GitHub",
                url="https://github.com/dchosendave"
            ),
            Contact(
                type=ContactType.linkedin,
                value="LinkedIn",
                url="https://linkedin.com/in/davedichoson"
            ),
            Contact(
                type=ContactType.viber,
                value="Viber",
                url="+639150833518"
            ),
            Contact(
                type=ContactType.whatsapp,
                value="WhatsApp",
                url="+639150833518"
            )
        ]
        for c in contacts:
            session.add(c)

        # --- Experience ---
        experiences = [
            Experience(
                company="VANTAGE FINANCIAL CORP.",
                duration="2023 - Present",
                description="Backend Developer building scalable APIs and microservices",
                tech_stack=".NET Core, SQL Server, Azure, REST APIs"
            ),
            Experience(
                company="EASTWEST BANKING CORP.",
                duration="March 2023 - July 2023",
                description="Software QA Intern who conducted manual testings, reportings, and defect tracking",
                tech_stack=""
            )
        ]
        for e in experiences:
            session.add(e)

        session.commit()
        print("✅ Database seeded successfully!")


if __name__ == "__main__":
    seed_data()
