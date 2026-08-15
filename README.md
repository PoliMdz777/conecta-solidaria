# ConectaSolidaria

Plataforma web que conecta personas que necesitan ayuda con voluntarios y donantes.
Stack: MongoDB, Express, React, Node.js (MERN)

## Integrantes
- PoliMdz777

## Descripción
ConectaSolidaria permite publicar necesidades de ayuda (alimentos, ropa, medicinas, voluntariado),
explorarlas con filtros, y registrar donaciones o voluntariados. Incluye autenticación JWT,
panel de administración y sistema de logging.

## Estructura de carpetas
conecta-solidaria/
├── backend/
│ ├── controllers/ # Lógica de negocio (auth, necesidades, donaciones, voluntariados, usuarios, reportes, organizaciones, notificaciones)
│ ├── middlewares/ # auth.js (verificación JWT), isAdmin.js (control de acceso por rol)
│ ├── models/ # Esquemas Mongoose (6+ colecciones: User, Necesidad, Donacion, Voluntariado, Organizacion, Notificacion)
│ ├── routes/ # Definición de endpoints REST por recurso
│ ├── utils/ # logger.js (configuración de Winston)
│ ├── logs/ # errors.log, transactions.log
│ ├── seed.js # Script de datos de prueba
│ └── server.js # Punto de entrada del servidor Express
└── frontend/
└── src/
├── components/ # Navbar, NecesidadCard (componentes reutilizables)
├── context/ # AuthContext (manejo de sesión JWT)
├── pages/ # Landing, Login, Register, Dashboard, Detalle, CrearNecesidad, Perfil, Admin, Reportes, Organizaciones, Notificaciones
└── services/ # Llamadas a la API vía Axios (una por recurso)


## Endpoints principales

Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.

| Recurso | Rutas |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Necesidades | CRUD completo en `/api/necesidades` |
| Donaciones | `GET`, `POST /api/donaciones` |
| Voluntariados | `GET`, `POST /api/voluntariados` |
| Usuarios | `/api/usuarios/me`, `/api/usuarios` (admin), `PATCH /api/usuarios/:id/verificar` |
| Organizaciones | CRUD completo (soft-delete) en `/api/organizaciones` |
| Notificaciones | CRUD completo (soft-delete) en `/api/notificaciones` |
| Reportes | 4 consultas agregadas en `/api/reportes/*` (solo admin) |



## Tecnologías

- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, express-validator, Winston
- **Frontend:** React, Material UI v5, React Router v6, Axios
- **Base de datos:** MongoDB Atlas