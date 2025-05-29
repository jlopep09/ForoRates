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
    password: str

class UserUpdate(BaseModel):
    fullname: str = None
    username: str = None
    email: str = None
    img_link: str = None
    is_admin: bool = None
    reputation: int = None
    score: int = None

class PasswordChange(BaseModel):
    old_password: str
    new_password: str


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
    result = db.execute(
        text('''INSERT INTO "users" ("fullname", "username", "email", "img_link", "is_admin", "reputation", "score", "password") 
                VALUES (:fullname, :username, :email, :img_link, :is_admin, :reputation, :score, :password) RETURNING "id"'''),
        user.dict()
    )
    user_id = result.fetchone()[0]
    db.commit()  # Confirmar la transacción
    return {"message": "Usuario creado", "user_id": user_id}


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


@router.put("/users/{user_id}/change_password")
async def change_password(user_id: int, password_data: PasswordChange, db: Session = Depends(get_db)):
    # Verificar la contraseña actual del usuario en la base de datos
    result = db.execute(
        text('SELECT "password" FROM "users" WHERE "id" = :user_id'),
        {"user_id": user_id}
    )
    current_password = result.fetchone()

    if not current_password or current_password[0] != password_data.old_password:
        raise HTTPException(
            status_code=status.HTTP_304_NOT_MODIFIED,
            detail="La contraseña actual no es correcta"
        )
    
    # Actualizar la contraseña
    db.execute(
        text('UPDATE "users" SET "password" = :new_password WHERE "id" = :user_id'),
        {"user_id": user_id, "new_password": password_data.new_password}
    )
    db.commit()  # Guardar los cambios
    
    return {"message": "Contraseña actualizada con éxito"}
