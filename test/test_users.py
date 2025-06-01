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
# 2) Configurar SQLite en memoria (compartido) para todos los tests de usuarios
# ————————————————————————————————————————————————————————————————————————————————
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool    # <- todas las sesiones compartirán este DB en memoria
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ————————————————————————————————————————————————————————————————————————————————
# 3) Fixture autouse: crear la tabla `users` ANTES de instanciar el TestClient
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """
    1) Override de get_db para que use nuestro engine en memoria.
    2) Crear la tabla `users` con todas las columnas que el router espera.
    """
    # 3.1) Override de la dependencia get_db
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # 3.2) Crear la tabla “users”
    with engine.begin() as conn:
        conn.execute(text('''
            CREATE TABLE users (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                fullname   TEXT    NOT NULL,
                username   TEXT    NOT NULL,
                email      TEXT    NOT NULL,
                img_link   TEXT,
                is_admin   BOOLEAN NOT NULL DEFAULT 0,
                reputation INTEGER NOT NULL DEFAULT 0,
                score      INTEGER NOT NULL DEFAULT 0
            );
        '''))
    yield
    # No hace falta teardown para SQLite en memoria

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
    with SessionLocal() as db:
        db.execute(text("DELETE FROM users"))
        db.commit()

def insert_user(user_data):
    """
    Inserta un usuario directamente en la tabla `users`.
    user_data debe contener:
      - fullname: str
      - username: str
      - email: str
      - img_link: str o None
      - is_admin: bool
      - reputation: int
      - score: int
    Devuelve el ID recién insertado.
    """
    with SessionLocal() as db:
        result = db.execute(
            text('''
                INSERT INTO users (fullname, username, email, img_link, is_admin, reputation, score)
                VALUES (:fullname, :username, :email, :img_link, :is_admin, :reputation, :score)
            '''),
            {
                "fullname":   user_data["fullname"],
                "username":   user_data["username"],
                "email":      user_data["email"],
                "img_link":   user_data.get("img_link"),
                "is_admin":   1 if user_data.get("is_admin", False) else 0,
                "reputation": user_data.get("reputation", 0),
                "score":      user_data.get("score", 0)
            }
        )
        last_id = db.execute(text("SELECT last_insert_rowid()")).fetchone()[0]
        db.commit()
    return last_id


# ————————————————————————————————————————————————————————————————————————————————
# 6) Tests de GET /users/{user_id} cuando no existe
# ————————————————————————————————————————————————————————————————————————————————
def test_get_user_not_exist(client):
    """
    GET /users/{user_id} si no existe debe devolver lista vacía.
    """
    clear_users_table()
    response = client.get("/users/999")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data == []


# ————————————————————————————————————————————————————————————————————————————————
# 7) Test de POST /users/ (create_user) y GET /users/{user_id}
# ————————————————————————————————————————————————————————————————————————————————
def test_create_user_and_get_by_id(client):
    """
    POST /users/ crea un usuario nuevo y GET /users/{user_id} lo devuelve correctamente.
    """
    clear_users_table()
    new_user = {
        "fullname":  "Alice Wonderland",
        "username":  "alice",
        "email":     "alice@example.com",
        "img_link":  "http://example.com/alice.jpg",
        "is_admin":  False,
        "reputation": 10,
        "score":     100
    }

    # 7.1) Crear usuario
    response_create = client.post("/users/", json=new_user)
    assert response_create.status_code == 200
    data_create = response_create.json()
    assert "message" in data_create and data_create["message"] == "Usuario creado"
    assert "user_id" in data_create
    user_id = data_create["user_id"]

    # 7.2) Obtener usuario por ID
    response_get = client.get(f"/users/{user_id}")
    assert response_get.status_code == 200
    data_get = response_get.json()
    assert isinstance(data_get, list) and len(data_get) == 1

    user = data_get[0]
    assert user["id"] == user_id
    assert user["fullname"] == new_user["fullname"]
    assert user["username"] == new_user["username"]
    assert user["email"] == new_user["email"]
    assert user["img_link"] == new_user["img_link"]
    assert user["is_admin"] == new_user["is_admin"]
    assert user["reputation"] == new_user["reputation"]
    assert user["score"] == new_user["score"]


# ————————————————————————————————————————————————————————————————————————————————
# 8) Test de POST /users/ cuando ya existe email
# ————————————————————————————————————————————————————————————————————————————————
def test_create_existing_user(client):
    """
    POST /users/ con email ya existente debe devolver mensaje y user_id existente.
    """
    clear_users_table()
    user_data = {
        "fullname":  "Bob Builder",
        "username":  "bob",
        "email":     "bob@example.com",
        "img_link":  None,
        "is_admin":  True,
        "reputation": 5,
        "score":     50
    }
    # Insertar usuario manualmente
    existing_id = insert_user(user_data)

    # Intentar crear con el mismo email, pero solo enviamos los campos requeridos por el modelo
    duplicate_payload = {
        "fullname": "Cualquier Nombre",
        "username": "cualquier_usuario",
        "email":    "bob@example.com"
    }
    response = client.post("/users/", json=duplicate_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "El usuario ya existe"
    assert data["user_id"] == existing_id



# ————————————————————————————————————————————————————————————————————————————————
# 9) Test de GET /users?email=
# ————————————————————————————————————————————————————————————————————————————————
def test_get_user_by_email(client):
    """
    GET /users?email= debe devolver usuario con ese email en lista.
    """
    clear_users_table()
    user_data = {
        "fullname":  "Charlie Chocolate",
        "username":  "charlie",
        "email":     "charlie@example.com",
        "img_link":  None,
        "is_admin":  False,
        "reputation": 2,
        "score":     20
    }
    inserted_id = insert_user(user_data)

    # Buscar por email existente
    response_exist = client.get(f"/users?email={user_data['email']}")
    assert response_exist.status_code == 200
    data_exist = response_exist.json()
    assert isinstance(data_exist, list) and len(data_exist) == 1
    user = data_exist[0]
    assert user["id"] == inserted_id
    assert user["email"] == user_data["email"]

    # Buscar por email no existente
    response_not = client.get("/users?email=nonexistent@example.com")
    assert response_not.status_code == 200
    data_not = response_not.json()
    assert data_not == []


# ————————————————————————————————————————————————————————————————————————————————
# 10) Test de PUT /users/{user_id} (update_user) con éxito
# ————————————————————————————————————————————————————————————————————————————————
def test_update_user_success(client):
    """
    PUT /users/{user_id} debe actualizar los campos proporcionados correctamente.
    """
    clear_users_table()
    initial_data = {
        "fullname":  "Dora Explorer",
        "username":  "dora",
        "email":     "dora@example.com",
        "img_link":  None,
        "is_admin":  False,
        "reputation": 1,
        "score":     10
    }
    uid = insert_user(initial_data)

    update_payload = {
        "fullname":   "Dora the Explorer",
        "img_link":   "http://example.com/dora.png",
        "reputation": 42
    }
    response = client.put(f"/users/{uid}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Usuario actualizado"

    # Verificar cambios usando GET /users/{uid}
    response_get = client.get(f"/users/{uid}")
    assert response_get.status_code == 200
    user = response_get.json()[0]
    assert user["fullname"] == update_payload["fullname"]
    assert user["img_link"] == update_payload["img_link"]
    assert user["reputation"] == update_payload["reputation"]
    # Campos no actualizados permanecen iguales
    assert user["username"] == initial_data["username"]
    assert user["email"] == initial_data["email"]
    assert user["is_admin"] == initial_data["is_admin"]
    assert user["score"] == initial_data["score"]


# ————————————————————————————————————————————————————————————————————————————————
# 11) Test de PUT /users/{user_id} sin datos para actualizar
# ————————————————————————————————————————————————————————————————————————————————
def test_update_user_no_data(client):
    """
    PUT /users/{user_id} sin payload debe devolver mensaje indicándolo.
    """
    clear_users_table()
    user_data = {
        "fullname":  "Eve Online",
        "username":  "eve",
        "email":     "eve@example.com",
        "img_link":  None,
        "is_admin":  False,
        "reputation": 0,
        "score":     0
    }
    uid = insert_user(user_data)

    # Llamada con body vacío
    response = client.put(f"/users/{uid}", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "No se proporcionaron datos para actualizar"


# ————————————————————————————————————————————————————————————————————————————————
# 12) Test de PUT /users/{user_id} cuando el usuario no existe
# ————————————————————————————————————————————————————————————————————————————————
def test_update_user_not_exist(client):
    """
    PUT /users/{user_id} con ID inexistente debe devolver 304 Not Modified.
    """
    clear_users_table()
    update_payload = {"fullname": "Ghost User"}
    response = client.put("/users/9999", json=update_payload)
    assert response.status_code == 304
