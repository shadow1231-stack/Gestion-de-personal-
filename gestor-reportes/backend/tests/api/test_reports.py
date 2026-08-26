"""Pruebas de integración de reportes (§6): personal, vehicular y validaciones."""

from collections.abc import Callable

from fastapi.testclient import TestClient

API = "/api/v1"

VEHICLE = {"plate": "XYZ-999", "brand": "Honda", "model": "Civic", "year": 2022}


def _create_vehicle(client: TestClient, headers: dict[str, str]) -> int:
    vehicle_id: int = client.post(f"{API}/vehicles", json=VEHICLE, headers=headers).json()["data"][
        "id"
    ]
    return vehicle_id


def test_create_personal_report_ok(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    headers = auth_headers()
    response = client.post(
        f"{API}/reports",
        json={"type": "personal", "title": "Chequeo", "description": "Todo bien"},
        headers=headers,
    )
    assert response.status_code == 201
    data = response.json()["data"]
    assert data["type"] == "personal"
    assert data["vehicle_id"] is None


def test_create_vehicular_report_ok(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    headers = auth_headers()
    vehicle_id = _create_vehicle(client, headers)
    response = client.post(
        f"{API}/reports",
        json={
            "type": "vehicular",
            "title": "Aceite",
            "description": "10000 km",
            "vehicle_id": vehicle_id,
        },
        headers=headers,
    )
    assert response.status_code == 201
    assert response.json()["data"]["vehicle_id"] == vehicle_id


def test_vehicular_report_without_vehicle_id_is_422(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    headers = auth_headers()
    response = client.post(
        f"{API}/reports",
        json={"type": "vehicular", "title": "Sin vehiculo", "description": "x"},
        headers=headers,
    )
    assert response.status_code == 422
    assert response.json()["success"] is False


def test_vehicular_report_with_foreign_vehicle_is_rejected(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    owner = auth_headers(email="owner2@example.com")
    other = auth_headers(email="other2@example.com")
    vehicle_id = _create_vehicle(client, owner)

    # El otro usuario no puede referenciar un vehículo que no le pertenece (§3).
    response = client.post(
        f"{API}/reports",
        json={
            "type": "vehicular",
            "title": "Ajeno",
            "description": "x",
            "vehicle_id": vehicle_id,
        },
        headers=other,
    )
    assert response.status_code == 400
    assert response.json()["success"] is False


def test_reports_are_isolated_per_user(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    user_a = auth_headers(email="a@example.com")
    user_b = auth_headers(email="b@example.com")
    client.post(
        f"{API}/reports",
        json={"type": "personal", "title": "De A", "description": "x"},
        headers=user_a,
    )

    # B no ve los reportes de A.
    assert client.get(f"{API}/reports", headers=user_b).json()["data"] == []
    titles = [r["title"] for r in client.get(f"{API}/reports", headers=user_a).json()["data"]]
    assert titles == ["De A"]
