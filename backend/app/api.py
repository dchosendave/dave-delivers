from fastapi import APIRouter
from .services import CommandProcessor
from .models import CommandRequest, CommandResponse

router = APIRouter()
processor = CommandProcessor()


@router.post("/execute", response_model=CommandResponse)
def execute_command(request: CommandRequest):
    """Terminal command execution endpoint"""
    return processor.process_command(request.command)
