# 🚀 Quickstart - Arkitecto AI

Guía rápida para levantar el proyecto en **5 minutos**.

## ⚡ Pasos Rápidos

### 1. Instalar Dependencias Backend

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configurar Credenciales

Crea `backend/.env`:
```env
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
GOOGLE_CLOUD_PROJECT=tu-proyecto-id
GOOGLE_CLOUD_LOCATION=us-central1
PORT=8000
HOST=0.0.0.0
```

Descarga tus credenciales de Firebase y guárdalas como:
- `backend/firebase-credentials.json`

### 3. Ingerir Datos (¡IMPORTANTE!)

```bash
cd backend
python ingest_apus.py
```

Cuando pregunte "¿Deseas subir estos datos a Firestore?", responde `s`.

### 4. Iniciar Backend

```bash
# Windows:
run.bat
# Linux/Mac:
./run.sh
```

O manualmente:
```bash
python main.py
```

Verifica: http://localhost:8000/health

### 5. Instalar Dependencias Frontend

```bash
cd frontend
npm install
```

### 6. Iniciar Frontend

```bash
npm run dev
```

Abre: http://localhost:5173

## ✅ Checklist

- [ ] Python 3.11+ instalado
- [ ] Node.js 18+ instalado
- [ ] Firebase credentials descargados
- [ ] Google Cloud configurado
- [ ] Datos APUs ingeridos
- [ ] Backend corriendo en :8000
- [ ] Frontend corriendo en :5173

## 🎯 Primer Uso

1. Abre http://localhost:5173
2. Click en botón "Ojo Mágico" (flotante abajo derecha)
3. Selecciona una imagen de obra/plano
4. Escribe: "Presupuesta este proyecto"
5. Click "Analizar"

## ⚠️ Errores Comunes

**"Firebase credentials not found"**
→ Descarga `firebase-credentials.json` desde Firebase Console

**"Vertex AI no configurado"**
→ Ejecuta: `gcloud auth application-default login`

**"No se encontraron APUs"**
→ Ejecuta: `python ingest_apus.py`

**"Backend no responde"**
→ Verifica que esté corriendo en http://localhost:8000

---

¿Problemas? Lee el [README.md](README.md) completo.
