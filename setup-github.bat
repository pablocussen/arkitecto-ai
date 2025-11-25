@echo off
REM ========================================
REM SETUP GITHUB REPOSITORY
REM ========================================

echo.
echo ========================================
echo   GITHUB REPOSITORY SETUP
echo ========================================
echo.

REM Ask for GitHub username
set /p GITHUB_USER="Enter your GitHub username: "

echo.
echo Creating repository on GitHub...
echo.
echo Please go to: https://github.com/new
echo.
echo And create a repository with these settings:
echo   - Repository name: arkitecto-ai
echo   - Description: Sistema revolucionario de presupuestos arquitectonicos con IA
echo   - Public or Private (your choice)
echo   - DO NOT add README, .gitignore, or license
echo.
pause

echo.
echo Connecting local repository to GitHub...
git remote add origin https://github.com/%GITHUB_USER%/arkitecto-ai.git

echo.
echo Pushing code to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to push to GitHub
    echo.
    echo Possible reasons:
    echo 1. Repository not created yet in GitHub
    echo 2. Wrong username
    echo 3. Need to authenticate (use Personal Access Token)
    echo.
    echo To fix:
    echo 1. Make sure repo exists: https://github.com/%GITHUB_USER%/arkitecto-ai
    echo 2. Get a token: https://github.com/settings/tokens
    echo 3. When prompted for password, use the token instead
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Code pushed to GitHub
echo ========================================
echo.
echo Repository URL: https://github.com/%GITHUB_USER%/arkitecto-ai
echo.
echo Next steps:
echo 1. Deploy frontend to Vercel
echo 2. Deploy backend to Render
echo.
pause
