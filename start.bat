@echo off
REM Script de inicio para el proyecto MiGanaderÍa (Windows)

echo 🚀 Iniciando MiGanaderÍa SaaS...
echo.

REM Verificar si Docker está corriendo
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no está instalado. Por favor instala Docker Desktop.
    exit /b 1
)

echo ✅ Docker encontrado
echo.

REM Crear .env en backend si no existe
if not exist "backend\.env" (
    echo 📝 Creando backend\.env...
    copy backend\.env.example backend\.env
    echo ✅ backend\.env creado
)

REM Crear .env en frontend si no existe
if not exist "frontend\.env" (
    echo 📝 Creando frontend\.env...
    copy frontend\.env.example frontend\.env
    echo ✅ frontend\.env creado
)

echo.
echo 📦 Instalando dependencias del backend...
cd backend
call npm install
cd ..

echo.
echo 📦 Instalando dependencias del frontend...
cd frontend
call npm install
cd ..

echo.
echo 🐳 Iniciando Docker Compose...
docker compose up -d

echo.
echo ⏳ Esperando a que los servicios estén listos...
timeout /t 5 /nobreak

echo.
echo ✅ ¡Sistema iniciado correctamente!
echo.
echo 📍 URLs disponibles:
echo    - Backend API: http://localhost:5000
echo    - Health Check: http://localhost:5000/health
echo.
echo Para iniciar el frontend, ejecuta en otra terminal:
echo    cd frontend ^&^& npm run dev
echo.
echo Credenciales de prueba:
echo    Email: isaez@valdelapena.es
echo    Contraseña: ManoloSanchis
echo.
pause
