from datetime import datetime
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

# --- Request/Response Models for Terminal ---
class CommandRequest(BaseModel):
    command: str


class CommandResponse(BaseModel):
    output: str
    user: str
    path: str


# --- Enum for Contact Types ---
class ContactType(str, Enum):
    gmail = "gmail"
    github = "github"
    linkedin = "linkedin"
    viber = "viber"
    whatsapp = "whatsapp"


# --- Database Models (SQLModel) ---
class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    tags: str  # Comma-separated tags
    url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Skill(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    proficiency: int  # 0-100 percentage
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Contact(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: ContactType
    value: str
    url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Experience(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company: str
    duration: str  # e.g., "2023 - Present"
    description: str
    tech_stack: str  # Comma-separated technologies
    created_at: datetime = Field(default_factory=datetime.utcnow)

