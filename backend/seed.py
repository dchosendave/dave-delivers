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
                name="Report Generator System",
                description="Implemented user access management and role-based access control (RBAC), password recovery and enforcement, and dynamic role-driven navigation",
                tags="HTML/CSS, jQuery, ASP.NET Web Forms, MS SQL Server, IIS Manager",
                url="Company Internal System"
            ),
            Project(
                name="PEMI Website",
                description="Maintained and supported the website by delivering over 20+ production deployments",
                tags="HTML/CSS, JavaScript, PHP, MySQL, Linux",
                url="http://www.philequity.net"
            ),
            Project(
                name="Letter-of-Intent Generator",
                description="Developed a web-based tool that automates the generation of letters of intent for investment transactions and integrated it into an external legacy Oracle Database",
                tags="Alpine.js, ASP.NET MVC, Oracle Database, IIS Manager",
                url="Company Internal System"
            ),
            Project(
                name="Apple-themed Portfolio",
                description="A modern minimalist portfolio inspired by Apple's UI/UX design",
                tags="Svelte, FastAPI, SQLite, Python",
                url=None
            ),
            Project(
                name="Terminal Portfolio",
                description="A retro terminal-style personal portfolio website",
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
                value="+639150833518",
                url=""
            ),
            Contact(
                type=ContactType.whatsapp,
                value="+639150833518",
                url=""
            )
        ]
        for c in contacts:
            session.add(c)

        # --- Experience ---
        experiences = [
            Experience(
                company="VANTAGE FINANCIAL CORP.",
                duration="2023 - Present",
                description="Backend Developer building scalable APIs and microservices, and maintaining legacy systems.",
                tech_stack=".NET Core, .NET Framework, VB.NET, SQL Server / MySQL / Oracle SQL / PostgreSQL, AWS EC2/RDS/S3, Git"
            ),
            Experience(
                company="EASTWEST BANKING CORP.",
                duration="March 2023 - July 2023",
                description="Software QA Intern who performed manual & automated testing on different Automatic Teller Machines.",
                tech_stack="Manual/Automated Testing, Defect Tracking, Reporting, Banking Domain, Agile/Scrum"
            ),
            Experience(
                company="UNIVERSITY OF MAKATI",
                duration="Sept 2022 - August 2023",
                description="Wrote a thesis about the comparison in performance of pathfinding algorithms in a grid-based environment. Integrated it into a 2D educational game.",
                tech_stack="Unity, C#, Pathfinding Algorithms, Sprites, UI Design, Adobe Photoshop/Premiere Pro"
            ),
            Experience(
                company="UNIVERSITY OF MAKATI",
                duration="Sept 2021 - May 2022",
                description="Developed a web-based voting system for the student council.",
                tech_stack="HTML/CSS, C#, ASP.NET Web Forms, MySQL"
            ),
            Experience(
                company="UNIVERSITY OF MAKATI",
                duration="Sept 2020 - May 2021",
                description="Developed a mobile-based appointment system for a pet clinic.",
                tech_stack="Android Studio, Java, XML UI, Firebase"
            ),
            Experience(
                company="UNIVERSITY OF MAKATI",
                duration="2019",
                description="Debugged my first program. It was a mess.",
                tech_stack="Java, jGrasp"
            )
        ]
        for e in experiences:
            session.add(e)

        session.commit()
        print("✅ Database seeded successfully!")


if __name__ == "__main__":
    seed_data()
