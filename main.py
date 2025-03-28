from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
import os

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
@app.get("/users/{user_id}")
async def get_threads(user_id: int):
    return {"id": 1, "score": 125, "fullname": "Jose Lopez Perez", "username": "jlopep09"}

@app.get("/users/{user_id}/threads")
async def get_threads(user_id: int):
    with engine.connect() as conn:
        result = conn.execute("SELECT id, title, description, image_url FROM threads WHERE user_id = %s", (user_id,))
        threads = [{"id": row[0], "title": row[1], "description": row[2], "image": row[3]} for row in result]
    return threads

@app.get("/users/{user_id}/testthreads")
async def get_testthreads(user_id: int):
    threads = [{"id": 1, "title": "Thread1", "description": "This is the thread 1", "image": "https://static.nationalgeographicla.com/files/styles/image_3200/public/green-iguana.jpg?w=1600"},
               {"id": 2, "title": "Thread2", "description": "This is the thread 2", "image": "https://static.nationalgeographicla.com/files/styles/image_3200/public/green-iguana.jpg?w=1600"},
               {"id": 3, "title": "Thread3", "description": "This is the thread 3", "image": "https://static.nationalgeographicla.com/files/styles/image_3200/public/green-iguana.jpg?w=1600"},
               {"id": 4, "title": "Thread4", "description": "This is the thread 4", "image": "https://static.nationalgeographicla.com/files/styles/image_3200/public/green-iguana.jpg?w=1600"},
               {"id": 5, "title": "Thread5", "description": "This is the thread 5", "image": "https://static.nationalgeographicla.com/files/styles/image_3200/public/green-iguana.jpg?w=1600"},
               {"id": 6, "title": "Thread6", "description": "This is the thread 6", "image": "https://static.nationalgeographicla.com/files/styles/image_3200/public/green-iguana.jpg?w=1600"}]
    return threads
