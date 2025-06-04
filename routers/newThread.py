from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text
from db import get_db
from datetime import datetime

router = APIRouter()

# ----------------------------
# MODELOS
# ----------------------------

class NewThread(BaseModel):
    title: str
    content: str
    is_closed: bool = False  # Valor por defecto
    img_link: str = None
    user_id: int            # El usuario que crea el hilo
    tags: str
    votes: int = 0          # Al crear el hilo, los votos empiezan en cero
    # OBSERVACIÓN: ya no hay campo "date" aquí;
    # la fecha la pondrá la BBDD con su DEFAULT.

class ThreadResponse(BaseModel):
    id: int
    title: str
    content: str
    is_closed: bool
    img_link: str = None
    user_id: int
    date: datetime          # Devolvemos la fecha que puso la BBDD
    tags: str
    votes: int


@router.post(
    "/newThread/",
    response_model=ThreadResponse,
    status_code=status.HTTP_201_CREATED
)
def create_new_thread(
    threadToCreate: NewThread,
    db: Session = Depends(get_db)
):
    # 1) Comprobar que no exista otro hilo con el mismo título
    existing = db.execute(
        text('SELECT COUNT(1) FROM "threads" WHERE "title" = :title'),
        {"title": threadToCreate.title}
    ).scalar_one()
    if existing > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un hilo con ese título."
        )

    # 2) Insertar sin indicar la columna `date` (usa su DEFAULT en la BBDD)
    insert_stmt = text("""
        INSERT INTO "threads"
          ("title", "content", "is_closed", "img_link", "user_id", "tags", "votes")
        VALUES
          (:title, :content, :is_closed, :img_link, :user_id, :tags, :votes)
        RETURNING
          "id", "title", "content", "is_closed", "img_link", "user_id", "date", "tags", "votes"
    """)

    result = db.execute(
        insert_stmt,
        {
            "title": threadToCreate.title,
            "content": threadToCreate.content,
            "is_closed": threadToCreate.is_closed,
            "img_link": threadToCreate.img_link,
            "user_id": threadToCreate.user_id,
            "tags": threadToCreate.tags,
            "votes": threadToCreate.votes
        }
    )

    # 3) Obtenemos la fila recién insertada (incluye el DEFAULT date)
    row = result.fetchone()
    db.commit()

    return ThreadResponse(
        id=row[0],
        title=row[1],
        content=row[2],
        is_closed=row[3],
        img_link=row[4],
        user_id=row[5],
        date=row[6],   # Aquí viene el TIMESTAMP que puso la BBDD
        tags=row[7],
        votes=row[8]
    )
