#!/bin/bash

# Script de inicio para el proyecto MiGanaderÍa

echo "🚀 Iniciando MiGanaderÍa SaaS..."
echo ""

# Verificar si Docker está corriendo
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

echo "✅ Docker encontrado"
echo ""

# Crear .env en backend si no existe
if [ ! -f backend/.env ]; then
    echo "📝 Creando backend/.env..."
    cp backend/.env.example backend/.env
    echo "✅ backend/.env creado"
fi

# Crear .env en frontend si no existe
if [ ! -f frontend/.env ]; then
    echo "📝 Creando frontend/.env..."
    cp frontend/.env.example frontend/.env
    echo "✅ frontend/.env creado"
fi

echo ""
echo "📦 Instalando dependencias del backend..."
cd backend
npm install
cd ..

echo ""
echo "📦 Instalando dependencias del frontend..."
cd frontend
npm install
cd ..

echo ""
echo "🐳 Iniciando Docker Compose..."
docker compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 5

echo ""
echo "✅ ¡Sistema iniciado correctamente!"
echo ""
echo "📍 URLs disponibles:"
echo "   - Backend API: http://localhost:5000"
echo "   - Health Check: http://localhost:5000/health"
echo ""
echo "Para iniciar el frontend, ejecuta en otra terminal:"
echo "   cd frontend && npm run dev"
echo ""
echo "Credenciales de prueba:"
echo "   Email: isaez@valdelapena.es"
echo "   Contraseña: ManoloSanchis"
echo ""
