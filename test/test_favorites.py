import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os

# ————————————————————————————————————————————————————————————————————————————————
# 1) Ajustar sys.path para importar main y get_db
# ————————————————————————————————————————————————————————————————————————————————
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))
from main import app
from db import get_db

# ————————————————————————————————————————————————————————————————————————————————
# 2) Configurar SQLite en memoria (compartido) para todos los tests de favorites
# ————————————————————————————————————————————————————————————————————————————————
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool    # <- todas las sesiones compartirán esta BD en memoria
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ————————————————————————————————————————————————————————————————————————————————
# 3) Fixture autouse: crear tablas y datos de prueba ANTES de instanciar TestClient
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """
    1) Override de get_db para que use nuestro engine en memoria.
    2) Crear las tablas `users`, `threads` y `favorites` con exactamente las columnas que el router espera.
    3) Insertar un usuario de prueba ("testuser") y un hilo de prueba ligado a ese usuario.
    """
    # 3.1) Override de la dependencia get_db
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # 3.2) Crear las tablas “a mano” en el engine en memoria
    with engine.begin() as conn:
        # Tabla "users"
        conn.execute(text('''
            CREATE TABLE users (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT    NOT NULL
            );
        '''))

        # Tabla "threads"
        conn.execute(text('''
            CREATE TABLE threads (
                id      INTEGER PRIMARY KEY AUTOINCREMENT,
                title   TEXT    NOT NULL,
                content TEXT    NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        '''))

        # Tabla "favorites"
        conn.execute(text('''
            CREATE TABLE favorites (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                thread_id INTEGER NOT NULL,
                user_id   INTEGER NOT NULL,
                FOREIGN KEY (thread_id) REFERENCES threads(id),
                FOREIGN KEY (user_id)   REFERENCES users(id)
            );
        '''))

        # 3.3) Insertar datos de prueba: un usuario y un hilo ligado a él
        conn.execute(
            text('INSERT INTO users (username) VALUES (:u)'),
            [{"u": "testuser"}]
        )
        # Leer ID del usuario recién insertado
        user_row = conn.execute(text('SELECT id FROM users WHERE username = :u'), {"u": "testuser"}).fetchone()
        test_user_id = user_row[0]

        conn.execute(
            text('INSERT INTO threads (title, content, user_id) VALUES (:t, :c, :uid)'),
            [{"t": "Test Thread", "c": "Contenido de prueba", "uid": test_user_id}]
        )

    # Ya estamos listos; yield para que los tests puedan comenzar
    yield
    # (no hace falta teardown explícito para SQLite en memoria)


# ————————————————————————————————————————————————————————————————————————————————
# 4) Fixture para instanciar TestClient (ya con la DB en memoria lista)
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module")
def client():
    return TestClient(app)


# ————————————————————————————————————————————————————————————————————————————————
# 5) Fixture para leer los IDs de usuario y thread de prueba y pasarlos a los tests
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module")
def test_ids():
    with SessionLocal() as db:
        # Leer ID de "testuser"
        user_id = db.execute(text('SELECT id FROM users WHERE username = :u'), {"u": "testuser"}).fetchone()[0]
        # Leer ID del thread vinculado
        thread_id = db.execute(text('SELECT id FROM threads WHERE user_id = :uid'), {"uid": user_id}).fetchone()[0]
    return user_id, thread_id


# ————————————————————————————————————————————————————————————————————————————————
# 6) Tests de los endpoints /favorites
# ————————————————————————————————————————————————————————————————————————————————

def test_toggle_favorite_add(client, test_ids):
    """
    POST /favorites/toggle con usuario e hilo válidos debe añadir el favorito.
    """
    user_id, thread_id = test_ids
    response = client.post("/favorites/toggle", json={
        "user_id":   user_id,
        "thread_id": thread_id
    })
    assert response.status_code == 200
    assert response.json() == {"message": "Hilo añadido a favoritos", "favorito": True}


def test_is_favorito_true(client, test_ids):
    """
    GET /favorites/{user_id}/{thread_id} devuelve favorito: True tras añadirlo.
    """
    user_id, thread_id = test_ids
    response = client.get(f"/favorites/{user_id}/{thread_id}")
    assert response.status_code == 200
    assert response.json() == {"favorito": True}


def test_get_favoritos(client, test_ids):
    """
    GET /favorites/{user_id} devuelve una lista donde está el thread_id.
    """
    user_id, thread_id = test_ids
    response = client.get(f"/favorites/{user_id}")
    assert response.status_code == 200
    ids = response.json().get("thread_ids", [])
    assert isinstance(ids, list)
    assert thread_id in ids


def test_toggle_favorite_remove(client, test_ids):
    """
    POST /favorites/toggle una segunda vez debe eliminar el favorito.
    """
    user_id, thread_id = test_ids
    response = client.post("/favorites/toggle", json={
        "user_id":   user_id,
        "thread_id": thread_id
    })
    assert response.status_code == 200
    assert response.json() == {"message": "Hilo eliminado de favoritos", "favorito": False}


def test_is_favorito_false(client, test_ids):
    """
    GET /favorites/{user_id}/{thread_id} devuelve favorito: False tras eliminarlo.
    """
    user_id, thread_id = test_ids
    response = client.get(f"/favorites/{user_id}/{thread_id}")
    assert response.status_code == 200
    assert response.json() == {"favorito": False}
