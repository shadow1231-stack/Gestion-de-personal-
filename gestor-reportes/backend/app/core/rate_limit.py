"""Limitación de peticiones por IP en rutas críticas (§5 AGENTS.md)."""

from slowapi import Limiter
from slowapi.util import get_remote_address

# Límite global por defecto; los endpoints críticos pueden reforzarlo
# con el decorador `@limiter.limit("5/minute")`.
limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
