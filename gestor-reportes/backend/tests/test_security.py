"""Pruebas unitarias de seguridad: hashing y JWT (§6)."""

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_hash_roundtrip_ok() -> None:
    # Flujo correcto: una contraseña verifica contra su propio hash.
    hashed = hash_password("SuperSecreta123")
    assert hashed != "SuperSecreta123"
    assert verify_password("SuperSecreta123", hashed) is True


def test_password_verify_wrong_returns_false() -> None:
    # Escenario de error: contraseña incorrecta no verifica.
    hashed = hash_password("SuperSecreta123")
    assert verify_password("otra-clave", hashed) is False


def test_access_token_roundtrip_ok() -> None:
    # Flujo correcto: el subject del token se recupera intacto.
    token = create_access_token(subject="42")
    assert decode_access_token(token) == "42"


def test_decode_invalid_token_returns_none() -> None:
    # Escenario de error: token corrupto devuelve None, no lanza.
    assert decode_access_token("no-es-un-jwt-valido") is None
