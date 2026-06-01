# MiGanaderÍa - SaaS Multitenant

## Visión General
Sistema moderno para gestión de ganaderías de toros de lidia con arquitectura multitenant.

## Features Principales
✅ Autenticación JWT
✅ Gestión multitenant
✅ Usuarios especiales (veterinarios) con acceso multi-tenant
✅ UI moderna con Tailwind CSS
✅ Notificaciones con React Toastify
✅ Docker Compose para desarrollo local
✅ Preparado para Vercel (Frontend + Backend)

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **BD**: PostgreSQL (Supabase)
- **DevOps**: Docker Compose + Vercel + Railway

## Estructura de Carpetas
```
miganaderia/
├── backend/          # API Node.js/Express
│   ├── src/
│   │   ├── config/   # JWT, Supabase
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/   # Auth, Tenants
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/         # React App
│   ├── src/
│   │   ├── components/ # ProtectedRoute
│   │   ├── pages/      # Login, Dashboard
│   │   ├── contexts/   # AuthContext
│   │   ├── services/   # API
│   │   ├── hooks/
│   │   └── styles/
│   ├── vite.config.js
│   └── tailwind.config.js
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile.backend
│   └── init.sql       # Schema + datos de prueba
└── docs/
```

## Credenciales de Prueba
- Email: isaez@valdelapena.es
- Contraseña: ManoloSanchis
- Ganadería: Valdelapeña

## Próximos Pasos
1. Instalar dependencias y configurar .env
2. Ejecutar docker-compose up
3. Ejecutar frontend con npm run dev
4. Login con credenciales de prueba
5. Implementar módulos: Animales, Veterinario, Configuración
