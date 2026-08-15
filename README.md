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

## Instrucciones de ejecución

### Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta en MongoDB Atlas (tier gratuito M0 es suficiente)

### 1. Clonar el repositorio

```bash
git clone https://github.com/PoliMdz777/conecta-solidaria.git
cd conecta-solidaria
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend/` con:

PORT=4000
MONGODB_URI=<tu cadena de conexión de MongoDB Atlas>
JWT_SECRET=<tu clave secreta>
NODE_ENV=development


Iniciar el servidor:

```bash
npm start
```

Deberías ver en la terminal:

INFO: Conectado a MongoDB Atlas
INFO: Servidor corriendo en puerto 4000


### 3. Poblar la base de datos (opcional, en otra terminal)

```bash
cd backend
node seed.js
```

Esto crea usuarios de prueba, incluyendo un administrador.

### 4. Configurar el frontend

En una terminal nueva:

```bash
cd frontend
npm install
npm start
```

La aplicación se abre automáticamente en `http://localhost:3000`.

### 5. Verificar que el backend responde

Con el backend corriendo, abre en el navegador:

http://localhost:4000/api/health


Deberías ver: `{ "status": "OK", "message": "Backend funcionando correctamente" }`

## Tecnologías

- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, express-validator, Winston
- **Frontend:** React, Material UI v5, React Router v6, Axios
- **Base de datos:** MongoDB Atlas