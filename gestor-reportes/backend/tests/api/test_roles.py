"""Pruebas de integración de la gestión de roles (RBAC, §6)."""

from collections.abc import Callable

from fastapi.testclient import TestClient

API = "/api/v1"


def _role_id(client: TestClient, admin: dict[str, str], name: str) -> int:
    roles = client.get(f"{API}/admin/roles", headers=admin).json()["data"]
    return next(r["id"] for r in roles if r["name"] == name)


def test_non_admin_cannot_manage_roles(
    client: TestClient, auth_headers: Callable[..., dict[str, str]]
) -> None:
    headers = auth_headers()
    assert client.get(f"{API}/admin/roles", headers=headers).status_code == 403


def test_admin_lists_default_roles(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()
    names = [r["name"] for r in client.get(f"{API}/admin/roles", headers=admin).json()["data"]]
    assert {"admin", "gestor", "usuario"} <= set(names)


def test_permissions_catalog(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()
    perms = client.get(f"{API}/admin/permissions", headers=admin).json()["data"]
    assert "users.manage" in perms
    assert "roles.manage" in perms


def test_create_update_delete_role(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()

    created = client.post(
        f"{API}/admin/roles",
        json={"name": "auditor", "description": "Solo lectura", "permissions": ["users.manage"]},
        headers=admin,
    )
    assert created.status_code == 201
    role_id = created.json()["data"]["id"]

    updated = client.patch(
        f"{API}/admin/roles/{role_id}",
        json={"permissions": []},
        headers=admin,
    )
    assert updated.status_code == 200
    assert updated.json()["data"]["permissions"] == []

    deleted = client.delete(f"{API}/admin/roles/{role_id}", headers=admin)
    assert deleted.status_code == 200


def test_create_role_rejects_invalid_permission(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()
    response = client.post(
        f"{API}/admin/roles",
        json={"name": "raro", "permissions": ["no.existe"]},
        headers=admin,
    )
    assert response.status_code == 422


def test_cannot_delete_system_role(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()
    admin_role_id = _role_id(client, admin, "admin")
    response = client.delete(f"{API}/admin/roles/{admin_role_id}", headers=admin)
    assert response.status_code == 400
    assert response.json()["success"] is False


def test_cannot_delete_role_in_use(
    client: TestClient, admin_headers: Callable[..., dict[str, str]]
) -> None:
    admin = admin_headers()
    # 'usuario' es el rol por defecto y el admin_headers dejó al menos un usuario con él.
    gestor_id = _role_id(client, admin, "gestor")
    client.post(
        f"{API}/admin/users",
        json={
            "email": "eng@example.com",
            "full_name": "Eng",
            "password": "Password123",
            "role_id": gestor_id,
        },
        headers=admin,
    )
    response = client.delete(f"{API}/admin/roles/{gestor_id}", headers=admin)
    assert response.status_code == 400
