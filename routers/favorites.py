from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db import get_db

router = APIRouter()

class FavoritoToggle(BaseModel):
    thread_id: int
    user_id: int

@router.post("/favorites/toggle")
async def toggle_favorito(data: FavoritoToggle, db: Session = Depends(get_db)):
    params = {"user_id": data.user_id, "thread_id": data.thread_id}
    result = db.execute(
        text('SELECT id FROM "favorites" WHERE "user_id" = :user_id AND "thread_id" = :thread_id'),
        params
    )
    existing = result.fetchone()

    if existing:
        db.execute(
            text('DELETE FROM "favorites" WHERE "id" = :id'),
            {"id": existing[0]}
        )
        db.commit()
        return {"message": "Hilo eliminado de favoritos", "favorito": False}
    else:
        db.execute(
            text('INSERT INTO "favorites" ("thread_id", "user_id") VALUES (:thread_id, :user_id)'),
            params
        )
        db.commit()
        return {"message": "Hilo añadido a favoritos", "favorito": True}

@router.get("/favorites/{user_id}/{thread_id}")
async def is_favorito(user_id: int, thread_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT 1 FROM "favorites" WHERE "user_id" = :user_id AND "thread_id" = :thread_id'),
        {"user_id": user_id, "thread_id": thread_id}
    )
    is_fav = result.fetchone() is not None
    return {"favorito": is_fav}


@router.get("/favorites/{user_id}")
async def get_favoritos(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT "thread_id" FROM "favorites" WHERE "user_id" = :user_id'),
        {"user_id": user_id}
    )
    thread_ids = [row[0] for row in result]
    return {"thread_ids": thread_ids}