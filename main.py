from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, MetaData, inspect
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from sqlalchemy import text
from pydantic import BaseModel
import os


load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://root:PBxLIZ4XdN0HMfpUOhh6yIs57HsvZHwu@dpg-cv5kh0l6l47c73cugmk0-a.frankfurt-postgres.render.com/fororates")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
metadata = MetaData()
app = FastAPI()

# Permitir solicitudes CORS desde todos los orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes (en producción, puedes especificar solo los orígenes permitidos)
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los encabezados
)

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

@app.get("/db/structure")
async def get_db_structure():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    for table in tables:
        print(f"Tabla: {table}")
        columns = inspector.get_columns(table)
        for column in columns:
            print(f"  Columna: {column['name']} - Tipo: {column['type']}")
    return {"message": "Estructura de la base de datos impresa en la consola"}

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text('SELECT "id", "score", "fullname", "username", "img_link", "is_admin", "reputation", "email" FROM "users" WHERE "id" = :user_id'),
            {"user_id": user_id}
        )
        user = [{"id": row[0], "score": row[1], "fullname": row[2], "username": row[3], "img_link": row[4], "is_admin": row[5], "reputation": row[6], "email": row[7]} for row in result]
    return user

@app.get("/users/{user_id}/threads")
async def get_threads(user_id: int):
    with engine.connect() as conn:
        result = conn.execute(
            text('SELECT "id", "title", "content", "img_link" FROM "threads" WHERE "user_id" = :user_id'),
            {"user_id": user_id}
        )
        threads = [{"id": row[0], "title": row[1], "content": row[2], "img_link": row[3]} for row in result]
    return threads

@app.post("/users/")
async def create_user(user: UserCreate):
    with engine.connect() as conn:
        result = conn.execute(
            text('''INSERT INTO "users" ("fullname", "username", "email", "img_link", "is_admin", "reputation", "score") 
                    VALUES (:fullname, :username, :email, :img_link, :is_admin, :reputation, :score) RETURNING "id"'''),
            user.dict()
        )
        user_id = result.fetchone()[0]
    return {"message": "Usuario creado", "user_id": user_id}

@app.put("/users/{user_id}")
async def update_user(user_id: int, user: UserUpdate):
    updates = {k: v for k, v in user.dict().items() if v is not None}
    if not updates:
        return {"message": "No se proporcionaron datos para actualizar"}
    
    set_clause = ", ".join([f'"{key}" = :{key}' for key in updates.keys()])
    updates["user_id"] = user_id
    
    with engine.begin() as conn:  # Usando engine.begin() para manejo automático de transacciones
        conn.execute(
            text(f'UPDATE "users" SET {set_clause} WHERE "id" = :user_id'),
            updates
        )
    
    return {"message": "Usuario actualizado"}


