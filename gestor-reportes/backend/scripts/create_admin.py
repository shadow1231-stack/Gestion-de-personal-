"""Promueve un usuario existente a administrador (o lo crea si no existe).

Uso:
    python scripts/create_admin.py <email> [password]

- Si el usuario existe, lo marca como administrador.
- Si no existe y se pasa una contraseña, lo crea como administrador.
"""

import sys

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.repositories import user_repo


def main() -> None:
    if len(sys.argv) < 2:
        print("Uso: python scripts/create_admin.py <email> [password]")
        raise SystemExit(1)

    email = sys.argv[1]
    db = SessionLocal()
    try:
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
            )
        user.is_admin = True
        db.commit()
        print(f"OK: {email} ahora es administrador.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
