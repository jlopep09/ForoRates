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
# 2) Configurar SQLite en memoria (compartido) para todos los tests de notifications
# ————————————————————————————————————————————————————————————————————————————————
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool    # <- todas las sesiones compartirán este DB en memoria
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ————————————————————————————————————————————————————————————————————————————————
# 3) Fixture autouse: crear la tabla `notifications` ANTES de instanciar el TestClient
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """
    1) Override de get_db para que use nuestro engine en memoria.
    2) Crear la tabla `notifications` con las columnas que el router consulta/inserta.
    """
    # 3.1) Override de la dependencia get_db
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # 3.2) Crear la tabla “notifications”
    with engine.begin() as conn:
        conn.execute(text('''
            CREATE TABLE notifications (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                id_user   INTEGER NOT NULL,
                title     TEXT    NOT NULL,
                content   TEXT    NOT NULL,
                id_thread INTEGER NOT NULL,
                seen      BOOLEAN NOT NULL DEFAULT 0
            );
        '''))
    # Ya está creada la tabla; los tests pueden comenzar
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
def clear_notifications_table():
    """
    Elimina todos los registros de `notifications`. 
    """
    with SessionLocal() as db:
        db.execute(text("DELETE FROM notifications"))
        db.commit()


def insert_notifications(user_id: int, notifs: list[dict]) -> list[int]:
    """
    Inserta una lista de notificaciones para un mismo user_id.
    Cada dict en `notifs` debe tener:
      - "title": str
      - "content": str
      - "id_thread": int
      - "read": bool
    Devuelve la lista de IDs recién insertados, en el mismo orden.
    """
    inserted_ids = []
    with SessionLocal() as db:
        for n in notifs:
            db.execute(
                text('''
                    INSERT INTO notifications (id_user, title, content, id_thread, seen)
                    VALUES (:user_id, :title, :content, :id_thread, :read)
                '''),
                {
                    "user_id":   user_id,
                    "title":     n["title"],
                    "content":   n["content"],
                    "id_thread": n["id_thread"],
                    "read":      n["read"]
                }
            )
            last_id = db.execute(text("SELECT last_insert_rowid()")).fetchone()[0]
            inserted_ids.append(last_id)
        db.commit()
    return inserted_ids


# ————————————————————————————————————————————————————————————————————————————————
# 6) Tests de /notifications
# ————————————————————————————————————————————————————————————————————————————————

def test_get_notifications_empty(client):
    """
    GET /notifications/{user_id} debe devolver lista vacía cuando no hay notificaciones.
    """
    clear_notifications_table()
    response = client.get("/notifications/42")  # 42 es un user_id que no tiene notifs
    assert response.status_code == 200
    assert response.json() == []


def test_create_notification_and_get(client):
    """
    POST /notifications/?user_id={u} crea una notificación y luego GET la devuelve correctamente.
    """
    u = 1
    clear_notifications_table()

    # 1) Crear una notificación para user_id=1, read=False
    payload = {
        "title":    "Aviso1",
        "content":  "Contenido de la notificación",
        "id_thread": 99,
        "read":     False
    }
    response_post = client.post(f"/notifications/?user_id={u}", json=payload)
    assert response_post.status_code == 201
    assert response_post.json() == {"msg": "Notificación creada"}

    # 2) GET /notifications/1
    response_get = client.get(f"/notifications/{u}")
    assert response_get.status_code == 200

    data = response_get.json()
    assert isinstance(data, list)
    assert len(data) == 1

    notif = data[0]
    # Verificar campos devueltos
    assert notif["title"]     == "Aviso1"
    assert notif["content"]   == "Contenido de la notificación"
    assert notif["id_thread"] == 99
    # SQLite devuelve seen como 0 o 1; Pydantic lo convertirá a False/True
    assert notif["read"] is False


def test_mark_all_read(client):
    """
    PUT /notifications/mark_all_read/{user_id} debe poner seen=true en todas las notificaciones.
    """
    u = 2
    clear_notifications_table()

    # 1) Insertar dos notificaciones iniciales con read=False
    insert_notifications(u, [
        {"title": "A", "content": "C1", "id_thread": 10, "read": False},
        {"title": "B", "content": "C2", "id_thread": 20, "read": False}
    ])

    # 2) Ejecutar el endpoint PUT
    response_put = client.put(f"/notifications/mark_all_read/{u}")
    assert response_put.status_code == 200
    assert response_put.json() == {"msg": "Todas las notificaciones marcadas como leídas"}

    # 3) Hacer GET y verificar que todas tienen read=True
    response_get = client.get(f"/notifications/{u}")
    assert response_get.status_code == 200

    data = response_get.json()
    assert isinstance(data, list)
    assert len(data) == 2

    for notif in data:
        assert notif["read"] is True


def test_delete_all_notifications(client):
    """
    DELETE /notifications/delete_all/{user_id} debe borrar todas las notificaciones de ese usuario.
    """
    u = 3
    clear_notifications_table()

    # 1) Insertar 3 notificaciones (mezcla de read True/False)
    insert_notifications(u, [
        {"title": "X", "content": "C1", "id_thread": 5,  "read": False},
        {"title": "Y", "content": "C2", "id_thread": 6,  "read": True},
        {"title": "Z", "content": "C3", "id_thread": 7,  "read": False}
    ])

    # 2) Ejecutar DELETE
    response_delete = client.delete(f"/notifications/delete_all/{u}")
    assert response_delete.status_code == 200
    assert response_delete.json() == {"msg": "Todas las notificaciones eliminadas"}

    # 3) GET y verificar que devuelve lista vacía
    response_get = client.get(f"/notifications/{u}")
    assert response_get.status_code == 200
    assert response_get.json() == []
