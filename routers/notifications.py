# routers/notifications.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text
from typing import List
from db import get_db

router = APIRouter()

class Notification(BaseModel):
    title: str
    content: str
    id_thread: int
    read: bool = False

class NotificationOut(Notification):
    id: int

@router.get("/notifications/{user_id}", response_model=List[NotificationOut])
def get_notifications(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT id, title, content, id_thread, seen AS read FROM notifications WHERE id_user = :user_id"),
        {"user_id": user_id}
    )
    notifications = result.mappings().all()
    return notifications

@router.post("/notifications/", status_code=status.HTTP_201_CREATED)
def create_notification(user_id: int, notif: Notification, db: Session = Depends(get_db)):
    db.execute(
        text("""
            INSERT INTO notifications (id_user, title, content, id_thread, seen)
            VALUES (:user_id, :title, :content, :id_thread, :read)
        """),
        {
            "user_id": user_id,
            "title": notif.title,
            "content": notif.content,
            "id_thread": notif.id_thread,
            "read": notif.read 
        }
    )
    db.commit()
    return {"msg": "Notificación creada"}

@router.put("/notifications/mark_all_read/{user_id}")
def mark_all_read(user_id: int, db: Session = Depends(get_db)):
    db.execute(
        text("UPDATE notifications SET seen = true WHERE id_user = :user_id"),
        {"user_id": user_id}
    )
    db.commit()
    return {"msg": "Todas las notificaciones marcadas como leídas"}

@router.delete("/notifications/delete_all/{user_id}")
def delete_all_notifications(user_id: int, db: Session = Depends(get_db)):
    db.execute(
        text("DELETE FROM notifications WHERE id_user = :user_id"),
        {"user_id": user_id}
    )
    db.commit()
    return {"msg": "Todas las notificaciones eliminadas"}
