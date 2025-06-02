import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List, Optional
from db import get_db
from datetime import datetime

router = APIRouter()


# --------------------------------------------
# MODELOS
# --------------------------------------------

class VoteUpdate(BaseModel):
    thread_id: int
    direction: str  # "up" o "down"

class ThreadInDB(BaseModel):
    id: int
    title: str
    content: str
    is_closed: bool
    img_link: Optional[str]
    user_id: int
    date: datetime
    tags: str
    votes: int

# ----------------------------
# GETs
# ----------------------------

@router.get("/threads/count")
async def count_threads(
    search: str = Query(default=None),
    tag: str = Query(default=None),
    db: Session = Depends(get_db)
):
    base_query = 'SELECT COUNT(*) FROM "threads"'
    filters = []
    params = {}

    if search:
        filters.append("unaccent(title) ILIKE unaccent(:search)")
        params["search"] = f"%{search}%"

    if tag:
        filters.append("(',' || REPLACE(tags, ' ', '') || ',') ILIKE '%%,%s,%%'" % tag.lower())
        params["tag"] = tag

    if filters:
        base_query += " WHERE " + " AND ".join(filters)

    result = db.execute(text(base_query), params)
    total = result.scalar()
    return {"total": total}


@router.get("/threads/tags")
async def get_tags(db: Session = Depends(get_db)):
    result = db.execute(text('SELECT "tags" FROM "threads"'))
    all_tags = set()

    for row in result:
        if row[0]:  # si hay algo en tags
            tags = [tag.strip() for tag in row[0].split(",") if tag.strip()]
            all_tags.update(tags)

    return {"tags": sorted(all_tags)}


@router.get("/threads")
async def list_threads(
    limit: int,
    offset: int,
    search: str = Query(default=None),
    tag: str = Query(default=None),
    db: Session = Depends(get_db)
):
    base_query = 'SELECT "id", "title", "is_closed", "user_id", "date", "tags", "votes" FROM "threads"'
    filters = []
    params = {"limit": limit, "offset": offset}

    if search:
        filters.append("unaccent(title) ILIKE unaccent(:search)")
        params["search"] = f"%{search}%"

    if tag:
        filters.append("(',' || REPLACE(tags, ' ', '') || ',') ILIKE '%%,%s,%%'" % tag.lower())
        params["tag"] = tag

    if filters:
        base_query += " WHERE " + " AND ".join(filters)

    base_query += " ORDER BY votes DESC LIMIT :limit OFFSET :offset"

    result = db.execute(text(base_query), params)

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

@router.get("/threads/user/{user_id}")
async def get_threads(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('''SELECT "id", "title", "content", "is_closed", "img_link", "user_id", "date", "tags", "votes"
             FROM "threads" WHERE "user_id" = :user_id
             ORDER BY "date" DESC'''),
        {"user_id": user_id}
    )
    threads = [
        {
            "id": row[0],
            "title": row[1],
            "content": row[2],
            "is_closed": row[3],
            "img_link": row[4],
            "user_id": row[5],
            "date": row[6],
            "tags": row[7],
            "votes": row[8],
            } for row in result
    ]
    return threads

@router.get("/threads/by_ids")
async def get_threads_by_ids(thread_ids: List[int] = Query(...), db: Session = Depends(get_db)):
    if not thread_ids:
        return []
    placeholders = ", ".join([":id" + str(i) for i in range(len(thread_ids))])
    sql = f'''
        SELECT "id", "title", "content", "is_closed", "img_link", "user_id", "date", "tags", "votes"
        FROM "threads"
        WHERE "id" IN ({placeholders})
        ORDER BY "votes" DESC
    '''
    params = {f"id{i}": tid for i, tid in enumerate(thread_ids)}
    result = db.execute(text(sql), params)
    threads = [
        {
            "id": row[0],
            "title": row[1],
            "content": row[2],
            "is_closed": row[3],
            "img_link": row[4],
            "user_id": row[5],
            "date": row[6],
            "tags": row[7],
            "votes": row[8],
        }
        for row in result
    ]
    return threads

@router.get("/threads/{thread_id}")
async def get_threads(thread_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT "id", "title", "content", "is_closed", "img_link", "user_id", "date", "tags", "votes" FROM "threads" WHERE "id" = :id'),
        {"id": thread_id}
    )
    thread = [{"id": row[0], "title": row[1], "content": row[2], "is_closed": row[3], "img_link": row[4], "user_id": row[5], "date": row[6], "tags": row[7], "votes": row[8]} for row in result]
    return thread

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
