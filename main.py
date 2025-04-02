from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect
from routers.users import router as router_users
from routers.threads import router as router_threads
from sqlalchemy.orm import Session
from db import get_db



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
    inspector = inspect(db)
    tables = inspector.get_table_names()
    for table in tables:
        print(f"Tabla: {table}")
        columns = inspector.get_columns(table)
        for column in columns:
            print(f"  Columna: {column['name']} - Tipo: {column['type']}")
    return {"message": "Estructura de la base de datos impresa en la consola"}

# Incluye los routers (dentro de estos routers debes usar la dependencia "get_db" en tus endpoints)
app.include_router(router_users)
app.include_router(router_threads)
