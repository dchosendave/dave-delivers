from sqlmodel import select
from ..models import Project, Skill, Contact, Experience
from ..database import get_session

class DeveloperInformationRepository:
    def get_projects(self):
        with get_session() as session:
            return session.exec(select(Project)).all()
    
    def get_skills(self):
        with get_session() as session:
            return session.exec(select(Skill).order_by(Skill.proficiency.desc())).all()
    
    def get_contacts(self):
        with get_session() as session:
            return session.exec(select(Contact).order_by(Contact.type.asc())).all()
    
    def get_experience(self):
        with get_session() as session:
            return session.exec(select(Experience)).all()