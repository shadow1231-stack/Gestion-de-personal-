"""Endpoints de autenticación: únicas rutas públicas (§5)."""

from fastapi import APIRouter, Request, status

from app.api.deps import CurrentUser, DbSession
from app.core.rate_limit import limiter
from app.schemas.common import ApiResponse, Token
from app.schemas.user import UserCreate, UserLogin, UserRead
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, payload: UserCreate, db: DbSession) -> ApiResponse[UserRead]:
    user = auth_service.register(db, payload)
    return ApiResponse(data=UserRead.model_validate(user), message="Usuario registrado")


@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, payload: UserLogin, db: DbSession) -> ApiResponse[Token]:
    token = auth_service.login(db, payload)
    return ApiResponse(data=Token(access_token=token), message="Sesión iniciada")


@router.get("/me")
def me(user: CurrentUser) -> ApiResponse[UserRead]:
    """Devuelve el usuario autenticado (incluye si es administrador)."""
    return ApiResponse(data=UserRead.model_validate(user))
