from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class LabelCreate(BaseModel):
    name: str
    color: str = "#6366f1"
    task_id: UUID

class LabelResponse(BaseModel):
    id: UUID
    name: str
    color: str
    task_id: UUID
    created_at: datetime

    model_config = {"from_attributes": True}