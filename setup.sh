#!/bin/bash

echo "========================================"
echo "  ARKITECTO AI - Setup Automatico"
echo "========================================"
echo

echo "[1/5] Verificando Python..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python no encontrado. Instala Python 3.11+ primero."
    exit 1
fi
echo "OK - Python encontrado: $(python3 --version)"

echo
echo "[2/5] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no encontrado. Instala Node.js 18+ primero."
    exit 1
fi
echo "OK - Node.js encontrado: $(node --version)"

echo
echo "[3/5] Configurando Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creando entorno virtual..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Instalando dependencias Python..."
pip install -r requirements.txt -q
cd ..
echo "OK - Backend configurado"

echo
echo "[4/5] Configurando Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias Node.js..."
    npm install
fi
cd ..
echo "OK - Frontend configurado"

echo
echo "[5/5] Verificando configuracion..."
if [ ! -f "backend/.env" ]; then
    echo "ADVERTENCIA: backend/.env no existe"
    echo "Copia backend/.env.example a backend/.env y configuralo"
fi
if [ ! -f "backend/firebase-credentials.json" ]; then
    echo "ADVERTENCIA: backend/firebase-credentials.json no existe"
    echo "Descarga tus credenciales de Firebase y guardalo ahi"
fi

echo
echo "========================================"
echo "  Setup completado!"
echo "========================================"
echo
echo "PROXIMOS PASOS:"
echo
echo "1. Configura backend/.env con tus credenciales"
echo "2. Descarga firebase-credentials.json"
echo "3. Ejecuta: cd backend && python ingest_apus.py"
echo "4. Ejecuta: cd backend && python main.py"
echo "5. En otra terminal: cd frontend && npm run dev"
echo
echo "Lee QUICKSTART.md para mas detalles"
echo
