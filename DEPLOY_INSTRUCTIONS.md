# 🚀 INSTRUCCIONES DE DEPLOY - ARKITECTO AI v5.0 PRO

## ✅ Estado: Código committeado localmente

Commit ID: `7c3c444`
Archivos: 635 archivos listos

---

## 📋 Próximos Pasos para Deploy

### Paso 1: Subir a GitHub (5 minutos)

1. **Crear repositorio en GitHub:**
   - Ve a https://github.com/new
   - Nombre del repo: `arkitecto-ai`
   - Descripción: "Sistema revolucionario de presupuestos y visualización arquitectónica con IA"
   - Tipo: Public (o Private si prefieres)
   - **NO** agregues README, .gitignore ni licencia (ya los tienes)
   - Click "Create repository"

2. **Conectar y subir código:**

Abre PowerShell o CMD y ejecuta:

```powershell
cd "G:\Mi unidad\Proyectos\3-IA\arkitecto-ai"

# Cambiar rama a main
git branch -M main

# Conectar con tu repo (REEMPLAZA TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/arkitecto-ai.git

# Subir código
git push -u origin main
```

**Nota:** Si te pide autenticación, usa:
- Usuario: Tu usuario de GitHub
- Contraseña: Un Personal Access Token (no tu contraseña)
  - Crear token: https://github.com/settings/tokens

---

### Paso 2: Deploy Frontend en Vercel (3 minutos)

1. **Ir a Vercel:**
   - https://vercel.com
   - Click "Sign Up" o "Login" con GitHub

2. **Importar proyecto:**
   - Click "Add New..." → "Project"
   - Busca `arkitecto-ai` en tu lista de repos
   - Click "Import"

3. **Configurar proyecto:**
   ```
   Project Name: arkitecto-ai
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Variables de entorno:**
   - Click "Environment Variables"
   - Agregar:
     ```
     Name: VITE_API_URL
     Value: (déjalo vacío por ahora, lo actualizaremos después)
     ```

5. **Deploy:**
   - Click "Deploy"
   - Espera 2-3 minutos
   - Copia la URL (ejemplo: `https://arkitecto-ai-xxxx.vercel.app`)

---

### Paso 3: Deploy Backend en Render (10 minutos)

1. **Ir a Render:**
   - https://render.com
   - Click "Get Started" o "Login" con GitHub

2. **Nuevo servicio:**
   - Click "New +" → "Web Service"
   - Conecta tu cuenta de GitHub si es necesario
   - Busca `arkitecto-ai`
   - Click "Connect"

3. **Configurar servicio:**
   ```
   Name: arkitecto-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Docker
   Instance Type: Free
   ```

4. **Variables de entorno:**
   - Click "Environment"
   - Agregar:
     ```
     GOOGLE_CLOUD_PROJECT=arkitecto-ai-pro-v1
     ```

5. **Secret Files (IMPORTANTE):**
   - En la sección "Secret Files"
   - Click "Add Secret File"
   - Filename: `/etc/secrets/service-account.json`
   - Contents:
     1. Ve a Google Cloud Console
     2. IAM & Admin → Service Accounts
     3. Encuentra tu service account
     4. Actions → Manage Keys → Add Key → Create New Key (JSON)
     5. Copia TODO el contenido del archivo JSON y pégalo aquí

6. **Deploy:**
   - Click "Create Web Service"
   - Espera 5-10 minutos
   - Copia la URL (ejemplo: `https://arkitecto-backend.onrender.com`)

---

### Paso 4: Conectar Frontend con Backend (2 minutos)

1. **Volver a Vercel:**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Edita `VITE_API_URL`:
     ```
     Value: https://arkitecto-backend.onrender.com
     ```
   - Click "Save"

2. **Redeploy frontend:**
   - Ve a "Deployments"
   - Click en el último deployment
   - Click "..." → "Redeploy"
   - Espera 1-2 minutos

---

### Paso 5: Verificar que todo funciona (2 minutos)

1. **Test backend:**
   ```powershell
   curl https://arkitecto-backend.onrender.com/
   ```
   Debería retornar: `{"status":"online","brain":"v4.0 Cascade"}`

2. **Test frontend:**
   - Abre: `https://arkitecto-ai-xxxx.vercel.app`
   - Sube una imagen
   - Prueba el presupuesto
   - Prueba el Dream Mode

3. **Si todo funciona:**
   - ✅ Backend: Online
   - ✅ Frontend: Online
   - ✅ Presupuestos: Funcionando
   - ✅ Dream Mode: Generando renders

---

## 🎉 ¡LISTO! Tu app está en producción

### URLs de tu aplicación:

- **Frontend**: `https://arkitecto-ai-xxxx.vercel.app`
- **Backend**: `https://arkitecto-backend.onrender.com`
- **GitHub**: `https://github.com/TU_USUARIO/arkitecto-ai`

### Dashboards:

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com

---

## 📊 Costos

- **Vercel**: $0/mes (gratis ilimitado)
- **Render**: $0/mes (750 horas gratis mensuales)
- **Google Cloud**: Solo pagas por uso de Vertex AI

**Total estimado**: $0-5/mes para ~1,000 usuarios

---

## 🔧 Actualizar código después

Cada vez que hagas cambios:

```powershell
cd "G:\Mi unidad\Proyectos\3-IA\arkitecto-ai"
git add .
git commit -m "Tu mensaje de actualización"
git push
```

Vercel y Render actualizarán automáticamente!

---

## 🆘 Troubleshooting

### Backend no inicia
- Verifica que el archivo service-account.json esté en Secret Files
- Revisa los logs en Render Dashboard

### Frontend muestra error CORS
- Actualiza `main.py` línea 59:
  ```python
  allow_origins=["https://tu-frontend.vercel.app"]
  ```
- Haz git push

### Dream Mode no genera imágenes
- Verifica credenciales de Google Cloud
- Revisa que Vertex AI esté habilitado en GCP

---

## 📞 Siguiente Nivel (Opcional)

### Dominio personalizado:
1. En Vercel: Settings → Domains → Add Domain
2. Compra dominio en Namecheap/GoDaddy
3. Configura DNS

### Analytics:
- Vercel ya incluye analytics gratis
- Google Analytics: Agregar script en index.html

### Monitoreo:
- Render incluye logs y métricas
- Sentry.io para error tracking

---

**¡Tu aplicación profesional está lista para el mundo! 💎🚀**

Comparte la URL y sorprende a tus usuarios con presupuestos inteligentes y renders fotorrealistas!
