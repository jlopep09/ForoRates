import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

# ————————————————————————————————————————————————————————————————————————————————
# 1) Ajustar sys.path para poder importar main y get_db
# ————————————————————————————————————————————————————————————————————————————————
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))
from main import app
from db import get_db

# ————————————————————————————————————————————————————————————————————————————————
# 2) Configurar SQLite en memoria (compartido) para todos los tests de ranking
# ————————————————————————————————————————————————————————————————————————————————
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool    # <- todas las sesiones compartirán esta DB en memoria
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ————————————————————————————————————————————————————————————————————————————————
# 3) Fixture autouse: crear la tabla `users` ANTES de instanciar el TestClient
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """
    1) Override de get_db para que use nuestro engine en memoria.
    2) Crear la tabla `users` con exactamente las columnas que el router de /ranking consulta.
    """
    # 3.1) Override de la dependencia get_db
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # 3.2) Crear la tabla “users” con las columnas fullname, username, email, img_link, reputation, score
    with engine.begin() as conn:
        conn.execute(text('''
            CREATE TABLE users (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                fullname   TEXT    NOT NULL,
                username   TEXT    NOT NULL,
                email      TEXT    NOT NULL,
                img_link   TEXT    NOT NULL,
                reputation INTEGER NOT NULL DEFAULT 0,
                score      INTEGER NOT NULL DEFAULT 0
            );
        '''))
    # Se finished setup; yield para que los tests puedan ejecutarse
    yield
    # No se necesita teardown para SQLite en memoria


# ————————————————————————————————————————————————————————————————————————————————
# 4) Fixture para instanciar TestClient (ya con la tabla creada)
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module")
def client():
    return TestClient(app)


# ————————————————————————————————————————————————————————————————————————————————
# 5) Helpers para limpiar la tabla y poblarla antes de cada test
# ————————————————————————————————————————————————————————————————————————————————
def clear_users_table():
    """
    Elimina todos los registros de `users`. 
    Úsalo al comienzo de cada test para garantizar un estado limpio.
    """
    with SessionLocal() as db:
        db.execute(text("DELETE FROM users"))
        db.commit()


def insert_users(user_list):
    """
    Inserta una lista de diccionarios en la tabla `users`.
    Cada diccionario debe tener las claves:
      - fullname
      - username
      - email
      - img_link (puede ser None)
      - reputation (int)
      - score (int)
    Si img_link es None, se insertará cadena vacía para que Pydantic no valide como None.
    Devuelve la lista de IDs de los usuarios recién insertados, en el mismo orden.
    """
    inserted_ids = []
    with SessionLocal() as db:
        for u in user_list:
            # Si img_link es None, forzamos cadena vacía
            img = u.get("img_link")
            if img is None:
                img = ""
            db.execute(
                text('''
                    INSERT INTO users (fullname, username, email, img_link, reputation, score)
                    VALUES (:fullname, :username, :email, :img_link, :reputation, :score)
                '''),
                {
                    "fullname":   u["fullname"],
                    "username":   u["username"],
                    "email":      u["email"],
                    "img_link":   img,
                    "reputation": u.get("reputation", 0),
                    "score":      u.get("score", 0)
                }
            )
            # Leer el último id autogenerado
            last_id = db.execute(text("SELECT last_insert_rowid()")).fetchone()[0]
            inserted_ids.append(last_id)
        db.commit()
    return inserted_ids


# ————————————————————————————————————————————————————————————————————————————————
# 6) Tests de /ranking
# ————————————————————————————————————————————————————————————————————————————————

def test_ranking_less_than_20(client):
    """
    Si hay menos de 20 usuarios en la tabla, /ranking debe devolverlos a todos,
    ordenados por score de mayor a menor.
    """
    # 1) Limpiar la tabla antes de poblarla
    clear_users_table()

    # 2) Insertar 3 usuarios con distintos puntajes (img_link=None pasará a "")
    users = [
        {"fullname": "Alice A", "username": "alice", "email": "alice@example.com", "img_link": None, "reputation": 10, "score": 50},
        {"fullname": "Bob B",   "username": "bob",   "email": "bob@example.com",   "img_link": None, "reputation": 20, "score": 70},
        {"fullname": "Carol C", "username": "carol", "email": "carol@example.com", "img_link": None, "reputation": 30, "score": 60},
    ]
    insert_users(users)

    # 3) Llamar al endpoint
    response = client.get("/ranking")
    assert response.status_code == 200

    data = response.json()
    # Debe devolver exactamente 3 registros
    assert isinstance(data, list)
    assert len(data) == 3

    # Comprobar que estén ordenados por score DESC: Bob(70), Carol(60), Alice(50)
    assert data[0]["username"] == "bob"   and data[0]["score"] == 70
    assert data[1]["username"] == "carol" and data[1]["score"] == 60
    assert data[2]["username"] == "alice" and data[2]["score"] == 50

    # También comprobar que la información adicional (fullname, email, img_link, reputation) coincide
    assert data[0]["fullname"]   == "Bob B"
    assert data[0]["email"]      == "bob@example.com"
    assert data[0]["img_link"]   == ""      # Ahora inserta cadena vacía en lugar de None
    assert data[0]["reputation"] == 20

    assert data[1]["fullname"]   == "Carol C"
    assert data[1]["email"]      == "carol@example.com"
    assert data[1]["img_link"]   == ""
    assert data[1]["reputation"] == 30

    assert data[2]["fullname"]   == "Alice A"
    assert data[2]["email"]      == "alice@example.com"
    assert data[2]["img_link"]   == ""
    assert data[2]["reputation"] == 10


def test_ranking_more_than_20(client):
    """
    Si hay más de 20 usuarios, /ranking debe devolver solo los primeros 20,
    ordenados por score de mayor a menor.
    """
    # 1) Limpiar la tabla antes de poblarla
    clear_users_table()

    # 2) Insertar 25 usuarios con puntajes crecientes de 1 a 25, img_link=None ➔ ""
    bulk_users = []
    for i in range(1, 26):
        bulk_users.append({
            "fullname":   f"User{i}",
            "username":   f"user{i}",
            "email":      f"user{i}@example.com",
            "img_link":   None,
            "reputation": i * 5,
            "score":      i  # User1: score=1, ..., User25: score=25
        })
    insert_users(bulk_users)

    # 3) Llamar al endpoint
    response = client.get("/ranking")
    assert response.status_code == 200

    data = response.json()
    # Debe devolver exactamente 20 registros (los de score 25 down to 6)
    assert isinstance(data, list)
    assert len(data) == 20

    # El primer elemento debe tener score=25, username="user25"
    assert data[0]["username"] == "user25"
    assert data[0]["score"] == 25

    # El último elemento (posición 19) debe corresponder al usuario con score=6 (user6)
    assert data[-1]["username"] == "user6"
    assert data[-1]["score"] == 6

    # Opcional: verificar algunos intermedios
    # Por ejemplo, posición 10 (índice 10) debería ser user15 (score=15)
    assert data[10]["username"] == "user15"
    assert data[10]["score"] == 15
