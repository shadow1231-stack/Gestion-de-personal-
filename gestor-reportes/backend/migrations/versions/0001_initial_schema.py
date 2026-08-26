"""Esquema inicial: users, vehicles, reports

Revision ID: 0001_initial
Revises:
Create Date: 2026-08-26

Equivale a la salida de `alembic revision --autogenerate` sobre los modelos
de app/models. Normalizado con claves foráneas, restricciones de unicidad e
índices de rendimiento (§3 AGENTS.md).
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=120), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "vehicles",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("plate", sa.String(length=15), nullable=False),
        sa.Column("brand", sa.String(length=60), nullable=False),
        sa.Column("model", sa.String(length=60), nullable=False),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_vehicles_owner_id", "vehicles", ["owner_id"], unique=False)
    op.create_index("ix_vehicles_plate", "vehicles", ["plate"], unique=True)

    op.create_table(
        "reports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("author_id", sa.Integer(), nullable=False),
        sa.Column("vehicle_id", sa.Integer(), nullable=True),
        sa.Column(
            "type",
            sa.Enum("PERSONAL", "VEHICULAR", name="reporttype"),
            nullable=False,
        ),
        sa.Column("title", sa.String(length=150), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["vehicle_id"], ["vehicles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_reports_author_id", "reports", ["author_id"], unique=False)
    op.create_index("ix_reports_vehicle_id", "reports", ["vehicle_id"], unique=False)
    op.create_index("ix_reports_type", "reports", ["type"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_reports_type", table_name="reports")
    op.drop_index("ix_reports_vehicle_id", table_name="reports")
    op.drop_index("ix_reports_author_id", table_name="reports")
    op.drop_table("reports")

    op.drop_index("ix_vehicles_plate", table_name="vehicles")
    op.drop_index("ix_vehicles_owner_id", table_name="vehicles")
    op.drop_table("vehicles")

    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")

    # Elimina el tipo ENUM en PostgreSQL (no-op en motores sin tipos nativos).
    sa.Enum(name="reporttype").drop(op.get_bind(), checkfirst=True)
