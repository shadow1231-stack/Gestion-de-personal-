"""Esquemas Pydantic para roles (§2 tipado, §4 validación)."""

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.core.permissions import is_valid_permission


class RoleRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    permissions: list[str]
    is_system: bool
    is_default: bool


class RoleCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    description: str = Field(default="", max_length=200)
    permissions: list[str] = Field(default_factory=list)

    @field_validator("permissions")
    @classmethod
    def _valid_permissions(cls, value: list[str]) -> list[str]:
        invalid = [p for p in value if not is_valid_permission(p)]
        if invalid:
            raise ValueError(f"Permisos inválidos: {', '.join(invalid)}")
        return value


class RoleUpdate(BaseModel):
    description: str | None = Field(default=None, max_length=200)
    permissions: list[str] | None = None

    @field_validator("permissions")
    @classmethod
    def _valid_permissions(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return None
        invalid = [p for p in value if not is_valid_permission(p)]
        if invalid:
            raise ValueError(f"Permisos inválidos: {', '.join(invalid)}")
        return value
