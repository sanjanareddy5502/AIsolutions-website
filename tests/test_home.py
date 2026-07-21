from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_public_pages_return_successfully() -> None:
    expected_pages = {
        "/": "Find the friction.",
        "/services": "Practical systems for your next business challenge.",
        "/industries": "Technology grounded in how your business works.",
        "/about": "Technology should make business feel clearer",
        "/contact": "Let’s talk about what could work better.",
        "/book": "Bring the problem.",
    }
    for path, heading in expected_pages.items():
        response = client.get(path)
        assert response.status_code == 200
        assert heading in response.text


def test_homepage_contains_primary_experiences() -> None:
    response = client.get("/")
    assert "Business problem lab" in response.text
    assert "Applied AI lab" in response.text
    assert 'href="/book"' in response.text


def test_booking_fallback_without_environment_url(monkeypatch) -> None:
    monkeypatch.delenv("BOOKING_PAGE_URL", raising=False)
    response = client.get("/book")
    assert "Online scheduling is being connected." in response.text
    assert "<iframe" not in response.text


def test_booking_iframe_with_environment_url(monkeypatch) -> None:
    monkeypatch.setenv("BOOKING_PAGE_URL", "https://calendar.google.com/example")
    response = client.get("/book")
    assert 'src="https://calendar.google.com/example"' in response.text
    assert "<iframe" in response.text


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}