# Estructura Completa del Proyecto MiGanaderÍa

## 📁 Árbol de Directorios

```
miganaderia/
│
├── 📄 README.md                          # Documentación principal
├── 📄 QUICK_START.md                     # Inicio en 5 minutos
├── 📄 SETUP_INSTRUCTIONS.md              # Instrucciones detalladas de instalación
├── 📄 .gitignore                         # Git ignore
├── 🔧 start.sh                           # Script inicio (Linux/Mac)
├── 🔧 start.bat                          # Script inicio (Windows)
│
├── 📁 backend/                           # ⚙️ Node.js API
│   ├── 📄 package.json                   # Dependencias backend
│   ├── 📄 .env.example                   # Variables de entorno
│   │
│   ├── 📁 src/
│   │   ├── 📄 server.js                  # Servidor Express
│   │   │
│   │   ├── 📁 config/                    # Configuración
│   │   │   ├── 📄 jwt.js                 # JWT: generateToken, verifyToken
│   │   │   └── 📄 supabase.js            # Clientes Supabase
│   │   │
│   │   ├── 📁 middleware/                # Middlewares
│   │   │   └── 📄 auth.js                # authMiddleware, tenantMiddleware, veterinarianMiddleware
│   │   │
│   │   ├── 📁 services/                  # Servicios de negocio
│   │   │   ├── 📄 auth.service.js        # Login, registro, cambio password
│   │   │   └── 📄 tenant.service.js      # CRUD tenants
│   │   │
│   │   ├── 📁 controllers/               # Controladores
│   │   │   ├── 📄 auth.controller.js     # Endpoints auth
│   │   │   └── 📄 tenant.controller.js   # Endpoints tenants
│   │   │
│   │   ├── 📁 routes/                    # Rutas de la API
│   │   │   ├── 📄 auth.routes.js         # POST /api/auth/*
│   │   │   └── 📄 tenant.routes.js       # GET/POST /api/tenants/*
│   │   │
│   │   ├── 📁 models/                    # Modelos de datos (futuro)
│   │   ├── 📁 utils/                     # Utilidades
│   │   └── 📁 validators/                # Validadores (futuro)
│   │
│   └── 📁 scripts/
│       ├── 📄 generate-password-hash.js  # Generar hash bcryptjs
│       └── 📄 README.md                  # Instrucciones scripts
│
├── 📁 frontend/                          # ⚛️ React App
│   ├── 📄 package.json                   # Dependencias frontend
│   ├── 📄 .env.example                   # Variables de entorno
│   ├── 📄 index.html                     # HTML principal
│   ├── 📄 vite.config.js                 # Configuración Vite
│   ├── 📄 tailwind.config.js             # Configuración Tailwind
│   ├── 📄 postcss.config.js              # PostCSS config
│   ├── 📄 vercel.json                    # Config Vercel
│   │
│   └── 📁 src/
│       ├── 📄 main.jsx                   # Punto de entrada React
│       ├── 📄 App.jsx                    # Router principal + Providers
│       │
│       ├── 📁 components/                # Componentes React
│       │   └── 📄 ProtectedRoute.jsx     # Protección de rutas
│       │
│       ├── 📁 pages/                     # Páginas
│       │   ├── 📄 Login.jsx              # Página login
│       │   └── 📄 Dashboard.jsx          # Dashboard principal
│       │
│       ├── 📁 contexts/                  # Contextos globales
│       │   └── 📄 AuthContext.jsx        # Autenticación global
│       │
│       ├── 📁 hooks/                     # Custom hooks
│       │   └── 📄 useProtectedRoute.js   # Validar rutas protegidas
│       │
│       ├── 📁 services/                  # Servicios API
│       │   └── 📄 api.js                 # Axios + interceptor token
│       │
│       ├── 📁 styles/                    # Estilos globales
│       │   └── 📄 index.css              # Tailwind imports
│       │
│       └── 📁 assets/                    # Assets estáticos
│
├── 📁 docker/                            # 🐳 Docker config
│   ├── 📄 docker-compose.yml             # Orquestación servicios
│   ├── 📄 Dockerfile.backend             # Imagen backend
│   └── 📄 init.sql                       # Script inicialización BD
│
└── 📁 docs/                              # 📚 Documentación
    ├── 📄 INSTALLATION.md                # Instalación detallada
    ├── 📄 ARCHITECTURE.md                # Arquitectura del sistema
    ├── 📄 PROJECT_STATUS.md              # Estado proyecto
    └── 📄 IMPLEMENTATION_SUMMARY.md      # Resumen implementación
```

## 🗄️ Estructura Base de Datos

### Tablas

```sql
tenants
├─ id (UUID PK)
├─ name
├─ location
├─ description
├─ is_active
└─ timestamps

users
├─ id (UUID PK)
├─ email (UNIQUE)
├─ password (hash)
├─ full_name
├─ tenant_id (FK → tenants)
├─ user_type (user|veterinarian|admin)
├─ is_active
└─ timestamps

veterinarian_tenants
├─ id (UUID PK)
├─ user_id (FK → users)
├─ tenant_id (FK → tenants)
├─ permissions (read|write|full)
└─ created_at

animals
├─ id (UUID PK)
├─ tenant_id (FK → tenants)
├─ name
├─ type (toro|vaca|becerro)
├─ breed
├─ birth_date
├─ weight
├─ status (active|retired|sold)
├─ is_active
└─ timestamps

veterinary_records
├─ id (UUID PK)
├─ animal_id (FK → animals)
├─ tenant_id (FK → tenants)
├─ veterinarian_id (FK → users)
├─ record_date
├─ diagnosis
├─ treatment
├─ notes
└─ timestamps
```

## 🔌 Endpoints API

### Autenticación
```
POST   /api/auth/login              Login usuario
POST   /api/auth/register           Registrar usuario
GET    /api/auth/me                 Datos usuario actual (protegido)
POST   /api/auth/change-password    Cambiar contraseña (protegido)
```

### Ganaderías (Tenants)
```
GET    /api/tenants                 Listar ganaderías
POST   /api/tenants                 Crear ganadería (protegido)
GET    /api/tenants/:tenantId       Obtener ganadería (protegido)
PUT    /api/tenants/:tenantId       Actualizar ganadería (protegido)
GET    /api/tenants/:userId/veterinarian  Ganaderías veterinario (protegido)
```

## 🚀 Flujos de Ejecución

### Startup (start.sh / start.bat)
```
1. Verificar Docker
2. Copiar .env.example → .env
3. npm install (backend)
4. npm install (frontend)
5. docker-compose up -d
6. Esperar servicios listos
```

### Login Flow
```
Frontend Input → 
API: POST /api/auth/login →
Backend: Valida email/password →
Backend: Genera JWT →
Frontend: Almacena token en localStorage →
Frontend: Redirige a /dashboard →
Dashboard: useAuth() recupera token y user
```

### API Request Flow
```
Frontend: axios request →
Interceptor: Agrega token en header →
Backend: authMiddleware valida token →
Backend: tenantMiddleware valida acceso →
Backend: Query filtrada por tenant_id →
Backend: Retorna datos aislados →
Frontend: Muestra en componente
```

## 🔑 Credenciales Iniciales

```
Email:     isaez@valdelapena.es
Password:  ManoloSanchis
Ganadería: Valdelapeña
Tipo:      user (regular)
```

## 🎨 Tecnologías por Capa

### Frontend
- React 18
- Vite (bundler)
- Tailwind CSS (estilos)
- Axios (HTTP)
- React Router (routing)
- React Toastify (notificaciones)
- Lucide React (icons)

### Backend
- Node.js 22
- Express (framework)
- JWT (autenticación)
- bcryptjs (seguridad)
- Supabase SDK (BD)
- CORS

### DevOps
- Docker
- Docker Compose
- PostgreSQL 15
- Vercel (frontend cloud)
- Railway/Render (backend cloud)

## 📦 Tamaño de Dependencias

### Backend
- express: ~50KB
- jsonwebtoken: ~35KB
- bcryptjs: ~40KB
- @supabase/supabase-js: ~100KB
- Total: ~250KB

### Frontend
- react: ~40KB
- react-dom: ~180KB
- react-router-dom: ~60KB
- axios: ~15KB
- tailwindcss: ~500KB (CSS)
- Total: ~800KB (sin node_modules)

## 🔄 Ciclo de Desarrollo

### Cambios en Backend
```
Editar archivo → nodemon detecta cambio → 
Backend reinicia automáticamente → 
Frontend consume nuevo endpoint
```

### Cambios en Frontend
```
Editar archivo → Vite hot reload → 
Navegador recarga componente → 
Cambios visibles sin refrescar página
```

## 📊 Performance

### Base de Datos
- Índices en FK para queries rápidas
- Índices en email para login
- Connection pooling (Supabase)

### Backend
- Stateless (escalable horizontalmente)
- Gzip compresión (futuro)
- Caché de sesiones (futuro)

### Frontend
- Code splitting automático (Vite)
- Lazy loading de rutas (futuro)
- Caché de assets (Vercel)

---

**¡Proyecto listo para desarrollo! 🚀**
