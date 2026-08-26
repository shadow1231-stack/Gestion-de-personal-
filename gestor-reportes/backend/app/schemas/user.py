"""Esquemas Pydantic para usuarios (§2 tipado, §4 validación)."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    is_active: bool
    is_admin: bool


class UserUpdate(BaseModel):
    """Actualización parcial de un usuario por un administrador."""

    full_name: str | None = Field(default=None, min_length=1, max_length=120)
    email: EmailStr | None = None
    is_active: bool | None = None
    is_admin: bool | None = None
