from fastapi import APIRouter, Depends, status, HTTPException
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

@router.get("/benefits/{user_id}", response_model=List[Benefits])
def get_benefits_by_userid(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text("""
            SELECT id, name, price, start_date, end_date, user_id
            FROM benefits
            WHERE user_id = :user_id
        """),
        {"user_id": user_id}
    )
    benefits = result.mappings().all()
    return benefits


@router.post("/benefits/", status_code=status.HTTP_201_CREATED)
def create_notification(
    user_id: int,
    benefit: Benefits,
    db: Session = Depends(get_db)
):
    # 1) Obtener los puntos actuales del usuario
    user_row = db.execute(
        text("SELECT score FROM users WHERE id = :user_id"),
        {"user_id": user_id}
    ).mappings().fetchone()

    if not user_row:
        # Si el usuario no existe
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    current_points = user_row["score"]

    # 2) Verificar que tenga puntos suficientes
    if current_points < benefit.price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No tienes puntos suficientes para esta compra"
        )

    # A partir de aquí, sabemos que sí tiene puntos. Disparamos una transacción:
    try:
        # 3) Restar los puntos al usuario
        db.execute(
            text("""
                UPDATE users
                SET score = score - :price
                WHERE id = :user_id
            """),
            {"price": benefit.price, "user_id": user_id}
        )

        # 4) Comprobar si existe ya el beneficio (misma lógica de upsert que antes)
        existing = db.execute(
            text("""
                SELECT id FROM benefits
                WHERE name = :name AND user_id = :user_id
            """),
            {"name": benefit.name, "user_id": user_id}
        ).fetchone()

        if existing:
            # Si existe, actualizo price, start_date y end_date
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
            msg_text = "Beneficio actualizado y puntos descontados."
        else:
            # Si no existe, lo inserto
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
            msg_text = "Beneficio registrado y puntos descontados."

        # 5) Hacer commit de toda la transacción (descuento + insert/update)
        db.commit()

    except Exception as e:
        # Si algo falla, hacemos rollback y devolvemos 500
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocurrió un error al procesar la compra"
        )

    return {"msg": msg_text}
