# MiGanaderÍa - Guía Rápida de Inicio

## 🚀 Inicio Rápido (5 minutos)

### En Windows
```bash
start.bat
```

### En macOS/Linux
```bash
chmod +x start.sh
./start.sh
```

### Manual (en cualquier SO)

1. **Instalar dependencias del backend**
   ```bash
   cd backend
   npm install
   cd ..
   ```

2. **Instalar dependencias del frontend**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Crear archivos .env**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Iniciar Docker Compose**
   ```bash
   docker-compose -f docker/docker-compose.yml up -d
   ```

5. **En otra terminal, iniciar el frontend**
   ```bash
   cd frontend
   npm run dev
   ```

## 📍 Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔐 Credenciales de Prueba

```
Email: isaez@valdelapena.es
Contraseña: ManoloSanchis
```

## 📊 Verificar Servicios

### Ver logs de Docker
```bash
docker-compose -f docker/docker-compose.yml logs -f
```

### Detener los servicios
```bash
docker-compose -f docker/docker-compose.yml down
```

### Reiniciar todo
```bash
docker-compose -f docker/docker-compose.yml restart
```

## 🗄️ Acceso a la BD (PostgreSQL)

- **Host**: localhost
- **Puerto**: 5432
- **Database**: miganaderia
- **Usuario**: postgres
- **Contraseña**: postgres

Conectar con:
```bash
psql -h localhost -U postgres -d miganaderia
```

## 📝 Logs del Backend

```bash
docker logs miganaderia-backend -f
```

## 🔧 Troubleshooting

### Puerto 5000 ya en uso
```bash
# Cambiar PORT en backend/.env
PORT=5001
```

### Puerto 5173 ya en uso
```bash
# Vite usará automáticamente otro puerto
```

### Base de datos no inicializa
```bash
# Reiniciar Docker
docker-compose -f docker/docker-compose.yml down -v
docker-compose -f docker/docker-compose.yml up -d
```

### Error de CORS
- Verificar que `frontend .env` tiene `VITE_API_URL=http://localhost:5000/api`
- Verificar que `backend/.env` tiene `CORS_ORIGIN=http://localhost:5173`

## 📚 Documentación

- [Instalación Detallada](./docs/INSTALLATION.md)
- [Arquitectura del Sistema](./docs/ARCHITECTURE.md)
- [Estado del Proyecto](./docs/PROJECT_STATUS.md)

## 🎯 Próximos Pasos del Desarrollo

El framework está listo para:

1. ✅ Autenticación JWT
2. ✅ Sistema multitenant
3. ✅ UI moderna con Tailwind
4. 🔜 Módulo de Animales
5. 🔜 Módulo Veterinario
6. 🔜 Gestión de Usuarios
7. 🔜 Dashboard avanzado
8. 🔜 Reportes y Analytics

## 💡 Tips

- Los cambios en código se reflejan automáticamente (hot reload)
- Las contraseñas están hasheadas con bcryptjs
- Los tokens JWT expiran en 7 días
- Cada tenant está completamente aislado en la BD

---

**¡Listo para comenzar! 🎉**
