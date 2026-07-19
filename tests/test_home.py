from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_homepage_returns_successfully() -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert "AI Solutions" in response.text


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
