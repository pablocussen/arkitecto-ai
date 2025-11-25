# 📁 Estructura del Proyecto Arkitecto AI

```
arkitecto-ai/
│
├── 📄 README.md                    # Documentación principal
├── 📄 QUICKSTART.md                # Guía rápida de inicio
├── 📄 .gitignore                   # Archivos ignorados por Git
│
├── 📂 backend/                     # Backend Python FastAPI
│   ├── 📄 main.py                  # Aplicación FastAPI principal
│   ├── 📄 ingest_apus.py          # Script de ingesta de Excel → Firestore
│   ├── 📄 requirements.txt        # Dependencias Python
│   ├── 📄 .env.example            # Ejemplo de variables de entorno
│   ├── 📄 .gitignore              # Ignora venv, __pycache__, etc.
│   ├── 📄 run.bat                 # Script inicio Windows
│   ├── 📄 run.sh                  # Script inicio Linux/Mac
│   └── 📄 firebase-credentials.json  # (NO incluido - debes descargar)
│
├── 📂 frontend/                    # Frontend React + Vite
│   ├── 📂 public/
│   │   └── 📄 manifest.webmanifest # Configuración PWA
│   │
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📄 Header.tsx           # Componente header con logo
│   │   │   ├── 📄 MagicEyeButton.tsx   # Botón flotante "Ojo Mágico"
│   │   │   ├── 📄 BudgetList.tsx       # Lista de items presupuestados
│   │   │   └── 📄 LoadingOverlay.tsx   # Overlay de carga
│   │   │
│   │   ├── 📂 services/
│   │   │   └── 📄 api.ts               # Cliente API (axios)
│   │   │
│   │   ├── 📂 types/
│   │   │   └── 📄 index.ts             # Tipos TypeScript
│   │   │
│   │   ├── 📄 App.tsx              # Componente principal
│   │   ├── 📄 main.tsx             # Entry point
│   │   └── 📄 index.css            # Estilos globales + Tailwind
│   │
│   ├── 📄 index.html               # HTML principal
│   ├── 📄 package.json             # Dependencias Node.js
│   ├── 📄 tsconfig.json            # Configuración TypeScript
│   ├── 📄 tsconfig.node.json       # TypeScript para Vite config
│   ├── 📄 vite.config.ts           # Configuración Vite + PWA + Proxy
│   ├── 📄 tailwind.config.js       # Configuración Tailwind CSS
│   ├── 📄 postcss.config.js        # Configuración PostCSS
│   ├── 📄 vite-env.d.ts            # Types de Vite
│   └── 📄 .gitignore               # Ignora node_modules, dist, etc.
│
└── 📂 data/                        # Datos de APUs (Excel)
    ├── 📄 Presupuesto Central Loica v1.xlsx
    └── 📂 APU Ondac/
        ├── 📂 A FAENA/
        ├── 📂 B MOVIMIENTO TIERRA/
        ├── 📂 C HORMIGONES/
        ├── 📂 D. MOLDAJES Y ANDAMIOS/
        ├── 📂 E. ENFIERRADURAS/
        ├── 📂 F. ALBANILERIA Y MAMPOSTERIA/
        ├── 📂 G. ESTRUCTURA DE ACERO Y CERRAJERIA/
        └── 📂 H. DIVISIONES INTERIORES Y CARPINTERIAS/
```

## 🎯 Archivos Clave

### Backend

| Archivo | Descripción |
|---------|-------------|
| `main.py` | API FastAPI con endpoints `/analyze_budget`, `/search_apus`, `/health` |
| `ingest_apus.py` | Lee Excel, limpia datos, sube a Firestore (colección `apus_db`) |
| `requirements.txt` | FastAPI, Firebase Admin, Vertex AI, Pandas, Uvicorn |
| `.env` | Variables: FIREBASE_CREDENTIALS_PATH, GOOGLE_CLOUD_PROJECT |

### Frontend

| Archivo | Descripción |
|---------|-------------|
| `App.tsx` | Componente principal con lógica de estado |
| `MagicEyeButton.tsx` | Botón flotante con modal para captura de imagen |
| `BudgetList.tsx` | Lista animada de items presupuestados |
| `api.ts` | Cliente Axios con endpoint `/api/analyze_budget` |
| `vite.config.ts` | Proxy `/api` → `localhost:8000`, PWA config |
| `tailwind.config.js` | Colores neón (cyan, banana), animaciones custom |

## 🔄 Flujo de Datos

```
Usuario captura imagen
        ↓
MagicEyeButton → FormData(image + instruction)
        ↓
axios POST /api/analyze_budget
        ↓
FastAPI Backend → Vertex AI Gemini 1.5 Pro
        ↓
Análisis de imagen → Detecta elementos
        ↓
Busca APUs en Firestore (por keywords)
        ↓
Genera presupuesto con precios
        ↓
JSON Response → Frontend
        ↓
BudgetList renderiza items con animaciones
```

## 🎨 Stack Tecnológico

**Backend:**
- Python 3.11
- FastAPI (Web framework)
- Firebase Admin SDK (Firestore)
- Google Cloud Vertex AI (Gemini 1.5 Pro)
- Pandas (Excel processing)
- Uvicorn (ASGI server)

**Frontend:**
- React 19
- TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Framer Motion (Animations)
- Axios (HTTP client)
- vite-plugin-pwa (PWA)

## 📦 Dependencias

### Backend (`requirements.txt`)
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
firebase-admin==6.4.0
google-cloud-aiplatform==1.42.1
pandas==2.2.0
openpyxl==3.1.2
python-multipart==0.0.6
pydantic==2.5.3
python-dotenv==1.0.1
```

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.6.5",
    "framer-motion": "^11.0.3"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.12",
    "vite-plugin-pwa": "^0.17.5"
  }
}
```

## 🚀 Comandos Útiles

### Backend
```bash
# Instalar dependencias
pip install -r requirements.txt

# Ingerir datos (¡EJECUTAR PRIMERO!)
python ingest_apus.py

# Iniciar servidor
python main.py
# o
./run.sh  # Linux/Mac
run.bat   # Windows
```

### Frontend
```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview
```

## 🔐 Credenciales Necesarias

1. **Firebase Credentials** (`firebase-credentials.json`)
   - Descargar desde Firebase Console
   - Colocar en `backend/`

2. **Google Cloud Project ID**
   - Agregar a `backend/.env`
   - Habilitar Vertex AI API

3. **Application Default Credentials**
   ```bash
   gcloud auth application-default login
   ```

## 📊 Base de Datos

**Firestore Collection:** `apus_db`

**Estructura de documento:**
```json
{
  "item": "ALBANILERIA_e11.5",
  "descripcion": "ALBAÑILERIA e=11,5 CMS. LAD. REJILLA...",
  "unidad": "m2",
  "precio_unitario": 15000.50,
  "archivo_origen": "ALBANILERIA e=11,5 CMS.xlsx",
  "hoja": "Sheet1"
}
```

## 🎯 Próximos Pasos

1. **Instalar dependencias** (backend y frontend)
2. **Configurar credenciales** (Firebase + GCP)
3. **Ejecutar `ingest_apus.py`** (crítico!)
4. **Iniciar backend** (puerto 8000)
5. **Iniciar frontend** (puerto 5173)
6. **Probar la app** con una imagen de prueba

Lee [QUICKSTART.md](QUICKSTART.md) para comenzar.
