# Arquitectura del Sistema

## Descripción General

MiGanaderÍa es un SaaS multitenant diseñado para la gestión de ganaderías de toros de lidia. El sistema permite:

- Gestión de múltiples ganaderías (tenants)
- Usuarios vinculados a ganaderías específicas
- Veterinarios especiales con acceso a múltiples ganaderías
- Control de acceso basado en roles (RBAC)

## Modelo de Datos

### Entidades Principales

#### Tenants (Ganaderías)
```
- id: UUID
- name: string
- location: string
- description: text
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### Users (Usuarios)
```
- id: UUID
- email: string (unique)
- password: string (hash)
- full_name: string
- tenant_id: UUID (FK)
- user_type: enum ['user', 'veterinarian', 'admin']
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### Veterinarian_Tenants (Relación Veterinarios-Ganaderías)
```
- id: UUID
- user_id: UUID (FK)
- tenant_id: UUID (FK)
- permissions: enum ['read', 'write', 'full']
- created_at: timestamp
```

#### Animals (Animales)
```
- id: UUID
- tenant_id: UUID (FK)
- name: string
- type: enum ['toro', 'vaca', 'becerro']
- breed: string
- birth_date: date
- weight: decimal
- status: enum ['active', 'retired', 'sold']
- is_active: boolean
```

#### Veterinary_Records (Registros Veterinarios)
```
- id: UUID
- animal_id: UUID (FK)
- tenant_id: UUID (FK)
- veterinarian_id: UUID (FK)
- record_date: date
- diagnosis: text
- treatment: text
- notes: text
```

## Autenticación y Autorización

### Flow de Autenticación

1. Usuario envía email y password al endpoint `/api/auth/login`
2. Backend valida credenciales y genera JWT
3. Token contiene: `userId`, `tenantId`, `userType`
4. Frontend almacena token en localStorage
5. Cada request envía token en header `Authorization: Bearer <token>`

### Niveles de Acceso

- **Usuario Regular**: Acceso solo a su ganadería
- **Veterinario**: Acceso a múltiples ganaderías (lectura limitada)
- **Admin**: Acceso total al sistema

### Middleware de Seguridad

- `authMiddleware`: Verifica token JWT
- `tenantMiddleware`: Valida acceso al tenant
- `veterinarianMiddleware`: Restringe a veterinarios

## Stack Tecnológico

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: JWT
- **ORM**: Query directo con Supabase SDK

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Router**: React Router
- **Estilos**: Tailwind CSS
- **HTTP Client**: Axios
- **Notificaciones**: React Toastify
- **Icons**: Lucide React

### DevOps
- **Containerización**: Docker
- **Orquestación**: Docker Compose
- **Cloud Frontend**: Vercel
- **Cloud Backend**: Railway/Render
- **Base de Datos**: Supabase

## Flujos Principales

### 1. Login
```
Frontend → API Login → Valida credenciales → 
Genera JWT → Retorna token y user data → 
Frontend almacena token → Redirige a Dashboard
```

### 2. Acceso a Recurso Protegido
```
Frontend (con token) → Middleware Auth → 
Verifica token → Extrae userId/tenantId → 
Query filtrada por tenant → Retorna datos
```

### 3. Acceso Veterinario Multi-Tenant
```
Veterinario A accede a Ganadería B →
Middleware valida relación en veterinarian_tenants →
Aplica filtro de permisos → Retorna datos limitados
```

## Seguridad

### Medidas Implementadas

1. **Contraseñas**: Hashed con bcryptjs (salt 10)
2. **JWT**: Firmado con secret, expira en 7 días
3. **CORS**: Configurado para origen específico
4. **Isolamiento de Tenants**: Queries filtradas por tenant_id
5. **Rate Limiting**: (Futuro)
6. **SQL Injection**: Prevenido con Supabase SDK

## Escalabilidad

### Base de Datos
- Índices en foreign keys y campos de búsqueda frecuente
- Particionamiento por tenant (futuro)

### Backend
- Stateless para fácil escalado horizontal
- Caché de sesiones (futuro)

### Frontend
- Code splitting automático con Vite
- Lazy loading de rutas

## Monitoreo (Futuro)

- Logs centralizados
- Alertas de errores
- Métricas de rendimiento
- Dashboard de admin
