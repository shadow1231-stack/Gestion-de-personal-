"""Pruebas de integración del panel de administración (§6, autorización por rol)."""

from collections.abc import Callable

from fastapi.testclient import TestClient

API = "/api/v1"


def _user_id(client: TestClient, admin: dict[str, str], email: str) -> int:
    users = client.get(f"{API}/admin/users", headers=admin).json()["data"]
    return next(u["id"] for u in users if u["email"] == email)


def test_non_admin_cannot_list_users(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    headers = auth_headers()
    response = client.get(f"{API}/admin/users", headers=headers)
    assert response.status_code == 403
    assert response.json()["success"] is False


def test_admin_lists_users(
    client: TestClient,
    admin_headers: Callable[..., dict[str, str]],
    auth_headers: Callable[..., dict[str, str]],
) -> None:
    admin = admin_headers()
    auth_headers(email="otro@example.com")
    response = client.get(f"{API}/admin/users", headers=admin)
    assert response.status_code == 200
    emails = [u["email"] for u in response.json()["data"]]
    assert "admin@example.com" in emails
    assert "otro@example.com" in emails


def test_me_reports_admin_flag(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()
    response = client.get(f"{API}/auth/me", headers=admin)
    assert response.status_code == 200
    assert response.json()["data"]["is_admin"] is True


def test_admin_updates_user(
    client: TestClient,
    admin_headers: Callable[..., dict[str, str]],
    auth_headers: Callable[..., dict[str, str]],
) -> None:
    admin = admin_headers()
    auth_headers(email="edit@example.com")
    target = _user_id(client, admin, "edit@example.com")

    response = client.patch(
        f"{API}/admin/users/{target}",
        json={"full_name": "Nombre Editado", "is_active": False},
        headers=admin,
    )
    assert response.status_code == 200
    data = response.json()["data"]
    assert data["full_name"] == "Nombre Editado"
    assert data["is_active"] is False


def test_admin_deletes_user(
    client: TestClient,
    admin_headers: Callable[..., dict[str, str]],
    auth_headers: Callable[..., dict[str, str]],
) -> None:
    admin = admin_headers()
    auth_headers(email="borrar@example.com")
    target = _user_id(client, admin, "borrar@example.com")

    response = client.delete(f"{API}/admin/users/{target}", headers=admin)
    assert response.status_code == 200
    assert response.json()["success"] is True

    emails = [u["email"] for u in client.get(f"{API}/admin/users", headers=admin).json()["data"]]
    assert "borrar@example.com" not in emails


def test_admin_cannot_delete_self(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()
    own_id = client.get(f"{API}/auth/me", headers=admin).json()["data"]["id"]
    response = client.delete(f"{API}/admin/users/{own_id}", headers=admin)
    assert response.status_code == 400
    assert response.json()["success"] is False
