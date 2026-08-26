#AGENTS.md - Directrices Maestras de Seguridad, Arquitectura y Calidad

Este documento establece las leyes inquebrantables de ingeniería, arquitectura y ciberseguridad que cualquier asistente de IA (Claude Code, agentes CLI, etc.) debe cumplir obligatoriamente al desarrollar o modificar este proyecto.

---

## 1. Arquitectura y Modularización (architecture.mdc)
- *Independencia de Capas:* Separa estrictamente la lógica de negocio, la interfaz de usuario y el acceso a datos en carpetas independientes.
- *Tamaño de Archivos:* Prohibido crear archivos gigantes de más de 300 líneas. Si un archivo crece, modularízalo en componentes pequeños y reutilizables.
- *Limpieza de Código:* Prohibido dejar código comentado, tareas pendientes huérfanas (TODO) o código muerto.

---

## 2. Calidad y Tipado Estricto (quality.mdc)
- *Tipado Obligatorio:* Utiliza tipado estricto en todo el código (TypeScript, Python con type hints, etc.). No uses tipos any genéricos o ambiguos sin una justificación explícita.
- *Formateadores Automáticos:* El código generado debe cumplir con los formateadores automáticos del proyecto sin excepciones.

---

## 3. Seguridad Interna y Base de Datos (security.mdc / database.mdc)
- *Cero Inyección SQL:* Está estrictamente prohibido usar consultas SQL escritas a mano o mediante concatenación de textos. Es OBLIGATORIO utilizar un ORM (como Prisma, SQLAlchemy, TypeORM) o consultas parametrizadas seguras.
- *Gestión de Secretos:* Nunca escribas contraseñas, tokens, llaves de API o credenciales directamente en el código fuente. Utiliza siempre variables de entorno.
- *Contraseñas Seguras:* Las contraseñas de los usuarios deben ser hasheadas obligatoriamente con algoritmos seguros (bcrypt o Argon2). Nunca se guardan en texto plano.
- *Esquemas y Migraciones:* Diseña bases de datos normalizadas con claves foráneas, restricciones de unicidad e índices de rendimiento. Todo cambio en producción debe realizarse mediante migraciones versionadas y controladas.
- *Manejo de Errores:* Captura excepciones específicas. Nunca dejes bloques de control de errores vacíos (try/catch silenciosos) ni expongas mensajes internos del servidor al usuario final.

---

## 4. Frontend y Seguridad Web (frontend.mdc)
- *Componentes Modulares:* Cada vista debe dividirse en componentes pequeños, reutilizables y ubicados en su propia carpeta (Mobile-First).
- *Cero Secretos en el Cliente:* Prohibido incluir llaves privadas o credenciales en el código del frontend. Todo secreto vive exclusivamente en el servidor.
- *Prevención de XSS:* Utiliza mecanismos nativos del framework para escapar texto de manera segura (nunca inyectues HTML crudo sin sanitizar).

---

## 5. APIs y Seguridad Perimetral (api.mdc)
- *Estilo REST Estricto:* Utiliza los verbos HTTP correctamente (GET, POST, PUT/PATCH, DELETE) con respuestas JSON uniformes (success, data, message).
- *Autenticación Requerida:* Ningún endpoint (salvo login/registro) puede ser público. Es obligatorio validar tokens de acceso (JWT).
- *Rate Limiting y CORS:* Implementa límites de llamadas por IP en rutas críticas e incluye políticas CORS restrictivas para el dominio oficial.

---

## 6. Pruebas Unitarias Obligatorias (testing.mdc)
- *Validación Matemática:* Cada vez que crees o modifiques una función o componente, DEBES incluir su respectiva prueba unitaria automatizada (PyTest, Jest, etc.).
- *Escenarios de Error:* Ningún código se considerará terminado si las pruebas no cubren tanto los flujos correctos como los escenarios de fallo.

---

## 7. DevOps y Monitoreo (devops.mdc)
- *Monitoreo en Tiempo Real:* Es obligatorio integrar un sistema de captura de excepciones en producción (como Sentry).
- *Logs Estructurados:* Prohibido usar impresiones de consola simples (console.log). Utiliza logging estructurado con niveles de severidad.
- *Compatibilidad Cloud:* Diseña la app para operar de manera transparente detrás de proxies inversos y escudos perimetrales (como Cloudflare) y contenedores aislados (Docker).
-
