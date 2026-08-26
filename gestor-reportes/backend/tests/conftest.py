"""Fixtures compartidas de pruebas.

Configura una BD SQLite en memoria y un TestClient con la sesión sobreescrita,
de modo que las pruebas de integración no dependan de PostgreSQL ni de Docker
(rápido y reproducible en CI). Las variables de entorno se fijan antes de
importar la app para que `get_settings()` no dependa de un `.env` real.
"""

import os

os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("JWT_SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("ENVIRONMENT", "test")

from collections.abc import Callable, Iterator  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import Engine, create_engine, select, update  # noqa: E402
from sqlalchemy.orm import Session, sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

import app.models  # noqa: E402, F401  (registra las tablas en la metadata)
from app.core.rate_limit import limiter  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.seed import ensure_default_roles  # noqa: E402
from app.db.session import get_db  # noqa: E402
from app.main import app  # noqa: E402

API = "/api/v1"


@pytest.fixture
def engine() -> Iterator[Engine]:
    """Motor SQLite en memoria compartido durante toda la prueba."""
    eng = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(eng)
    with Session(eng) as session:
        ensure_default_roles(session)
    yield eng
    Base.metadata.drop_all(eng)
    eng.dispose()


@pytest.fixture
def client(engine: Engine) -> Iterator[TestClient]:
    """TestClient con la sesión de BD sobreescrita y rate limiting desactivado."""
    testing_session = sessionmaker(bind=engine, autoflush=False, autocommit=False)

    def override_get_db() -> Iterator[object]:
        db = testing_session()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    limiter.enabled = False
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    limiter.enabled = True


@pytest.fixture
def auth_headers(client: TestClient) -> Callable[..., dict[str, str]]:
    """Factory que registra e inicia sesión, devolviendo la cabecera Authorization."""

    def _make(
        email: str = "user@example.com",
        password: str = "SuperSecret123",
        full_name: str = "Usuario Prueba",
    ) -> dict[str, str]:
        client.post(
            f"{API}/auth/register",
            json={"email": email, "full_name": full_name, "password": password},
        )
        response = client.post(f"{API}/auth/login", json={"email": email, "password": password})
        token = response.json()["data"]["access_token"]
        return {"Authorization": f"Bearer {token}"}

    return _make


@pytest.fixture
def admin_headers(
    engine: Engine, auth_headers: Callable[..., dict[str, str]]
) -> Callable[..., dict[str, str]]:
    """Factory que crea un usuario, le asigna el rol 'admin' y devuelve su cabecera."""
    from app.models.role import Role
    from app.models.user import User

    def _make(email: str = "admin@example.com", password: str = "AdminPass123") -> dict[str, str]:
        headers = auth_headers(email=email, password=password, full_name="Admin")
        with Session(engine) as session:
            admin_role_id = session.scalar(select(Role.id).where(Role.name == "admin"))
            session.execute(update(User).where(User.email == email).values(role_id=admin_role_id))
            session.commit()
        return headers

    return _make
