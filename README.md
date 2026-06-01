# MiGanaderÍa - SaaS Multitenant para Ganaderías de Toros de Lidia

Sistema moderno de gestión para ganaderías de toros de lidia con arquitectura multitenant, permitiendo acceso especial para veterinarios.

## Stack Tecnológico

- **Frontend**: React 18 + Vite + Tailwind CSS + React Toastify
- **Backend**: Node.js + Express
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: JWT
- **Deployment**: 
  - Local: Docker Compose
  - Cloud: Vercel (Frontend), Railway/Render (Backend)

## 🚀 Inicio Rápido

### Windows
```bash
start.bat
```

### macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual
```bash
# Instalar dependencias
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Crear archivos de configuración
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Iniciar Docker
docker-compose -f docker/docker-compose.yml up -d

# En otra terminal: iniciar frontend
cd frontend && npm run dev
```

## 📍 Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔐 Credenciales de Prueba

```
Email: isaez@valdelapena.es
Contraseña: ManoloSanchis
Ganadería: Valdelapeña
```

## 📁 Estructura del Proyecto

```
miganaderia/
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── config/       # Configuración (JWT, Supabase)
│   │   ├── controllers/  # Controladores
│   │   ├── middleware/   # Middlewares (Auth, Tenant)
│   │   ├── routes/       # Rutas (Auth, Tenants)
│   │   ├── models/       # Modelos de datos
│   │   ├── services/     # Servicios de negocio
│   │   └── utils/        # Utilidades
│   ├── scripts/          # Scripts útiles
│   └── package.json
├── frontend/             # React App
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas (Login, Dashboard)
│   │   ├── contexts/     # Contextos (Auth)
│   │   ├── hooks/        # Hooks
│   │   ├── services/     # Servicios API
│   │   ├── styles/       # Estilos globales
│   │   └── assets/       # Assets
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── init.sql          # Schema inicial + datos de prueba
├── docs/                 # Documentación
│   ├── INSTALLATION.md   # Guía de instalación
│   ├── ARCHITECTURE.md   # Arquitectura del sistema
│   └── PROJECT_STATUS.md # Estado del proyecto
├── start.sh              # Script de inicio (Linux/Mac)
├── start.bat             # Script de inicio (Windows)
└── QUICK_START.md        # Guía rápida
```

## ✨ Features Implementados

- ✅ Autenticación JWT con credenciales
- ✅ Sistema multitenant completamente aislado
- ✅ Gestión de usuarios con roles (user, veterinarian, admin)
- ✅ Usuarios especiales (veterinarios) con acceso multi-tenant
- ✅ UI moderna y responsiva con Tailwind CSS
- ✅ Notificaciones con React Toastify
- ✅ Docker Compose para desarrollo local
- ✅ Preparado para deployment en Vercel + Railway/Render
- ✅ Contraseñas hasheadas con bcryptjs
- ✅ CORS configurado
- ✅ Middleware de autenticación y autorización

## 🔧 Endpoints API

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/me` - Obtener datos del usuario actual
- `POST /api/auth/change-password` - Cambiar contraseña

### Ganaderías (Tenants)
- `GET /api/tenants` - Obtener todas las ganaderías
- `POST /api/tenants` - Crear nueva ganadería
- `GET /api/tenants/:tenantId` - Obtener ganadería específica
- `PUT /api/tenants/:tenantId` - Actualizar ganadería
- `GET /api/tenants/:userId/veterinarian` - Ganaderías de un veterinario

## 📊 Esquema de Base de Datos

### Tablas Principales
- `tenants` - Ganaderías
- `users` - Usuarios con tipos (user, veterinarian, admin)
- `veterinarian_tenants` - Relación veterinarios-ganaderías
- `animals` - Animales (toros, vacas, becerros)
- `veterinary_records` - Registros médicos

## 🔐 Seguridad

- Contraseñas hasheadas con bcryptjs (salt 10)
- JWT firmados y con expiración
- Isolamiento de datos por tenant
- CORS configurado
- Middleware de autorización por rol

## 📚 Documentación Completa

- [Guía de Instalación Detallada](./docs/INSTALLATION.md)
- [Arquitectura del Sistema](./docs/ARCHITECTURE.md)
- [Estado del Proyecto](./docs/PROJECT_STATUS.md)
- [Guía Rápida](./QUICK_START.md)

## 🛠️ Desarrollo

### Backend en desarrollo
```bash
cd backend
npm run dev
```

### Frontend en desarrollo
```bash
cd frontend
npm run dev
```

### Ver logs de Docker
```bash
docker-compose -f docker/docker-compose.yml logs -f
```

### Detener servicios
```bash
docker-compose -f docker/docker-compose.yml down
```

## 🎯 Próximos Pasos

1. Implementar módulo de Animales
2. Implementar módulo Veterinario
3. Crear dashboard con estadísticas
4. Gestión avanzada de usuarios
5. Sistema de permisos granulares
6. Reportes y exportación de datos
7. Integración con Supabase en producción
8. Setup CI/CD pipeline

## 🚀 Deployment

### Frontend en Vercel
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático

### Backend en Railway/Render
1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

Ver [Guía de Instalación](./docs/INSTALLATION.md) para más detalles.

## 📝 Notas

- Las credenciales de prueba están generadas en la inicialización de Docker
- Cada tenant está completamente aislado en la BD
- Los tokens JWT expiran en 7 días
- Los cambios en código se reflejan automáticamente con hot reload

## 📞 Soporte

Para soporte o reportar problemas, consulta la documentación o crea un issue en el repositorio.

---

**Hecho con ❤️ para los amantes de los toros de lidia**