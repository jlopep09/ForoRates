from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from db import get_db

router = APIRouter()

@router.get("/threads/{user_id}")
async def get_threads(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT "id", "title", "content", "img_link" FROM "threads" WHERE "user_id" = :user_id'),
        {"user_id": user_id}
    )
    threads = [{"id": row[0], "title": row[1], "content": row[2], "img_link": row[3]} for row in result]
    return threads
