# ✅ Checklist Completo - Arkitecto AI

Lista de verificación para asegurar que todo esté configurado correctamente.

---

## 📋 Pre-requisitos del Sistema

- [ ] **Python 3.11 o superior instalado**
  ```bash
  python --version
  # Debe mostrar: Python 3.11.x o superior
  ```

- [ ] **Node.js 18 o superior instalado**
  ```bash
  node --version
  # Debe mostrar: v18.x.x o superior
  ```

- [ ] **Git instalado** (opcional, para control de versiones)
  ```bash
  git --version
  ```

- [ ] **Google Cloud CLI instalado** (para Vertex AI)
  ```bash
  gcloud --version
  ```

---

## 🔧 Configuración de Credenciales

### Firebase

- [ ] **Proyecto Firebase creado**
  - Ir a: https://console.firebase.google.com/

- [ ] **Firestore habilitado en el proyecto**
  - En Firebase Console: Build → Firestore Database → Create database

- [ ] **Credenciales descargadas**
  - Settings → Service Accounts → Generate new private key
  - Archivo guardado como: `backend/firebase-credentials.json`

- [ ] **Verificar que el archivo JSON existe:**
  ```bash
  ls backend/firebase-credentials.json
  ```

### Google Cloud / Vertex AI

- [ ] **Proyecto Google Cloud creado**
  - Ir a: https://console.cloud.google.com/

- [ ] **Vertex AI API habilitada**
  - API & Services → Enable APIs and Services → "Vertex AI API"

- [ ] **Application Default Credentials configuradas**
  ```bash
  gcloud auth application-default login
  ```

- [ ] **Verificar Project ID**
  ```bash
  gcloud config get-value project
  ```

---

## 📁 Archivos de Configuración

### Backend

- [ ] **Archivo `.env` creado en backend/**
  ```bash
  cp backend/.env.example backend/.env
  ```

- [ ] **Variables configuradas en `.env`:**
  - [ ] `FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json`
  - [ ] `GOOGLE_CLOUD_PROJECT=tu-proyecto-id`
  - [ ] `GOOGLE_CLOUD_LOCATION=us-central1`
  - [ ] `PORT=8000`
  - [ ] `HOST=0.0.0.0`

- [ ] **Credenciales Firebase en su lugar:**
  ```bash
  test -f backend/firebase-credentials.json && echo "✅ OK" || echo "❌ FALTA"
  ```

### Frontend

- [ ] **Archivo `.env` creado** (opcional)
  ```bash
  cp frontend/.env.example frontend/.env
  ```

---

## 🔨 Instalación de Dependencias

### Opción A: Automática (Recomendado)

- [ ] **Ejecutar script de setup:**
  ```bash
  # Windows:
  setup.bat

  # Linux/Mac:
  chmod +x setup.sh
  ./setup.sh
  ```

### Opción B: Manual

#### Backend

- [ ] **Crear entorno virtual:**
  ```bash
  cd backend
  python -m venv venv
  ```

- [ ] **Activar entorno virtual:**
  ```bash
  # Windows:
  venv\Scripts\activate

  # Linux/Mac:
  source venv/bin/activate
  ```

- [ ] **Instalar dependencias:**
  ```bash
  pip install -r requirements.txt
  ```

- [ ] **Verificar instalación:**
  ```bash
  pip list | grep fastapi
  # Debe mostrar: fastapi 0.109.0
  ```

#### Frontend

- [ ] **Instalar dependencias:**
  ```bash
  cd frontend
  npm install
  ```

- [ ] **Verificar instalación:**
  ```bash
  npm list react
  # Debe mostrar: react@19.0.0
  ```

---

## 📊 Ingesta de Datos (¡CRÍTICO!)

- [ ] **Verificar que existen archivos Excel en data/**
  ```bash
  ls data/*.xlsx | head -5
  ```

- [ ] **Activar entorno virtual del backend:**
  ```bash
  cd backend
  source venv/bin/activate  # Linux/Mac
  venv\Scripts\activate     # Windows
  ```

- [ ] **Ejecutar script de ingesta:**
  ```bash
  python ingest_apus.py
  ```

- [ ] **Verificar output esperado:**
  ```
  ✅ Firebase inicializado
  📁 Encontrados XX archivos Excel
  📄 Procesando: archivo1.xlsx
     ✅ Extraídos XX items
  ...
  📊 Total de APUs procesados: XXX
  ```

- [ ] **Confirmar subida a Firestore:**
  ```
  ¿Deseas subir estos datos a Firestore? (s/n): s
  ✅ Total subidos: XXX items a Firestore
  ```

- [ ] **Verificar en Firebase Console:**
  - Ir a Firestore → Ver colección `apus_db`
  - Debe tener documentos con datos de APUs

---

## 🚀 Verificación de Servicios

### Backend

- [ ] **Iniciar servidor backend:**
  ```bash
  cd backend
  python main.py
  ```

- [ ] **Verificar logs de inicio:**
  ```
  ✅ Firebase inicializado
  ✅ Vertex AI inicializado
  INFO:     Uvicorn running on http://0.0.0.0:8000
  ```

- [ ] **Verificar health endpoint:**
  ```bash
  curl http://localhost:8000/health
  ```

- [ ] **Respuesta esperada:**
  ```json
  {
    "status": "healthy",
    "firebase": true,
    "vertex_ai": true
  }
  ```

- [ ] **Verificar búsqueda de APUs:**
  ```bash
  curl "http://localhost:8000/search_apus?q=muro&limit=3"
  ```

- [ ] **Debe retornar resultados (count > 0)**

### Frontend

- [ ] **Iniciar servidor frontend:**
  ```bash
  cd frontend
  npm run dev
  ```

- [ ] **Verificar logs de inicio:**
  ```
  VITE v5.x.x ready in XXX ms
  ➜  Local:   http://localhost:5173/
  ```

- [ ] **Abrir en navegador:**
  - URL: http://localhost:5173

- [ ] **Verificar UI:**
  - [ ] Header con logo "Arkitecto AI" visible
  - [ ] Badge verde "Online" visible
  - [ ] Botón flotante cyan/amarillo abajo a la derecha
  - [ ] Mensaje de bienvenida en el centro

- [ ] **Verificar consola del navegador (F12):**
  - No debe haber errores rojos
  - Puede haber warnings (aceptable)

---

## 🧪 Pruebas Funcionales

### Test 1: Búsqueda de APUs

- [ ] **En navegador, abrir DevTools (F12) → Network**

- [ ] **En otra terminal, hacer búsqueda:**
  ```bash
  curl "http://localhost:8000/search_apus?q=albanileria"
  ```

- [ ] **Debe retornar JSON con results**

### Test 2: Interfaz del Modal

- [ ] **Click en botón "Ojo Mágico"**

- [ ] **Verificar que abre modal con:**
  - [ ] Título "Analizar Proyecto"
  - [ ] Área de captura de imagen
  - [ ] Campo de texto para instrucciones
  - [ ] Botones "Cancelar" y "Analizar"

- [ ] **Click en "Capturar o seleccionar imagen"**

- [ ] **Debe abrir selector de archivos**

### Test 3: Análisis Completo (Requiere imagen de prueba)

- [ ] **Preparar imagen de prueba:**
  - Descargar foto de obra, plano o boceto
  - Tamaño recomendado: < 5MB

- [ ] **En la app:**
  1. Click en "Ojo Mágico"
  2. Seleccionar imagen
  3. Escribir: "Presupuesta un muro de 10 metros cuadrados"
  4. Click "Analizar"

- [ ] **Verificar overlay de carga aparece**

- [ ] **Esperar respuesta (10-30 segundos)**

- [ ] **Verificar resultado:**
  - [ ] Aparece card de "Análisis" con texto
  - [ ] Aparece lista de items presupuestados
  - [ ] Cada item muestra: nombre, cantidad, precio, subtotal
  - [ ] Aparece card de resumen con total

- [ ] **Verificar animaciones:**
  - [ ] Items aparecen con fade-in
  - [ ] Transiciones suaves
  - [ ] Sin errores visuales

---

## 🔍 Verificación de Logs

### Logs del Backend

- [ ] **No hay errores en la consola del backend**

- [ ] **Logs esperados al analizar:**
  ```
  INFO: POST /analyze_budget
  INFO: 200 OK
  ```

### Logs del Frontend

- [ ] **Consola del navegador sin errores críticos**

- [ ] **Network tab muestra:**
  - Request a `/api/analyze_budget` → Status 200
  - Response con JSON válido

---

## 📱 Verificación PWA

### Desktop

- [ ] **En Chrome/Edge, buscar ícono de instalación en barra de URL**

- [ ] **Click en "Instalar"**

- [ ] **App se abre como ventana independiente**

- [ ] **Funciona igual que en navegador**

### Mobile (Opcional)

- [ ] **Abrir en Chrome/Safari móvil**

- [ ] **Menú → "Agregar a pantalla de inicio"**

- [ ] **Ícono aparece en launcher**

- [ ] **App abre en modo standalone**

---

## 🎯 Checklist de Completitud

### Archivos del Proyecto

- [ ] Documentación completa:
  - [ ] README.md
  - [ ] QUICKSTART.md
  - [ ] PROJECT_STRUCTURE.md
  - [ ] TESTING.md
  - [ ] BUILD_SUMMARY.md
  - [ ] INDEX.md
  - [ ] CHECKLIST.md (este archivo)

- [ ] Scripts de utilidad:
  - [ ] setup.sh / setup.bat
  - [ ] backend/run.sh / backend/run.bat

- [ ] Configuración:
  - [ ] .gitignore (root)
  - [ ] backend/.gitignore
  - [ ] frontend/.gitignore
  - [ ] backend/.env.example
  - [ ] frontend/.env.example

### Código Fuente

- [ ] Backend completo:
  - [ ] main.py (API)
  - [ ] ingest_apus.py (ingesta)
  - [ ] requirements.txt

- [ ] Frontend completo:
  - [ ] src/App.tsx
  - [ ] src/components/ (4 archivos)
  - [ ] src/services/api.ts
  - [ ] src/types/index.ts
  - [ ] vite.config.ts (con PWA y proxy)
  - [ ] package.json

---

## 🎓 Conocimiento del Sistema

### Entendimiento Conceptual

- [ ] **Comprendo el flujo de datos:**
  ```
  Usuario → MagicEyeButton → API → Vertex AI → Firestore → Respuesta → UI
  ```

- [ ] **Entiendo los endpoints:**
  - [ ] POST /analyze_budget
  - [ ] GET /search_apus
  - [ ] GET /health

- [ ] **Sé dónde están los datos:**
  - [ ] Excel en carpeta `data/`
  - [ ] APUs en Firestore colección `apus_db`
  - [ ] Credenciales en `backend/`

- [ ] **Conozco el stack:**
  - [ ] Backend: Python + FastAPI
  - [ ] Frontend: React + Vite
  - [ ] IA: Vertex AI (Gemini 1.5 Pro)
  - [ ] BD: Firestore

---

## ✅ Estado Final

### Todos los checks completados:

- [ ] **Prerrequisitos instalados**
- [ ] **Credenciales configuradas**
- [ ] **Archivos de configuración listos**
- [ ] **Dependencias instaladas**
- [ ] **Datos ingeridos en Firestore**
- [ ] **Backend corriendo sin errores**
- [ ] **Frontend corriendo sin errores**
- [ ] **Health check pasa**
- [ ] **Búsqueda de APUs funciona**
- [ ] **Análisis completo funciona**
- [ ] **PWA instalable**

---

## 🎉 ¡Proyecto Listo!

Si todos los checks están ✅, tu instalación de Arkitecto AI está completa y funcional.

### Próximos pasos:

1. **Usar la aplicación** con proyectos reales
2. **Leer documentación avanzada** en [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
3. **Experimentar con diferentes imágenes** y consultas
4. **Reportar bugs** o mejoras

---

## 🆘 Si algo falla:

1. **Revisa este checklist** desde el principio
2. **Lee [TESTING.md](TESTING.md)** sección de debugging
3. **Consulta [README.md](README.md)** sección troubleshooting
4. **Verifica logs** del backend y frontend

---

**Última actualización:** 2024-11-23
**Versión:** 1.0.0 MVP
