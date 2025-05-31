# routers/notifications.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text
from typing import List
from db import get_db
from datetime import datetime

router = APIRouter()

class Benefits(BaseModel):
    name: str
    price: int
    start_date: datetime
    end_date: datetime
    user_id: int

@router.get("/benefits/{user_id}", response_model=List[Benefits])
def get_benefits_by_userid(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT id, name, price, start_date, end_date, user_id FROM benefits WHERE user_id = :user_id"),
        {"user_id": user_id}
    )

    benefits = result.mappings().all()
    return benefits

@router.post("/benefits/", status_code=status.HTTP_201_CREATED)
def create_notification(user_id: int, benefit: Benefits, db: Session = Depends(get_db)):
    # Verificar si ya existe un beneficio con ese nombre y user_id
    result = db.execute(
        text("""
            SELECT id FROM benefits
            WHERE name = :name AND user_id = :user_id
        """),
        {"name": benefit.name, "user_id": user_id}
    )
    existing = result.fetchone()

    if existing:
        # Si existe, actualizamos el beneficio
        db.execute(
            text("""
                UPDATE benefits
                SET price = :price,
                    start_date = :start_date,
                    end_date = :end_date
                WHERE name = :name AND user_id = :user_id
            """),
            {
                "price": benefit.price,
                "start_date": benefit.start_date,
                "end_date": benefit.end_date,
                "name": benefit.name,
                "user_id": user_id
            }
        )
        msg = "Beneficio actualizado."
    else:
        # Si no existe, lo insertamos
        db.execute(
            text("""
                INSERT INTO benefits (name, price, start_date, end_date, user_id)
                VALUES (:name, :price, :start_date, :end_date, :user_id)
            """),
            {
                "name": benefit.name,
                "price": benefit.price,
                "start_date": benefit.start_date,
                "end_date": benefit.end_date,
                "user_id": user_id 
            }
        )
        msg = "Beneficio registrado."

    db.commit()
    return {"msg": msg}
