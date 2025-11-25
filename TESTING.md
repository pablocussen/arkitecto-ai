# 🧪 Testing y Ejemplos - Arkitecto AI

Guía para probar la aplicación y verificar que todo funcione correctamente.

## ✅ Checklist Pre-Testing

Antes de empezar, verifica:

- [ ] Backend corriendo en `http://localhost:8000`
- [ ] Frontend corriendo en `http://localhost:5173`
- [ ] Datos APUs ingeridos en Firestore (ejecutaste `ingest_apus.py`)
- [ ] Firebase y Vertex AI configurados correctamente

## 🔍 Verificación de Servicios

### 1. Health Check del Backend

```bash
# Windows (PowerShell)
Invoke-WebRequest http://localhost:8000/health

# Linux/Mac/Git Bash
curl http://localhost:8000/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "firebase": true,
  "vertex_ai": true
}
```

**Si `firebase: false`:**
- Verifica que `firebase-credentials.json` exista
- Revisa la variable `FIREBASE_CREDENTIALS_PATH` en `.env`

**Si `vertex_ai: false`:**
- Verifica que `GOOGLE_CLOUD_PROJECT` esté en `.env`
- Ejecuta: `gcloud auth application-default login`

### 2. Búsqueda de APUs

```bash
curl "http://localhost:8000/search_apus?q=muro&limit=5"
```

**Respuesta esperada:**
```json
{
  "success": true,
  "query": "muro",
  "count": 5,
  "results": [
    {
      "item": "MURO_ALBANILERIA",
      "descripcion": "ALBAÑILERIA e=11,5 CMS...",
      "unidad": "m2",
      "precio_unitario": 15000
    }
  ]
}
```

**Si `count: 0`:**
- ¡No ejecutaste `ingest_apus.py`!
- Revisa los logs de ingesta

## 📸 Testing del Frontend

### Test 1: Captura Básica

1. Abre `http://localhost:5173`
2. Deberías ver:
   - Header con logo "Arkitecto AI"
   - Indicador verde "Online"
   - Botón flotante cyan/amarillo (abajo derecha)
   - Mensaje de bienvenida

3. Haz clic en el botón "Ojo Mágico"
4. Deberías ver:
   - Modal con fondo oscuro
   - Área para capturar/seleccionar imagen
   - Campo de texto para instrucciones
   - Botones "Cancelar" y "Analizar" (deshabilitado)

### Test 2: Análisis con Imagen de Prueba

**Preparación:**
1. Descarga una imagen de prueba:
   - Plano arquitectónico
   - Foto de construcción
   - Boceto de proyecto

**Pasos:**
1. Click en botón "Ojo Mágico"
2. Click en "Capturar o seleccionar imagen"
3. Selecciona la imagen de prueba
4. Escribe instrucción:
   ```
   Necesito presupuestar un muro de albañilería de 20 metros cuadrados
   ```
5. Click "Analizar"
6. Espera 10-30 segundos (aparece overlay de carga)

**Resultado esperado:**
- Desaparece el modal
- Aparece overlay "Analizando..."
- Desaparece el overlay
- Aparece card con "Análisis" (texto)
- Aparece lista de items presupuestados con:
  - Nombre del elemento
  - Descripción detallada
  - Cantidad y unidad
  - Precio unitario
  - Subtotal
  - APU origen
- Card de resumen con total

### Test 3: PWA Installation

**Desktop (Chrome/Edge):**
1. Abre la app en el navegador
2. Busca el ícono de instalación en la barra de direcciones
3. Click "Instalar"
4. La app se abre como ventana independiente

**Mobile:**
1. Abre la app en Chrome/Safari
2. Menú → "Agregar a pantalla de inicio"
3. La app aparece como ícono en tu dispositivo

## 🧪 Test del Backend con cURL

### Test Completo del Endpoint `/analyze_budget`

**Preparación:**
Guarda una imagen de prueba como `test_image.jpg`

**Linux/Mac/Git Bash:**
```bash
curl -X POST http://localhost:8000/analyze_budget \
  -F "image=@test_image.jpg" \
  -F "instruction=Presupuesta este muro de 10 metros cuadrados"
```

**Windows (PowerShell):**
```powershell
$form = @{
    image = Get-Item -Path "test_image.jpg"
    instruction = "Presupuesta este muro de 10 metros cuadrados"
}
Invoke-RestMethod -Uri "http://localhost:8000/analyze_budget" `
  -Method Post -Form $form
```

**Respuesta esperada:**
```json
{
  "success": true,
  "analisis": "Se detectó un muro de albañilería...",
  "presupuesto": {
    "items": [
      {
        "elemento": "Muro de albañilería",
        "descripcion": "ALBAÑILERIA e=11,5 CMS...",
        "cantidad": 10,
        "unidad": "m2",
        "precio_unitario": 15000,
        "subtotal": 150000,
        "apu_origen": "ALBANILERIA_e11.5"
      }
    ],
    "total_estimado": 150000,
    "moneda": "CLP"
  },
  "metadata": {
    "elementos_detectados": 1,
    "items_con_precio": 1
  }
}
```

## 🐛 Debugging

### Backend Logs

El backend imprime logs útiles:

```
✅ Firebase inicializado
✅ Vertex AI inicializado
INFO:     Started server process [12345]
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Errores comunes:**

```
⚠️  Firebase credentials no encontradas
→ Descarga firebase-credentials.json

⚠️  Google Cloud Project ID no configurado
→ Agrega GOOGLE_CLOUD_PROJECT en .env

Error: Permission denied
→ Ejecuta: gcloud auth application-default login
```

### Frontend Console

Abre DevTools (F12) → Console

**Logs esperados:**
```
[Vite] connected
[Service Worker] registered
```

**Errores comunes:**
```
Failed to fetch
→ Backend no está corriendo

404 /api/analyze_budget
→ Proxy mal configurado en vite.config.ts

CORS error
→ Backend necesita permitir tu origen
```

## 📊 Casos de Prueba

### Caso 1: Muro Simple
**Instrucción:**
```
Presupuesta un muro de albañilería de ladrillos de 20 m2
```
**Elementos esperados:**
- Albañilería e=11.5 cm
- Mortero
- (Posiblemente) Enfierradura

### Caso 2: Radier
**Instrucción:**
```
Necesito un presupuesto para un radier de 50 metros cuadrados, espesor 10 cm
```
**Elementos esperados:**
- Radier e=10 cm
- Cama de ripio
- Polietileno
- (Posiblemente) Malla Acma

### Caso 3: Excavación
**Instrucción:**
```
Presupuesta una excavación de zanja de 15 metros lineales, ancho 1.4m, profundidad 2m
```
**Elementos esperados:**
- Excavación a brazo
- Carguío
- Retiro de escombros

### Caso 4: Proyecto Completo
**Instrucción:**
```
Analiza este plano y dame un presupuesto estimado para construir esta casa
```
**Elementos esperados:**
- Múltiples partidas
- Fundaciones
- Muros
- Losas
- Terminaciones

## 🎯 Métricas de Éxito

Una prueba exitosa debe mostrar:

✅ **Tiempo de respuesta:** 10-30 segundos
✅ **Elementos detectados:** Al menos 1
✅ **Items con precio:** Al menos 50% de los detectados
✅ **Precios coherentes:** Precios realistas en CLP
✅ **UI responsiva:** Animaciones fluidas
✅ **Sin errores 500:** Backend estable

## 🔧 Tests Avanzados

### Test de Carga

```bash
# Instalar Apache Bench
# Linux: sudo apt install apache2-utils
# Mac: viene preinstalado

# Test simple (10 requests, 2 concurrentes)
ab -n 10 -c 2 http://localhost:8000/health
```

### Test de Firebase Connection

```python
# test_firebase.py
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

db = firestore.client()

# Contar APUs
apus_ref = db.collection('apus_db')
count = len(list(apus_ref.limit(10).stream()))

print(f"✅ Firestore conectado. APUs encontrados (sample): {count}")
```

### Test de Vertex AI

```python
# test_vertex.py
import vertexai
from vertexai.generative_models import GenerativeModel
import os
from dotenv import load_dotenv

load_dotenv()

project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
vertexai.init(project=project_id, location='us-central1')

model = GenerativeModel('gemini-1.5-pro')
response = model.generate_content("Di 'Hola Arkitecto AI'")

print(f"✅ Vertex AI conectado. Respuesta: {response.text}")
```

## 📝 Registro de Tests

Documenta tus pruebas:

| Fecha | Test | Resultado | Tiempo | Notas |
|-------|------|-----------|--------|-------|
| 2024-01-15 | Health Check | ✅ Pass | 50ms | Todo OK |
| 2024-01-15 | Muro Simple | ✅ Pass | 18s | 3 items detectados |
| 2024-01-15 | Radier | ⚠️ Warning | 25s | 1 item sin precio |

## 🎓 Troubleshooting Guide

### Error: "No se encontraron APUs"

**Síntomas:**
- `metadata.items_con_precio: 0`
- Todos los items tienen `precio_unitario: 0`

**Solución:**
```bash
cd backend
python ingest_apus.py
# Confirma con 's' cuando pregunte
```

### Error: "Vertex AI timeout"

**Síntomas:**
- La petición tarda más de 60 segundos
- Error 504 Gateway Timeout

**Solución:**
- Imagen muy grande → Redimensiona a max 2MB
- Reinicia el backend
- Verifica cuota de Vertex AI en GCP Console

### Error: "JSON parse error"

**Síntomas:**
- Backend retorna HTML en lugar de JSON
- Frontend muestra estructura vacía

**Solución:**
- Revisa logs del backend
- Gemini puede retornar texto en lugar de JSON
- El backend tiene fallback, revisa los logs

---

**¿Encontraste un bug?** Documenta:
1. Qué hiciste
2. Qué esperabas
3. Qué obtuviste
4. Logs del backend/frontend
