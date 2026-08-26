"""Pruebas de integración de autenticación (§6: flujos correctos y de error)."""

from fastapi.testclient import TestClient

API = "/api/v1"


def test_register_ok(client: TestClient) -> None:
    response = client.post(
        f"{API}/auth/register",
        json={"email": "nuevo@example.com", "full_name": "Nuevo", "password": "Password123"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["success"] is True
    assert body["data"]["email"] == "nuevo@example.com"
    # La contraseña nunca se devuelve al cliente (§3).
    assert "password" not in body["data"]
    assert "hashed_password" not in body["data"]


def test_register_duplicate_email(client: TestClient) -> None:
    payload = {"email": "dup@example.com", "full_name": "Dup", "password": "Password123"}
    client.post(f"{API}/auth/register", json=payload)
    response = client.post(f"{API}/auth/register", json=payload)
    assert response.status_code == 400
    assert response.json()["success"] is False


def test_register_invalid_email_uniform_envelope(client: TestClient) -> None:
    response = client.post(
        f"{API}/auth/register",
        json={"email": "no-es-email", "full_name": "X", "password": "Password123"},
    )
    assert response.status_code == 422
    body = response.json()
    # Envoltura uniforme, no el formato por defecto de FastAPI (§5).
    assert set(body.keys()) == {"success", "data", "message"}
    assert body["success"] is False


def test_login_ok(client: TestClient) -> None:
    client.post(
        f"{API}/auth/register",
        json={"email": "log@example.com", "full_name": "Log", "password": "Password123"},
    )
    response = client.post(
        f"{API}/auth/login", json={"email": "log@example.com", "password": "Password123"}
    )
    assert response.status_code == 200
    assert response.json()["data"]["token_type"] == "bearer"
    assert response.json()["data"]["access_token"]


def test_login_wrong_password(client: TestClient) -> None:
    client.post(
        f"{API}/auth/register",
        json={"email": "wp@example.com", "full_name": "WP", "password": "Password123"},
    )
    response = client.post(
        f"{API}/auth/login", json={"email": "wp@example.com", "password": "incorrecta"}
    )
    assert response.status_code == 401
    assert response.json()["success"] is False


def test_login_nonexistent_user(client: TestClient) -> None:
    response = client.post(
        f"{API}/auth/login", json={"email": "nadie@example.com", "password": "Password123"}
    )
    assert response.status_code == 401


def test_protected_endpoint_requires_token(client: TestClient) -> None:
    response = client.get(f"{API}/reports")
    assert response.status_code == 401
    assert response.json()["success"] is False


def test_protected_endpoint_rejects_invalid_token(client: TestClient) -> None:
    # Token con formato inválido.
    response = client.get(f"{API}/reports", headers={"Authorization": "Bearer no-valido"})
    assert response.status_code == 401
