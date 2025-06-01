import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import sys
import os
from datetime import datetime

# ————————————————————————————————————————————————————————————————————————————————
# 1) Ajustar sys.path para importar main y get_db
# ————————————————————————————————————————————————————————————————————————————————
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))
from main import app
from db import get_db

# ————————————————————————————————————————————————————————————————————————————————
# 2) Configurar SQLite en memoria (compartido) para todos los tests de threads
# ————————————————————————————————————————————————————————————————————————————————
DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool    # <- todas las sesiones compartirán este DB en memoria
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ————————————————————————————————————————————————————————————————————————————————
# 3) Fixture autouse: crear la tabla `threads` ANTES de instanciar el TestClient
# ————————————————————————————————————————————————————————————————————————————————
@pytest.fixture(scope="module", autouse=True)
def setup_database():
    """
    1) Override de get_db para que use nuestro engine en memoria.
    2) Crear la tabla `threads` con todas las columnas que el router espera.
    """
    # 3.1) Override de la dependencia get_db
    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    # 3.2) Crear la tabla “threads”
    with engine.begin() as conn:
        conn.execute(text('''
            CREATE TABLE threads (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                title     TEXT    NOT NULL,
                content   TEXT    NOT NULL,
                is_closed BOOLEAN NOT NULL DEFAULT 0,
                user_id   INTEGER NOT NULL,
                date      TEXT    NOT NULL,
                tags      TEXT,
                img_link  TEXT,
                votes     INTEGER NOT NULL DEFAULT 0
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
def clear_threads_table():
    with SessionLocal() as db:
        db.execute(text("DELETE FROM threads"))
        db.commit()

def insert_threads(thread_list):
    """
    Inserta una lista de diccionarios en la tabla `threads`.
    Cada dict debe tener:
      - title: str
      - content: str
      - is_closed: bool
      - user_id: int
      - date: str (ISO)
      - tags: str o None
      - img_link: str o None
      - votes: int
    Devuelve la lista de IDs recién insertados, en el mismo orden.
    """
    inserted_ids = []
    with SessionLocal() as db:
        for t in thread_list:
            db.execute(
                text('''
                    INSERT INTO threads (title, content, is_closed, user_id, date, tags, img_link, votes)
                    VALUES (:title, :content, :is_closed, :user_id, :date, :tags, :img_link, :votes)
                '''),
                {
                    "title":     t["title"],
                    "content":   t["content"],
                    "is_closed": 1 if t["is_closed"] else 0,
                    "user_id":   t["user_id"],
                    "date":      t["date"],
                    "tags":      t.get("tags"),
                    "img_link":  t.get("img_link"),
                    "votes":     t["votes"]
                }
            )
            last_id = db.execute(text("SELECT last_insert_rowid()")).fetchone()[0]
            inserted_ids.append(last_id)
        db.commit()
    return inserted_ids


# ————————————————————————————————————————————————————————————————————————————————
# 6) Tests de /threads/count
# ————————————————————————————————————————————————————————————————————————————————
def test_count_threads_without_filters(client):
    """
    GET /threads/count sin parámetros debe devolver el conteo total de threads.
    """
    clear_threads_table()
    now = datetime.utcnow().isoformat()
    # Insertar 5 threads sin importar tags o title
    insert_threads([{
        "title":     f"T{i}",
        "content":   f"Content{i}",
        "is_closed": False,
        "user_id":   i,
        "date":      now,
        "tags":      None,
        "img_link":  None,
        "votes":     i * 2
    } for i in range(1, 6)])  # IDs serán 1..5

    response = client.get("/threads/count")
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert data["total"] == 5


# ————————————————————————————————————————————————————————————————————————————————
# 7) Test de /threads/tags
# ————————————————————————————————————————————————————————————————————————————————
def test_get_tags(client):
    """
    GET /threads/tags debe devolver la lista ordenada de tags únicos extraídos.
    """
    clear_threads_table()
    now = datetime.utcnow().isoformat()
    # Insertar threads con tags variadas
    insert_threads([
        {"title": "A", "content": "C", "is_closed": False, "user_id": 1, "date": now, "tags": "tag1, tag2", "img_link": None, "votes": 0},
        {"title": "B", "content": "C", "is_closed": False, "user_id": 2, "date": now, "tags": "tag2,tag3",  "img_link": None, "votes": 0},
        {"title": "C", "content": "C", "is_closed": False, "user_id": 3, "date": now, "tags": None,       "img_link": None, "votes": 0},
    ])

    response = client.get("/threads/tags")
    assert response.status_code == 200
    data = response.json()
    # Debe devolver ["tag1", "tag2", "tag3"] ordenado
    assert "tags" in data
    assert data["tags"] == ["tag1", "tag2", "tag3"]


# ————————————————————————————————————————————————————————————————————————————————
# 8) Test de /threads (list_threads) sin filtros
# ————————————————————————————————————————————————————————————————————————————————
def test_list_threads_basic(client):
    """
    GET /threads?limit=&offset= sin filtros debe devolver threads ordenados por votos DESC.
    """
    clear_threads_table()
    now = datetime.utcnow().isoformat()
    # Insertar 3 threads con votos 5, 10, 3
    ids = insert_threads([
        {"title": "T1", "content": "C1", "is_closed": False, "user_id": 1, "date": now, "tags": None, "img_link": None, "votes": 5},
        {"title": "T2", "content": "C2", "is_closed": False, "user_id": 2, "date": now, "tags": None, "img_link": None, "votes": 10},
        {"title": "T3", "content": "C3", "is_closed": False, "user_id": 3, "date": now, "tags": None, "img_link": None, "votes": 3},
    ])

    # Pedir los dos primeros (limit=2, offset=0)
    response = client.get("/threads?limit=2&offset=0")
    assert response.status_code == 200

    data = response.json()
    # Debe devolver 2 elementos: el de votes=10 (T2) y luego votes=5 (T1)
    assert len(data) == 2
    assert data[0]["title"] == "T2" and data[0]["votes"] == 10
    assert data[1]["title"] == "T1" and data[1]["votes"] == 5


# ————————————————————————————————————————————————————————————————————————————————
# 9) Test de /threads/user/{user_id}
# ————————————————————————————————————————————————————————————————————————————————
def test_get_threads_by_user(client):
    """
    GET /threads/user/{user_id} debe devolver solo los threads de ese usuario.
    """
    clear_threads_table()
    now = datetime.utcnow().isoformat()
    # Insertar 3 threads: dos para user_id=1, uno para user_id=2
    insert_threads([
        {"title": "U1-1", "content": "C", "is_closed": False, "user_id": 1, "date": now, "tags": None, "img_link": "img1", "votes": 0},
        {"title": "U1-2", "content": "C", "is_closed": False, "user_id": 1, "date": now, "tags": None, "img_link": "img2", "votes": 0},
        {"title": "U2-1", "content": "C", "is_closed": False, "user_id": 2, "date": now, "tags": None, "img_link": "img3", "votes": 0},
    ])

    response = client.get("/threads/user/1")
    assert response.status_code == 200

    data = response.json()
    # Debe devolver solo los dos threads de user_id=1
    assert len(data) == 2
    titles = {item["title"] for item in data}
    assert titles == {"U1-1", "U1-2"}
    # Comprobar que incluyen campo img_link
    for item in data:
        assert "img_link" in item and item["img_link"].startswith("img")


# ————————————————————————————————————————————————————————————————————————————————
# 10) Test de /threads/by_ids
# ————————————————————————————————————————————————————————————————————————————————
def test_get_threads_by_ids(client):
    """
    GET /threads/by_ids?thread_ids=... debe devolver solo threads con esos IDs, ordenados por votos DESC.
    """
    clear_threads_table()
    now = datetime.utcnow().isoformat()
    # Insertar 4 threads con votos 1, 4, 2, 3 (IDs se asignan en orden)
    ids = insert_threads([
        {"title": "A", "content": "C", "is_closed": False, "user_id": 1, "date": now, "tags": None, "img_link": None, "votes": 1},
        {"title": "B", "content": "C", "is_closed": False, "user_id": 1, "date": now, "tags": None, "img_link": None, "votes": 4},
        {"title": "C", "content": "C", "is_closed": False, "user_id": 1, "date": now, "tags": None, "img_link": None, "votes": 2},
        {"title": "D", "content": "C", "is_closed": False, "user_id": 1, "date": now, "tags": None, "img_link": None, "votes": 3},
    ])
    # Queremos los threads con IDs [ids[2], ids[0], ids[3]] = C, A, D
    query_ids = [ids[2], ids[0], ids[3]]
    qs = "&".join(f"thread_ids={tid}" for tid in query_ids)
    response = client.get(f"/threads/by_ids?{qs}")
    assert response.status_code == 200

    data = response.json()
    # Debe devolver solo tres elementos, ordenados por votos DESC: D(votes=3), C(2), A(1)
    assert len(data) == 3
    assert data[0]["title"] == "D" and data[0]["votes"] == 3
    assert data[1]["title"] == "C" and data[1]["votes"] == 2
    assert data[2]["title"] == "A" and data[2]["votes"] == 1


# ————————————————————————————————————————————————————————————————————————————————
# 11) Test de /threads/{thread_id}
# ————————————————————————————————————————————————————————————————————————————————
def test_get_thread_by_id(client):
    """
    GET /threads/{thread_id} debe devolver solo el thread solicitado, en una lista de un elemento.
    """
    clear_threads_table()
    now = datetime.utcnow().isoformat()
    # Insertar un solo thread
    ids = insert_threads([
        {"title": "Solo", "content": "Contenido", "is_closed": False, "user_id": 9, "date": now, "tags": "t", "img_link": "img_solo", "votes": 7}
    ])
    tid = ids[0]

    response = client.get(f"/threads/{tid}")
    assert response.status_code == 200

    data = response.json()
    # Debe ser lista de largo 1 con los campos correspondientes
    assert isinstance(data, list) and len(data) == 1
    t = data[0]
    assert t["title"] == "Solo"
    assert t["content"] == "Contenido"
    assert not t["is_closed"]
    assert t["votes"] == 7
    assert t["img_link"] == "img_solo"


# ————————————————————————————————————————————————————————————————————————————————
# 12) Test de /threads/updateLike
# ————————————————————————————————————————————————————————————————————————————————
def test_update_like_and_errors(client):
    """
    POST /threads/updateLike debe:
     - Aumentar o disminuir votos según 'direction'
     - Retornar 400 si direction no es 'up' ni 'down'
     - Retornar 404 si thread_id no existe
    """
    clear_threads_table()
    now = datetime.utcnow().isoformat()
    # Insertar un thread con votes=0
    ids = insert_threads([
        {"title": "Votable", "content": "C", "is_closed": False, "user_id": 5, "date": now, "tags": None, "img_link": None, "votes": 0}
    ])
    tid = ids[0]

    # 12.1) Hacer upvote
    response_up = client.post("/threads/updateLike", json={"thread_id": tid, "direction": "up"})
    assert response_up.status_code == 200
    data_up = response_up.json()
    assert "votes" in data_up and data_up["votes"] == 1

    # 12.2) Hacer downvote
    response_down = client.post("/threads/updateLike", json={"thread_id": tid, "direction": "down"})
    assert response_down.status_code == 200
    data_down = response_down.json()
    # Volvió a 0
    assert data_down["votes"] == 0

    # 12.3) Dirección inválida
    response_bad = client.post("/threads/updateLike", json={"thread_id": tid, "direction": "sideways"})
    assert response_bad.status_code == 400

    # 12.4) ID no existente
    response_missing = client.post("/threads/updateLike", json={"thread_id": tid + 999, "direction": "up"})
    assert response_missing.status_code == 404
