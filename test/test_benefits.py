import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os
from datetime import datetime, timedelta

# ————————————————————————————————————————————————————————————————————————————————
# 1) Ajustar sys.path para importar main y get_db
# ————————————————————————————————————————————————————————————————————————————————
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))
from main import app
from db import get_db

# ————————————————————————————————————————————————————————————————————————————————
# 2) Definir el engine de SQLite en memoria (compartido) para todos los tests
# ————————————————————————————————————————————————————————————————————————————————
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool    # <- todas las sesiones compartirán el mismo DB en memoria
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ————————————————————————————————————————————————————————————————————————————————
# 3) Fixture autouse: crear tablas y datos de prueba ANTES de instanciar el TestClient
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """
    Crea las tablas `users` y `benefits` (con exactamente las columnas que el router usa)
    e inserta dos usuarios de prueba:
     - "user_with_points" con score=100
     - "user_low_points"  con score=10
    Luego establece el override de get_db para que use este mismo engine en memoria.
    """
    # 3.1) Override de la dependencia get_db
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # 3.2) Crear las tablas “a mano” con SQL puro
    with engine.begin() as conn:
        # Tabla "users" (con columna score)
        conn.execute(text('''
            CREATE TABLE users (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT    NOT NULL,
                score    INTEGER NOT NULL DEFAULT 0
            );
        '''))

        # Tabla "benefits" con exactamente las columnas que tu router consulta/inserta
        conn.execute(text('''
            CREATE TABLE benefits (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT    NOT NULL,
                price      INTEGER NOT NULL,
                start_date TEXT    NOT NULL,
                end_date   TEXT    NOT NULL,
                user_id    INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        '''))

        # 3.3) Insertar dos usuarios de prueba en la tabla users
        conn.execute(
            text('INSERT INTO users (username, score) VALUES (:u, :s)'),
            [{"u": "user_with_points", "s": 100},
             {"u": "user_low_points",  "s": 10}]
        )

    # 3.4) Hecho el setup; yield para que los tests puedan ejecutarse
    yield

    # （Opcional）Aquí podrías hacer un teardown si hiciera falta, pero en memoria no es necesario.


# ————————————————————————————————————————————————————————————————————————————————
# 4) Fixture para instanciar TestClient, una vez que las tablas YA están creadas
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module")
def client():
    return TestClient(app)


# ————————————————————————————————————————————————————————————————————————————————
# 5) Fixture para leer los IDs de los usuarios de prueba (user1_id y user2_id)
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module")
def user_ids():
    with SessionLocal() as db:
        row1 = db.execute(text('SELECT id FROM users WHERE username = :u'),
                          {"u": "user_with_points"}).fetchone()
        row2 = db.execute(text('SELECT id FROM users WHERE username = :u'),
                          {"u": "user_low_points"}).fetchone()

    # row1[0] es el ID de "user_with_points"; row2[0] es el ID de "user_low_points"
    return row1[0], row2[0]


# ————————————————————————————————————————————————————————————————————————————————
# 6) Constantes de fechas ISO para los payloads
# ————————————————————————————————————————————————————————————————————————————————
today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
start_date_str = today.isoformat()
end_date_str = (today + timedelta(days=30)).isoformat()


# ————————————————————————————————————————————————————————————————————————————————
# 7) Tests de los endpoints /benefits
# ————————————————————————————————————————————————————————————————————————————————
def test_get_benefits_empty(client, user_ids):
    """
    GET /benefits/{user_id} debe devolver lista vacía cuando no hay beneficios.
    """
    user1_id, _ = user_ids
    response = client.get(f"/benefits/{user1_id}")
    assert response.status_code == 200
    assert response.json() == []


def test_create_benefit_insufficient_points(client, user_ids):
    """
    POST /benefits/?user_id={user2_id} con price > score de user_low_points devuelve 400.
    """
    _, user2_id = user_ids
    payload = {
        "name":       "ExpensiveBenefit",
        "price":      50,  # user_low_points solo tiene 10 puntos
        "start_date": start_date_str,
        "end_date":   end_date_str
    }
    response = client.post(f"/benefits/?user_id={user2_id}", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "No tienes puntos suficientes para esta compra"


def test_create_benefit_insert_and_score_deduction(client, user_ids):
    """
    POST /benefits/?user_id={user1_id} con puntos suficientes inserta beneficio,
    descuenta puntos y retorna mensaje correcto.
    """
    user1_id, _ = user_ids

    # 1) Leer el score actual de user1
    with SessionLocal() as db:
        old_score = db.execute(
            text('SELECT score FROM users WHERE id = :uid'),
            {"uid": user1_id}
        ).fetchone()[0]

    # 2) Hacer la petición para crear un benefit nuevo de precio 20
    payload = {
        "name":       "NewBenefit",
        "price":      20,
        "start_date": start_date_str,
        "end_date":   end_date_str
    }
    response = client.post(f"/benefits/?user_id={user1_id}", json=payload)
    assert response.status_code == 201
    assert response.json() == {"msg": "Beneficio registrado y puntos descontados."}

    # 3) Verificar en DB que el benefit se creó y que el score se redujo
    with SessionLocal() as db:
        benefit_row = db.execute(
            text('SELECT * FROM benefits WHERE name = :name AND user_id = :uid'),
            {"name": "NewBenefit", "uid": user1_id}
        ).mappings().fetchone()
        assert benefit_row is not None
        assert benefit_row["price"] == 20

        new_score = db.execute(
            text('SELECT score FROM users WHERE id = :uid'),
            {"uid": user1_id}
        ).fetchone()[0]
        assert new_score == old_score - 20


def test_get_benefits_non_empty(client, user_ids):
    """
    GET /benefits/{user_id} debe retornar la lista con el beneficio insertado.
    """
    user1_id, _ = user_ids
    response = client.get(f"/benefits/{user1_id}")
    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1

    benefit = data[0]
    assert benefit["name"] == "NewBenefit"
    assert benefit["price"] == 20
    assert benefit["start_date"] == start_date_str
    assert benefit["end_date"] == end_date_str


def test_create_benefit_update_existing(client, user_ids):
    """
    POST /benefits/?user_id={user1_id} con mismo name actualiza el beneficio existente,
    descuenta puntos y retorna el mensaje adecuado.
    """
    user1_id, _ = user_ids

    # 1) Restaurar score de user1 a 100 y agregar manualmente un benefit “UpdateBenefit”
    with SessionLocal() as db:
        # Restaurar score a 100
        db.execute(
            text('UPDATE users SET score = :score WHERE id = :uid'),
            {"score": 100, "uid": user1_id}
        )
        # Insertar un benefit inicial de precio 10
        db.execute(
            text('''
                INSERT INTO benefits (name, price, start_date, end_date, user_id)
                VALUES (:name, :price, :start_date, :end_date, :uid)
            '''),
            {
                "name":       "UpdateBenefit",
                "price":      10,
                "start_date": start_date_str,
                "end_date":   end_date_str,
                "uid":        user1_id
            }
        )
        db.commit()

        # Leer el score justo después de restaurar (debería ser 100)
        old_score = db.execute(
            text('SELECT score FROM users WHERE id = :uid'),
            {"uid": user1_id}
        ).fetchone()[0]

    # 2) Hacer el POST con el mismo name pero price=30
    payload = {
        "name":       "UpdateBenefit",
        "price":      30,
        "start_date": start_date_str,
        "end_date":   end_date_str
    }
    response = client.post(f"/benefits/?user_id={user1_id}", json=payload)
    assert response.status_code == 201
    assert response.json() == {"msg": "Beneficio actualizado y puntos descontados."}

    # 3) Verificar que en DB se actualizó price y que el score se descontó (100 - 30 = 70)
    with SessionLocal() as db:
        row = db.execute(
            text('SELECT * FROM benefits WHERE name = :name AND user_id = :uid'),
            {"name": "UpdateBenefit", "uid": user1_id}
        ).mappings().fetchone()
        assert row is not None
        assert row["price"] == 30

        updated_score = db.execute(
            text('SELECT score FROM users WHERE id = :uid'),
            {"uid": user1_id}
        ).fetchone()[0]
        assert updated_score == old_score - 30
