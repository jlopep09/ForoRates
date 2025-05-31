from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from pydantic import BaseModel
from db import get_db

router = APIRouter()


"""
------------------------------
|     USERS DATA MODELS      |
------------------------------
"""

class UserCreate(BaseModel):
    fullname: str
    username: str
    email: str
    img_link: str = None
    is_admin: bool = False
    reputation: int = 0
    score: int = 0

class UserUpdate(BaseModel):
    fullname: str = None
    username: str = None
    email: str = None
    img_link: str = None
    is_admin: bool = None
    reputation: int = None
    score: int = None


"""
------------------------------
|       API ENDPOINTS        |
------------------------------
"""

@router.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT "id", "score", "fullname", "username", "img_link", "is_admin", "reputation", "email" FROM "users" WHERE "id" = :user_id'),
        {"user_id": user_id}
    )
    user = [
        {
            "id": row[0],
            "score": row[1],
            "fullname": row[2],
            "username": row[3],
            "img_link": row[4],
            "is_admin": row[5],
            "reputation": row[6],
            "email": row[7],
        }
        for row in result
    ]
    return user

@router.get("/users")
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    result = db.execute(
        text('SELECT * FROM "users" WHERE "email" = :email'),
        {"email": email}
    )
    user = result.fetchone()
    if not user:
        return []

    return [dict(user._mapping)]


@router.post("/users/")
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Comprobar si ya existe un usuario con ese email
    existing_user = db.execute(
        text('SELECT "id" FROM "users" WHERE "email" = :email'),
        {"email": user.email}
    ).fetchone()

    if existing_user:
        return {
            "message": "El usuario ya existe",
            "user_id": existing_user[0]
        }

    # 2. Insertar nuevo usuario si no existe
    result = db.execute(
        text('''INSERT INTO "users" ("fullname", "username", "email", "img_link", "is_admin", "reputation", "score") 
                VALUES (:fullname, :username, :email, :img_link, :is_admin, :reputation, :score) RETURNING "id"'''),
        user.dict()
    )
    user_id = result.fetchone()[0]
    db.commit()  # Confirmar la transacción

    return {
        "message": "Usuario creado",
        "user_id": user_id
    }


@router.put("/users/{user_id}")
async def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    updates = {k: v for k, v in user.dict().items() if v is not None}
    if not updates:
        return {"message": "No se proporcionaron datos para actualizar"}
    
    set_clause = ", ".join([f'"{key}" = :{key}' for key in updates.keys()])
    updates["user_id"] = user_id
    
    with db.begin():
        result = db.execute(
            text(f'UPDATE "users" SET {set_clause} WHERE "id" = :user_id'),
            updates
        )
        if result.rowcount == 0:
            raise HTTPException(
                status_code=status.HTTP_304_NOT_MODIFIED,
                detail="No se pudieron actualizar los datos del usuario"
            )
    
    return {"message": "Usuario actualizado"}

