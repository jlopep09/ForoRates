from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from sqlalchemy import text
from typing import List
from db import get_db
from datetime import datetime

router = APIRouter()

# ----------------------------
# MODELOS
# ----------------------------

#Lo que se espera recibir en el cuerpo del POST
class NewThread(BaseModel):
    title: str
    content: str
    is_closed: bool = False #Valor por defecto
    img_link: str = None
    user_id: int #Seguramente se quite
    date: datetime
    tags: str
    votes: int = 0 #Al momento de crear el hilo vale cero

#Lo que se le devuelve al cliente cuando el hilo se crea correctamente
class ThreadResponse(BaseModel):
    id: int
    title: str
    content: str
    is_closed: bool
    img_link: str = None
    user_id: int
    date: datetime
    tags: str
    votes: int


@router.post("/newThread/", response_model=ThreadResponse, status_code=status.HTTP_201_CREATED)
def create_new_thread(
    threadToCreate: NewThread,
    db: Session = Depends(get_db)
):
    #Comprobar que el nombre del thread no exista
    existing = db.execute(
        text('SELECT COUNT(1) FROM "threads" WHERE "title" = :title'),
        {"title": threadToCreate.title}
    ).scalar_one()

    if existing > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un hilo con ese título."
        )

    #Preparar los datos para insetar
    insert_stmt = text("""
        INSERT INTO "threads" ("title", "content", "is_closed", "img_link", "user_id", "date", "tags", "votes")
        VALUES (:title, :content, :is_closed, :img_link, :user_id, :date, :tags, :votes)
        RETURNING "id", "title", "content", "is_closed", "img_link", "user_id", "date", "tags", "votes"
    """)


    result = db.execute(
        insert_stmt,
        {
            "title": threadToCreate.title,
            "content": threadToCreate.content,
            "is_closed": threadToCreate.is_closed,
            "img_link": threadToCreate.img_link,
            "user_id": threadToCreate.user_id,
            "date": threadToCreate.date,
            "tags": threadToCreate.tags,
            "votes": threadToCreate.votes
        }
    )

    #Obtener la fila insertada(el returning)
    row = result.fetchone()
    db.commit()  #Confirmar la operación

    return ThreadResponse(
        id=row[0],
        title=row[1],
        content=row[2],
        is_closed=row[3],
        img_link=row[4],
        user_id=row[5],
        date=row[6],
        tags=row[7],
        votes=row[8]
    )
