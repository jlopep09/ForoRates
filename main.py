from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from routers.users import router as router_users
from routers.threads import router as router_threads
from routers.ranking import router as router_ranking
from routers.favorites import router as router_favorites
from routers.notifications import router as router_notifications
from sqlalchemy.orm import Session
from db import get_db, engine
from routers.benefits import router as router_benefits



app = FastAPI()

# Permitir solicitudes CORS desde todos los orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/db/structure")
async def get_db_structure(db: Session = Depends(get_db)):
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    for table in tables:
        print(f"Tabla: {table}")
        columns = inspector.get_columns(table)
        for column in columns:
            print(f"  Columna: {column['name']} - Tipo: {column['type']}")
    return {"message": "Database structure printed to the console"}

# Incluye los routers (dentro de estos routers debes usar la dependencia "get_db" en tus endpoints)
app.include_router(router_users)
app.include_router(router_threads)
app.include_router(router_ranking)
app.include_router(router_favorites)
app.include_router(router_notifications)
app.include_router(router_benefits)
