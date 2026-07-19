from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_public_pages_return_successfully_with_expected_headings() -> None:
    expected_pages = {
        "/": "Smarter systems for businesses ready to",
        "/services": "Practical systems for your next business challenge.",
        "/industries": "Technology grounded in how your business works.",
        "/about": "Technology should make business feel clearer",
        "/contact": "Let’s talk about what could work better.",
    }

    for path, heading in expected_pages.items():
        response = client.get(path)
        assert response.status_code == 200
        assert heading in response.text


def test_health_check() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
