"""Agregador de routers de la versión 1 de la API (§5)."""

from fastapi import APIRouter

from app.api.v1 import auth, reports, vehicles

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(vehicles.router)
api_router.include_router(reports.router)
