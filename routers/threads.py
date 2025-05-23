from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db

router = APIRouter()

class VoteUpdate(BaseModel):
    thread_id: int
    direction: str  # "up" o "down"

@router.get("/threads/{user_id}")
async def get_threads(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT "id", "title", "content", "img_link" FROM "threads" WHERE "user_id" = :user_id'),
        {"user_id": user_id}
    )
    threads = [{"id": row[0], "title": row[1], "content": row[2], "img_link": row[3]} for row in result]
    return threads

@router.get("/threads")
async def list_threads(limit: int, offset: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT "id", "title", "is_closed", "user_id", "date", "tags", "votes" FROM "threads" LIMIT :limit OFFSET :offset'),
        {"limit": limit, "offset": offset}
    )
    threads = [{
        "id": row[0],
        "title": row[1],
        "is_closed": row[2],
        "user_id": row[3],
        "date": row[4],
        "tags": row[5],
        "votes": row[6]
    } for row in result]
    return threads

@router.post("/threads/updateLike")
async def update_like(vote: VoteUpdate, db: Session = Depends(get_db)):
    if vote.direction not in ("up", "down"):
        raise HTTPException(status_code=400, detail="Dirección inválida")

    update_query = text("""
        UPDATE threads
        SET votes = votes + :delta
        WHERE id = :thread_id
        RETURNING votes
    """)
    result = db.execute(update_query, {
        "delta": 1 if vote.direction == "up" else -1,
        "thread_id": vote.thread_id
    })

    updated = result.fetchone()
    if updated is None:
        raise HTTPException(status_code=404, detail="Post no encontrado")

    db.commit()
    return {"votes": updated[0]}