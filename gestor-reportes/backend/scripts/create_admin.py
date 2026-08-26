"""Promueve un usuario existente a administrador (o lo crea si no existe).

Uso:
    python scripts/create_admin.py <email> [password]

- Garantiza que existan los roles por defecto.
- Si el usuario existe, le asigna el rol 'admin'.
- Si no existe y se pasa una contraseña, lo crea con el rol 'admin'.
"""

import sys

from app.core.security import hash_password
from app.db.seed import ensure_default_roles
from app.db.session import SessionLocal
from app.repositories import role_repo, user_repo


def main() -> None:
    if len(sys.argv) < 2:
        print("Uso: python scripts/create_admin.py <email> [password]")
        raise SystemExit(1)

    email = sys.argv[1]
    db = SessionLocal()
    try:
        ensure_default_roles(db)
        admin_role = role_repo.get_by_name(db, "admin")
        if admin_role is None:
            print("No se pudo encontrar el rol 'admin'.")
            raise SystemExit(1)

        user = user_repo.get_by_email(db, email)
        if user is None:
            if len(sys.argv) < 3:
                print(f"El usuario {email} no existe. Pasa una contraseña para crearlo.")
                raise SystemExit(1)
            user = user_repo.create(
                db,
                email=email,
                full_name="Administrador",
                hashed_password=hash_password(sys.argv[2]),
                role_id=admin_role.id,
            )
        else:
            user.role_id = admin_role.id
            db.commit()
        print(f"OK: {email} ahora tiene el rol 'admin'.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
