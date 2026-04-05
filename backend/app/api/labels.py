from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.label import TaskLabel
from app.models.task import Task
from app.schemas.label import LabelCreate, LabelResponse

router = APIRouter(prefix="/labels", tags=["labels"])

@router.post("/", response_model=LabelResponse, status_code=201)
def create_label(
    data: LabelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == data.task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarefa não encontrada")

    label = TaskLabel(**data.model_dump(), user_id=current_user.id)
    db.add(label)
    db.commit()
    db.refresh(label)
    return label

@router.delete("/{label_id}", status_code=204)
def delete_label(
    label_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    label = db.query(TaskLabel).filter(
        TaskLabel.id == label_id,
        TaskLabel.user_id == current_user.id
    ).first()
    if not label:
        raise HTTPException(status_code=404, detail="Label não encontrada")
    db.delete(label)
    db.commit()