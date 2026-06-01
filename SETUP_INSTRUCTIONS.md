# Pasos para Instalar y Ejecutar el Proyecto

## ✅ Paso 1: Instalar Dependencias del Backend

```bash
cd backend
npm install
cd ..
```

**Dependencias instaladas:**
- express: Framework web
- cors: CORS middleware
- dotenv: Variables de entorno
- jsonwebtoken: JWT
- bcryptjs: Hash de contraseñas
- @supabase/supabase-js: Cliente Supabase
- express-validator: Validación
- nodemon: Dev server (auto-reload)

## ✅ Paso 2: Instalar Dependencias del Frontend

```bash
cd frontend
npm install
cd ..
```

**Dependencias instaladas:**
- react + react-dom: Framework UI
- react-router-dom: Routing
- axios: HTTP client
- react-toastify: Notificaciones
- lucide-react: Icons
- vite: Build tool
- tailwindcss: CSS framework
- postcss + autoprefixer: Post-processing CSS

## ✅ Paso 3: Configurar Variables de Entorno

### Backend

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=http://localhost:5432
SUPABASE_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

Editar `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

## ✅ Paso 4: Iniciar Docker Compose

```bash
docker-compose -f docker/docker-compose.yml up -d
```

**Qué se inicia:**
- PostgreSQL en puerto 5432
- Backend API en puerto 5000
- Las tablas y datos iniciales se crean automáticamente

Verificar que está corriendo:
```bash
docker-compose -f docker/docker-compose.yml ps
```

## ✅ Paso 5: Iniciar el Frontend (en otra terminal)

```bash
cd frontend
npm run dev
```

El frontend estará en: **http://localhost:5173**

## ✅ Paso 6: Login

1. Abre http://localhost:5173
2. Ingresa credenciales:
   - **Email**: isaez@valdelapena.es
   - **Contraseña**: ManoloSanchis
3. ¡Listo! Deberías ver el Dashboard

## 🐳 Comandos Docker Útiles

### Ver logs del backend
```bash
docker logs miganaderia-backend -f
```

### Ver logs de PostgreSQL
```bash
docker logs miganaderia-postgres -f
```

### Acceder a la BD
```bash
docker exec -it miganaderia-postgres psql -U postgres -d miganaderia
```

### Detener todo
```bash
docker-compose -f docker/docker-compose.yml down
```

### Reiniciar todo
```bash
docker-compose -f docker/docker-compose.yml down -v
docker-compose -f docker/docker-compose.yml up -d
```

## 🔧 Desarrollo

### Backend en modo desarrollo
```bash
cd backend
npm run dev
```
- Auto-reloading con nodemon
- Accesible en http://localhost:5000

### Frontend en modo desarrollo
```bash
cd frontend
npm run dev
```
- Hot reload automático
- Accesible en http://localhost:5173

## 🚀 Build para Producción

### Backend
```bash
# No necesita build, pero puedes verificar:
npm test
```

### Frontend
```bash
cd frontend
npm run build
```
Crea la carpeta `dist/` lista para Vercel

## 📊 Verificar que Todo Funcione

### 1. Health Check del Backend
```bash
curl http://localhost:5000/health
```
Deberías obtener:
```json
{"status":"OK","message":"Server is running"}
```

### 2. Intentar Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "isaez@valdelapena.es",
    "password": "ManoloSanchis"
  }'
```

### 3. Verificar BD
```bash
docker exec -it miganaderia-postgres psql -U postgres -d miganaderia \
  -c "SELECT * FROM users;"
```

## 📝 Troubleshooting

### Error: Puerto 5000 ya en uso
```bash
# Cambiar PORT en backend/.env
PORT=5001
```

### Error: Puerto 5173 ya en uso
```bash
# Vite usará automáticamente otro puerto
cd frontend && npm run dev
```

### Error: CORS
- Verificar `CORS_ORIGIN=http://localhost:5173` en backend/.env
- Verificar `VITE_API_URL=http://localhost:5000/api` en frontend/.env

### Error: Base de datos no conecta
```bash
# Reiniciar Docker
docker-compose -f docker/docker-compose.yml down -v
docker-compose -f docker/docker-compose.yml up -d
```

### Error: Contraseña incorrecta
- El hash en init.sql es un ejemplo
- Ejecutar: `cd backend && node scripts/generate-password-hash.js`
- Actualizar el hash en `docker/init.sql`
- Reiniciar Docker

## ✨ Verificar Instalación

Si todo está correcto, deberías tener:
- ✅ Backend respondiendo en http://localhost:5000
- ✅ Frontend disponible en http://localhost:5173
- ✅ Poder hacer login
- ✅ Ver dashboard con información del usuario
- ✅ Ver toast notifications

## 🎉 ¡Listo para Desarrollar!

Ahora puedes empezar a implementar los módulos:
1. Gestión de Animales
2. Módulo Veterinario
3. Configuración de la Ganadería
4. Sidebar con menú
5. Dashboard avanzado

---

Fecha: 29 de Mayo de 2026
