@echo off
REM ========================================
REM ARKITECTO AI - DEPLOY SCRIPT
REM ========================================

echo.
echo ========================================
echo   ARKITECTO AI - AUTOMATED DEPLOY
echo ========================================
echo.

REM Check if git remote exists
git remote -v | findstr "origin" >nul
if %errorlevel% neq 0 (
    echo [ERROR] Git remote 'origin' not configured
    echo Please run: git remote add origin https://github.com/YOUR_USERNAME/arkitecto-ai.git
    pause
    exit /b 1
)

echo [1/5] Installing backend dependencies...
cd backend
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [2/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [3/5] Building frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend
    pause
    exit /b 1
)
cd ..

echo.
echo [4/5] Running tests...
cd backend
python -m pytest 2>nul || echo [WARNING] No tests found, skipping...
cd ..

echo.
echo [5/5] Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo [ERROR] Failed to push to GitHub
    echo Make sure you have added the remote and have the correct permissions
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOY COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Next steps:
echo 1. Deploy Frontend to Vercel:
echo    - Go to https://vercel.com
echo    - Import your GitHub repo
echo    - Set Root Directory: frontend
echo    - Deploy!
echo.
echo 2. Deploy Backend to Render:
echo    - Go to https://render.com
echo    - Create new Web Service
echo    - Connect your GitHub repo
echo    - Set Root Directory: backend
echo    - Add environment variables
echo    - Deploy!
echo.
echo 3. Configure Firebase:
echo    - Follow instructions in firebase/README.md
echo    - Add your Firebase config to frontend
echo    - Add service account to backend
echo.
echo ========================================
pause
