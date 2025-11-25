# 🚀 ARKITECTO AI v5.0 PRO - Guía de Deploy

## ✨ Lo que tienes

- **Backend v5.0 PRO**: FastAPI + Vertex AI + Firebase + APUs Profesionales
- **Frontend**: React 19 + Vite + TypeScript + TailwindCSS
- **Características**:
  - 40+ APUs con precios reales de mercado chileno
  - Dream Mode con análisis de imagen + renders fotorrealistas
  - Sistema inteligente de presupuestos
  - Sin astronautas ni personas en renders

---

## 🎯 Opción 1: Deploy Rápido (Recomendado)

### **Frontend → Vercel (Gratis)**

1. Sube el proyecto a GitHub:
```bash
cd "g:\Mi unidad\Proyectos\3-IA\arkitecto-ai"
git init
git add .
git commit -m "🚀 Arkitecto AI v5.0 PRO"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/arkitecto-ai.git
git push -u origin main
```

2. Ve a [vercel.com](https://vercel.com)
3. Click "New Project"
4. Importa tu repo de GitHub
5. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

**Variables de entorno en Vercel:**
```
VITE_API_URL=https://tu-backend.onrender.com
```

### **Backend → Render (Gratis hasta 750h/mes)**

1. Ve a [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Conecta tu repo de GitHub
4. Configura:
   - **Name**: `arkitecto-backend`
   - **Runtime**: `Docker`
   - **Region**: `Oregon (US West)`
   - **Branch**: `main`
   - **Root Directory**: `backend`
5. Variables de entorno:
```
GOOGLE_CLOUD_PROJECT=arkitecto-ai-pro-v1
GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/service-account.json
```

6. En "Secret Files", añade tu `service-account.json`:
   - Filename: `/etc/secrets/service-account.json`
   - Content: (pega el contenido de tu archivo de credenciales)

7. Click "Create Web Service"

---

## 🏢 Opción 2: Google Cloud (Profesional)

### **Backend → Cloud Run**

```bash
cd backend

# Build y push de la imagen
gcloud builds submit --tag gcr.io/arkitecto-ai-pro-v1/backend

# Deploy a Cloud Run
gcloud run deploy arkitecto-backend \
  --image gcr.io/arkitecto-ai-pro-v1/backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GOOGLE_CLOUD_PROJECT=arkitecto-ai-pro-v1
```

### **Frontend → Firebase Hosting**

```bash
cd frontend

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

Configurar `firebase.json`:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

## 🔧 Opción 3: Railway (Más Fácil)

1. Ve a [railway.app](https://railway.app)
2. Click "Start a New Project"
3. "Deploy from GitHub repo"
4. Selecciona tu repo
5. Railway detectará automáticamente:
   - Frontend (Vite)
   - Backend (Docker)

**Variables para Backend:**
```
GOOGLE_CLOUD_PROJECT=arkitecto-ai-pro-v1
PORT=8000
```

**Variables para Frontend:**
```
VITE_API_URL=${{backend.RAILWAY_PUBLIC_DOMAIN}}
```

---

## 📝 Configuración Post-Deploy

### 1. Actualizar CORS en Backend

Edita `main.py` línea 59:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-frontend.vercel.app"],  # Cambia esto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Verificar Variables de Entorno

**Frontend necesita:**
- `VITE_API_URL`: URL de tu backend

**Backend necesita:**
- `GOOGLE_CLOUD_PROJECT`: arkitecto-ai-pro-v1
- Credenciales de Google Cloud configuradas

---

## 🧪 Testing Post-Deploy

```bash
# Test backend
curl https://tu-backend.onrender.com/

# Debería retornar:
{"status":"online","brain":"v4.0 Cascade"}

# Test presupuesto
curl -X POST https://tu-backend.onrender.com/analyze_budget \
  -F "instruction=construir una piscina de 8x4m"
```

---

## 📊 Monitoreo

- **Vercel**: Dashboard automático con analytics
- **Render**: Logs en tiempo real, métricas de uso
- **Railway**: Metrics + logs integrados

---

## 💰 Costos Estimados

### Opción Gratis (Vercel + Render):
- Frontend: **$0** (ilimitado en Vercel)
- Backend: **$0** (750h/mes gratis en Render)
- **Total: $0/mes** para hasta ~1,000 usuarios

### Opción Pro (Google Cloud):
- Cloud Run: ~**$5-20/mes** (según uso)
- Firebase Hosting: **$0** (1GB gratis)
- **Total: $5-20/mes** para producción

---

## 🆘 Troubleshooting

### Error: "CORS policy"
→ Actualiza `allow_origins` en `main.py`

### Error: "Module not found"
→ Verifica que `requirements.txt` esté completo

### Error: "Google Cloud credentials"
→ Añade el archivo en Secret Files de Render

### Renders con astronautas
→ Ya está corregido en v5.0 PRO

---

## 📞 Soporte

- Backend funciona en: `http://localhost:8000`
- Frontend funciona en: `http://localhost:5173`
- Código sincronizado en Google Drive

## ✅ Checklist de Deploy

- [ ] Código subido a GitHub
- [ ] Frontend desplegado en Vercel
- [ ] Backend desplegado en Render
- [ ] Variables de entorno configuradas
- [ ] CORS actualizado
- [ ] Test de endpoints realizado
- [ ] Dominio personalizado (opcional)

---

**¡Tu app está lista para brillar! 💎🚀**
