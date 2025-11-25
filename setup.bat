@echo off
echo ========================================
echo   ARKITECTO AI - Setup Automatico
echo ========================================
echo.

echo [1/5] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no encontrado. Instala Python 3.11+ primero.
    pause
    exit /b 1
)
echo OK - Python encontrado

echo.
echo [2/5] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no encontrado. Instala Node.js 18+ primero.
    pause
    exit /b 1
)
echo OK - Node.js encontrado

echo.
echo [3/5] Configurando Backend...
cd backend
if not exist venv (
    echo Creando entorno virtual...
    python -m venv venv
)
call venv\Scripts\activate
echo Instalando dependencias Python...
pip install -r requirements.txt -q
cd ..
echo OK - Backend configurado

echo.
echo [4/5] Configurando Frontend...
cd frontend
if not exist node_modules (
    echo Instalando dependencias Node.js...
    call npm install
)
cd ..
echo OK - Frontend configurado

echo.
echo [5/5] Verificando configuracion...
if not exist backend\.env (
    echo ADVERTENCIA: backend\.env no existe
    echo Copia backend\.env.example a backend\.env y configuralo
)
if not exist backend\firebase-credentials.json (
    echo ADVERTENCIA: backend\firebase-credentials.json no existe
    echo Descarga tus credenciales de Firebase y guardalo ahi
)

echo.
echo ========================================
echo   Setup completado!
echo ========================================
echo.
echo PROXIMOS PASOS:
echo.
echo 1. Configura backend\.env con tus credenciales
echo 2. Descarga firebase-credentials.json
echo 3. Ejecuta: cd backend ^&^& python ingest_apus.py
echo 4. Ejecuta: cd backend ^&^& python main.py
echo 5. En otra terminal: cd frontend ^&^& npm run dev
echo.
echo Lee QUICKSTART.md para mas detalles
echo.
pause
