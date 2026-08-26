"""Pruebas de integración de vehículos (§6), incluida la propiedad por usuario."""

from collections.abc import Callable

from fastapi.testclient import TestClient

API = "/api/v1"

VEHICLE = {"plate": "ABC-123", "brand": "Toyota", "model": "Corolla", "year": 2020}


def test_create_vehicle_ok(client: TestClient, auth_headers: Callable[..., dict[str, str]]) -> None:
    headers = auth_headers()
    response = client.post(f"{API}/vehicles", json=VEHICLE, headers=headers)
    assert response.status_code == 201
    data = response.json()["data"]
    assert data["plate"] == "ABC-123"
    assert data["id"] > 0


def test_create_vehicle_requires_auth(client: TestClient) -> None:
    response = client.post(f"{API}/vehicles", json=VEHICLE)
    assert response.status_code == 401


def test_list_vehicles_returns_own(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    headers = auth_headers()
    client.post(f"{API}/vehicles", json=VEHICLE, headers=headers)
    response = client.get(f"{API}/vehicles", headers=headers)
    assert response.status_code == 200
    plates = [v["plate"] for v in response.json()["data"]]
    assert plates == ["ABC-123"]


def test_get_vehicle_ok(client: TestClient, auth_headers: Callable[..., dict[str, str]]) -> None:
    headers = auth_headers()
    created = client.post(f"{API}/vehicles", json=VEHICLE, headers=headers).json()["data"]
    response = client.get(f"{API}/vehicles/{created['id']}", headers=headers)
    assert response.status_code == 200
    assert response.json()["data"]["id"] == created["id"]


def test_cannot_access_other_users_vehicle(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    owner = auth_headers(email="owner@example.com")
    other = auth_headers(email="other@example.com")
    created = client.post(f"{API}/vehicles", json=VEHICLE, headers=owner).json()["data"]

    # El otro usuario no puede ver el vehículo ajeno (§3 aislamiento por dueño).
    response = client.get(f"{API}/vehicles/{created['id']}", headers=other)
    assert response.status_code == 404

    # Y su listado sale vacío.
    assert client.get(f"{API}/vehicles", headers=other).json()["data"] == []
