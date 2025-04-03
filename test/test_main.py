import sys
import os

# Agrega la raíz del proyecto al sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))

from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 404  # O ajusta según tu API

def test_read_main():
    response = client.get("/db/structure")
    assert response.status_code == 200
    assert response.json() == {"message": "Database structure printed to the console"}