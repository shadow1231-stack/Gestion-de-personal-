"""RBAC dinámico: tabla roles y users.role_id (migra is_admin)

Revision ID: 0003_roles_rbac
Revises: 0002_add_is_admin
Create Date: 2026-08-26
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003_roles_rbac"
down_revision: str | None = "0002_add_is_admin"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "roles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=50), nullable=False),
        sa.Column("description", sa.String(length=200), nullable=False, server_default=""),
        sa.Column("permissions", sa.JSON(), nullable=False),
        sa.Column("is_system", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("is_default", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_roles_name", "roles", ["name"], unique=True)

    roles = sa.table(
        "roles",
        sa.column("name", sa.String),
        sa.column("description", sa.String),
        sa.column("permissions", sa.JSON),
        sa.column("is_system", sa.Boolean),
        sa.column("is_default", sa.Boolean),
    )
    op.bulk_insert(
        roles,
        [
            {
                "name": "admin",
                "description": "Acceso total al sistema",
                "permissions": ["users.manage", "roles.manage"],
                "is_system": True,
                "is_default": False,
            },
            {
                "name": "gestor",
                "description": "Gestiona usuarios",
                "permissions": ["users.manage"],
                "is_system": False,
                "is_default": False,
            },
            {
                "name": "usuario",
                "description": "Acceso básico a la aplicación",
                "permissions": [],
                "is_system": True,
                "is_default": True,
            },
        ],
    )

    op.add_column("users", sa.Column("role_id", sa.Integer(), nullable=True))
    op.create_index("ix_users_role_id", "users", ["role_id"])

    # Backfill: admins previos -> rol admin; el resto -> rol usuario.
    op.execute(
        "UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin') "
        "WHERE is_admin = true"
    )
    op.execute(
        "UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'usuario') "
        "WHERE role_id IS NULL"
    )

    op.alter_column("users", "role_id", existing_type=sa.Integer(), nullable=False)
    op.create_foreign_key("fk_users_role_id", "users", "roles", ["role_id"], ["id"])
    op.drop_column("users", "is_admin")


def downgrade() -> None:
    op.add_column(
        "users",
        sa.Column("is_admin", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.execute(
        "UPDATE users SET is_admin = true "
        "WHERE role_id = (SELECT id FROM roles WHERE name = 'admin')"
    )
    op.drop_constraint("fk_users_role_id", "users", type_="foreignkey")
    op.drop_index("ix_users_role_id", table_name="users")
    op.drop_column("users", "role_id")
    op.drop_index("ix_roles_name", table_name="roles")
    op.drop_table("roles")
