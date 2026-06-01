# Guía de Instalación y Configuración

## Requisitos Previos

- Node.js 22+ 
- Docker y Docker Compose
- PostgreSQL (si ejecutas sin Docker)

## Instalación Local

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd miganaderia
```

### 2. Configurar variables de entorno

#### Backend
```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=http://localhost:5432
SUPABASE_KEY=your_key
JWT_SECRET=your_secret_change_in_production
CORS_ORIGIN=http://localhost:5173
```

#### Frontend
```bash
cp frontend/.env.example frontend/.env
```

Editar `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Instalar dependencias

#### Backend
```bash
cd backend
npm install
cd ..
```

#### Frontend
```bash
cd frontend
npm install
cd ..
```

### 4. Ejecutar con Docker Compose

```bash
docker-compose -f docker/docker-compose.yml up -d
```

Esperar a que los servicios estén listos:
- PostgreSQL: puerto 5432
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173 (ejecutar por separado)

### 5. Ejecutar Frontend en desarrollo (en otra terminal)

```bash
cd frontend
npm run dev
```

El frontend estará disponible en: http://localhost:5173

## Credenciales de Prueba

- **Email**: isaez@valdelapena.es
- **Contraseña**: ManoloSanchis
- **Ganadería**: Valdelapeña

## Estructura de la API

### Endpoints de Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/me` - Obtener datos del usuario actual
- `POST /api/auth/change-password` - Cambiar contraseña

### Endpoints de Ganaderías

- `GET /api/tenants` - Obtener todas las ganaderías
- `POST /api/tenants` - Crear nueva ganadería (admin)
- `GET /api/tenants/:tenantId` - Obtener ganadería específica
- `PUT /api/tenants/:tenantId` - Actualizar ganadería

## Desarrollo

### Backend en modo desarrollo
```bash
cd backend
npm run dev
```

### Frontend en modo desarrollo
```bash
cd frontend
npm run dev
```

### Build para producción

#### Backend
```bash
cd backend
npm run build
```

#### Frontend
```bash
cd frontend
npm run build
```

## Deployment

### Vercel (Frontend)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. Deploy automático

### Railway o Render (Backend)

1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

## Troubleshooting

### Error de conexión a la BD
- Verificar que PostgreSQL está corriendo
- Verificar credenciales en .env
- Ejecutar migrations si es necesario

### Error de CORS
- Verificar CORS_ORIGIN en backend/.env
- Debe coincidir con URL del frontend

### Token inválido
- Limpiar localStorage
- Logout y volver a login
- Verificar JWT_SECRET en backend

## Próximos Pasos

- [ ] Configurar Supabase en cloud
- [ ] Implementar gestión de animales
- [ ] Crear módulo veterinario
- [ ] Implementar permisos y roles
- [ ] Setup CI/CD pipeline
