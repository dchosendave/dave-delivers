from fastapi import APIRouter
from typing import List
from .services.terminal_service import TerminalService
from .repositories.developer_repository import DeveloperInformationRepository
from .models import CommandRequest, CommandResponse, Project, Skill, Contact, Experience

router = APIRouter()
terminal_service = TerminalService()
repository = DeveloperInformationRepository()


@router.post("/execute", response_model=CommandResponse)
def execute_command(request: CommandRequest):
    """Terminal command execution endpoint"""
    return terminal_service.process_command(request.command)


@router.get("/projects", response_model=List[Project])
def get_projects():
    """Get all projects as raw JSON"""
    return repository.get_projects()


@router.get("/skills", response_model=List[Skill])
def get_skills():
    """Get all skills as raw JSON"""
    return repository.get_skills()


@router.get("/contacts", response_model=List[Contact])
def get_contacts():
    """Get all contacts as raw JSON"""
    return repository.get_contacts()


@router.get("/experiences", response_model=List[Experience])
def get_experiences():
    """Get all experience records as raw JSON"""
    return repository.get_experience()

