# 🚀 QUICK DEPLOY GUIDE - 3 PASOS SIMPLES

## ✅ FASE 1 COMPLETADA

Gemini Code Assist implementó:
- Auth completo (Google + Email)
- Database Firestore
- Dashboard de usuario
- CRUD de proyectos

## 🎯 3 PASOS PARA DEPLOY

### 1. Setup Firebase (5 min)
https://console.firebase.google.com
- Crear proyecto "arkitecto-ai-prod"
- Habilitar Auth (Email + Google)
- Crear Firestore Database
- Copiar config a frontend/src/services/firebaseConfig.ts
- Descargar service account a backend/service-account.json

### 2. GitHub (1 min)
```bash
git remote add origin https://github.com/TU_USUARIO/arkitecto-ai.git
.\deploy.bat
```

### 3. Deploy Platforms (10 min)
- **Vercel** (frontend): Import repo, root=frontend, deploy
- **Render** (backend): Import repo, root=backend, Docker, deploy

¡LISTO! App funcionando en producción 🎉
