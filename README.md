# 🏗️ Arkitecto AI

**Análisis inteligente de presupuestos de construcción usando IA**

Arkitecto AI es una aplicación PWA que utiliza Vertex AI (Gemini 1.5 Pro) para analizar imágenes de proyectos de construcción (planos, fotos, bocetos) y generar presupuestos estimados basados en una base de datos de APUs (Análisis de Precios Unitarios).

## ✨ Características

### Core Features
- 📸 **Captura de imágenes** mediante cámara o selección de archivos
- 🤖 **Análisis con IA** usando Gemini 1.5 Pro de Google Vertex AI
- 💰 **Generación automática de presupuestos** con precios reales
- 📊 **Base de datos de APUs** desde archivos Excel
- 🎨 **Interfaz Glassmorphism** con diseño moderno dark mode
- 📱 **PWA** instalable en dispositivos móviles
- ⚡ **Backend FastAPI** rápido y escalable

### 🌟 Features PRO (Nuevo!)
- ✨ **Modo Sueño** - Genera renders fotorrealistas con Vertex AI Image Generation
- 📱 **Realidad Aumentada** - Visualiza elementos 3D en espacios reales con WebXR
- 🎯 **Sistema de Tabs** - Interfaz dual: Presupuesto + Visión
- 🏗️ **Modelos 3D** - Biblioteca de elementos arquitectónicos en AR

👉 **[Ver documentación completa de Features PRO](PRO_FEATURES.md)**

## 🏗️ Arquitectura

```
arkitecto-ai/
├── backend/               # Backend Python FastAPI
│   ├── main.py           # Aplicación FastAPI principal
│   ├── ingest_apus.py    # Script de ingesta de datos
│   ├── requirements.txt  # Dependencias Python
│   └── .env.example      # Ejemplo de variables de entorno
├── frontend/             # Frontend React + Vite
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── services/     # Servicios API
│   │   ├── types/        # Tipos TypeScript
│   │   └── App.tsx       # Componente principal
│   ├── vite.config.ts    # Configuración Vite + PWA
│   └── package.json      # Dependencias Node
└── data/                 # Archivos Excel con APUs
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Python 3.11+
- Node.js 18+
- Cuenta de Google Cloud Platform con Vertex AI habilitado
- Proyecto Firebase con Firestore habilitado

### 1️⃣ Configurar Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Firebase Configuration
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=tu-proyecto-id
GOOGLE_CLOUD_LOCATION=us-central1

# Backend Configuration
PORT=8000
HOST=0.0.0.0
```

### 2️⃣ Configurar Credenciales

#### Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Configuración del proyecto** > **Cuentas de servicio**
4. Haz clic en **Generar nueva clave privada**
5. Guarda el archivo JSON como `backend/firebase-credentials.json`

#### Google Cloud / Vertex AI
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Habilita **Vertex AI API**
3. Configura **Application Default Credentials**:
   ```bash
   gcloud auth application-default login
   ```

### 3️⃣ Ingerir Datos de APUs

Este paso es **CRÍTICO** - debes ejecutarlo antes de usar la aplicación:

```bash
cd backend
python ingest_apus.py
```

Este script:
- Lee todos los archivos Excel de la carpeta `data/`
- Extrae información de APUs (Item, Descripción, Unidad, Precio)
- Limpia y normaliza los datos
- Sube todo a Firestore en la colección `apus_db`

**Salida esperada:**
```
🚀 Iniciando ingesta de APUs...
✅ Firebase inicializado
📁 Encontrados 95 archivos Excel
📄 Procesando: RADIER E10 CMS. 212 KG-M3 CONFECCION A BETONERA.xlsx
   ✅ Extraídos 12 items
...
📊 Total de APUs procesados: 347
¿Deseas subir estos datos a Firestore? (s/n): s
✅ Total subidos: 347 items a Firestore
✅ ¡Ingesta completada exitosamente!
```

### 4️⃣ Iniciar Backend

```bash
cd backend
python main.py
```

El servidor estará disponible en `http://localhost:8000`

Verifica que esté funcionando:
```bash
curl http://localhost:8000/health
```

### 5️⃣ Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 6️⃣ Build para Producción

```bash
cd frontend
npm run build
npm run preview
```

## 📱 Uso

1. **Abre la aplicación** en tu navegador
2. **Haz clic en el botón "Ojo Mágico"** (botón flotante cyan/amarillo)
3. **Captura o selecciona una imagen** del proyecto
4. **Escribe instrucciones** sobre qué necesitas presupuestar
5. **Haz clic en "Analizar"**
6. **Espera el análisis** con IA
7. **Revisa el presupuesto generado** con partidas y precios

## 🛠️ Tecnologías

### Backend
- **FastAPI**: Framework web moderno y rápido
- **Firebase Admin SDK**: Conexión con Firestore
- **Vertex AI**: Análisis de imágenes con Gemini 1.5 Pro
- **Pandas**: Procesamiento de archivos Excel
- **Uvicorn**: Servidor ASGI

### Frontend
- **React 19**: Librería UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool ultra rápido
- **TailwindCSS**: Estilos utility-first
- **Framer Motion**: Animaciones fluidas
- **vite-plugin-pwa**: Configuración PWA automática

## 🔧 API Endpoints

### `GET /`
Endpoint raíz con información de la API.

### `GET /health`
Verifica el estado de los servicios (Firebase y Vertex AI).

**Respuesta:**
```json
{
  "status": "healthy",
  "firebase": true,
  "vertex_ai": true
}
```

### `POST /analyze_budget`
Analiza una imagen y genera presupuesto.

**Parámetros:**
- `image`: Archivo de imagen (multipart/form-data)
- `instruction`: Texto con instrucciones (string)

**Respuesta:**
```json
{
  "success": true,
  "analisis": "Se detectó un muro de albañilería de aproximadamente 20 m2...",
  "presupuesto": {
    "items": [
      {
        "elemento": "Muro de albañilería",
        "descripcion": "ALBAÑILERIA e=11,5 CMS...",
        "cantidad": 20,
        "unidad": "m2",
        "precio_unitario": 15000,
        "subtotal": 300000,
        "apu_origen": "ALBANILERIA_e11.5"
      }
    ],
    "total_estimado": 300000,
    "moneda": "CLP"
  },
  "metadata": {
    "elementos_detectados": 1,
    "items_con_precio": 1
  }
}
```

### `GET /search_apus?q=muro&limit=10`
Busca APUs en la base de datos.

**Parámetros:**
- `q`: Query de búsqueda (string)
- `limit`: Límite de resultados (int, default: 10)

## 🎨 Diseño

La aplicación usa un diseño **Glassmorphism** con:
- **Fondo:** Gradiente oscuro con patrón de grid
- **Colores neón:** Cyan (`#00f3ff`) y Banana (`#fff44f`)
- **Efectos:** Blur, sombras neón, animaciones suaves
- **Responsive:** Diseño adaptable a móviles

## 🐛 Troubleshooting

### Error: "Firebase credentials not found"
- Verifica que `firebase-credentials.json` esté en `backend/`
- Revisa que la ruta en `.env` sea correcta

### Error: "Vertex AI no está configurado"
- Verifica que `GOOGLE_CLOUD_PROJECT` esté en `.env`
- Ejecuta `gcloud auth application-default login`
- Verifica que Vertex AI API esté habilitada

### Error: "No se encontraron APUs"
- **Ejecuta `python ingest_apus.py` primero**
- Verifica que los archivos Excel estén en `data/`
- Revisa los logs de ingesta

### El proxy no funciona
- Verifica que el backend esté corriendo en puerto 8000
- Revisa `vite.config.ts` configuración del proxy

## 📄 Licencia

Este proyecto es parte de un MVP y está disponible bajo licencia MIT.

## 🤝 Contribuciones

Este es un proyecto MVP. Para mejoras o sugerencias, abre un issue.

---

**Desarrollado con ❤️ usando React, FastAPI y Vertex AI**
