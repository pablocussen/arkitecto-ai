# 🌟 Arkitecto AI - Features PRO

Guía completa de las capacidades avanzadas de visualización de Arkitecto AI.

---

## 🎯 ¿Qué incluye el Upgrade PRO?

El upgrade PRO agrega dos herramientas poderosas de visualización:

1. **Modo Sueño** (Dream Mode) - Generación de renders con IA
2. **Realidad Aumentada** (AR Mode) - Visualización 3D en espacios reales

---

## ✨ Feature 1: Modo Sueño (Dream Mode)

### ¿Qué es?

El Modo Sueño utiliza **Vertex AI Image Generation** para crear renders fotorrealistas de tus proyectos antes de construirlos.

### ¿Cómo funciona?

```
Foto de tu espacio → Descripción de la mejora → IA genera render → Visualización
```

### Casos de uso:

- **Renovaciones:** "Piscina moderna con deck de madera"
- **Mejoras:** "Quincho con parrilla y zona de estar"
- **Nuevas construcciones:** "Jardín vertical con iluminación LED"
- **Visualización de proyectos:** Muestra al cliente cómo se verá antes de construir

### Cómo usar:

1. Ve a la pestaña **"Visión"**
2. Click en **"Modo Sueño"**
3. Captura o sube una **foto del espacio actual**
4. Escribe tu **visión** (ej: "Piscina moderna con deck")
5. Click **"Generar Visión"**
6. Espera 10-30 segundos
7. ¡Visualiza tu proyecto soñado!

### Tecnología:

**Backend:**
- Vertex AI Image Generation Model (`imagegeneration@006`)
- Prompt engineering para arquitectura
- Fallback a Gemini con descripción detallada

**Prompts optimizados:**
```
Photorealistic architectural renovation render.
Base context: Construction site, residential space, outdoor area.
User vision: {TU_DESCRIPCION}
Style: Modern, clean, professional architecture visualization.
Lighting: Natural daylight, high quality rendering.
Details: Show materials, textures, realistic proportions.
```

### Output:

- Imagen generada en formato PNG/Base64
- Resolución: 800x600 (configurable)
- Estilo: Fotorrealista, renderizado arquitectónico
- Tiempo: 10-30 segundos

### Modos de operación:

**Modo 1: Image Generation (Producción)**
- Requiere Vertex AI habilitado
- Genera renders fotorrealistas reales
- Calidad profesional

**Modo 2: Demo/Fallback**
- Usa Gemini para descripción textual
- Genera SVG con la descripción
- Útil para testing sin configurar Image Gen

---

## 📱 Feature 2: Realidad Aumentada (AR Mode)

### ¿Qué es?

El AR Mode utiliza **WebXR** y **Google Model Viewer** para visualizar elementos constructivos en 3D directamente en tu espacio físico.

### ¿Cómo funciona?

```
Selecciona elemento 3D → Abre cámara AR → Coloca en espacio real → Visualiza escala real
```

### Elementos disponibles:

| Elemento | Descripción | Uso |
|----------|-------------|-----|
| 🧱 Muro | Muro de albañilería | Visualizar altura y largo |
| 🏊 Piscina | Piscina moderna | Ver dimensiones reales |
| 🏡 Quincho | Quincho con deck | Planificar distribución |

### Cómo usar:

1. Ve a la pestaña **"Visión"**
2. Click en **"Realidad Aumentada"**
3. Selecciona un **elemento** (Muro/Piscina/Quincho)
4. Se abre el **AR Viewer**
5. Rota y escala el modelo con gestos:
   - **Arrastra:** Rotar
   - **Pellizca:** Zoom
6. Click **"Ver en Mi Espacio"**
7. La cámara se activa en modo AR
8. Apunta al piso/pared
9. El elemento aparece **a escala real**

### Tecnología:

**Frontend:**
```typescript
// Importar model-viewer
import '@google/model-viewer'

// Componente ARVisualizer
<model-viewer
  src={modelUrl}
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  shadow-intensity="1"
/>
```

**Modelos 3D:**
- Formato: GLB (Binary GLTF)
- Fuente: Google Model Viewer samples (placeholder)
- Producción: Reemplazar con modelos arquitectónicos reales

**AR Modes soportados:**
- `webxr` - WebXR en navegadores compatibles (Chrome Android)
- `scene-viewer` - Google Scene Viewer (Android)
- `quick-look` - AR Quick Look (iOS Safari)

### Requisitos:

**Dispositivo:**
- Smartphone Android 7+ con ARCore
- iPhone iOS 12+ con ARKit
- Navegadores: Chrome, Safari

**Permisos PWA:**
```json
{
  "permissions": [
    "camera",
    "gyroscope",
    "accelerometer",
    "magnetometer"
  ],
  "features": [
    "xr-spatial-tracking"
  ]
}
```

---

## 🎨 Diseño de la UI PRO

### Sistema de Tabs

**Tab 1: Presupuesto**
- Vista clásica de presupuestos
- Lista de items con precios
- Análisis de IA

**Tab 2: Visión** (PRO)
- Badge "PRO" en gradiente cyan/banana
- Dos cards principales:
  - Modo Sueño (Imagen)
  - Realidad Aumentada (3D)

### Colores PRO:

```css
/* Modo Sueño - Cyan dominant */
border: neon-cyan/50
hover: neon-cyan/80

/* AR Mode - Banana dominant */
border: neon-banana/50
hover: neon-banana/80
```

### Animaciones:

- **Entrada de modales:** Fade + Scale
- **Tabs:** Slide underline
- **Cards:** Hover scale
- **Loading:** Rotating gradient border

---

## 🔧 Configuración y Setup

### Backend - Vertex AI Image Generation

1. **Habilitar API:**
```bash
gcloud services enable aiplatform.googleapis.com
```

2. **Verificar disponibilidad:**
```python
from vertexai.preview.vision_models import ImageGenerationModel

model = ImageGenerationModel.from_pretrained("imagegeneration@006")
print("✅ Image Generation disponible")
```

3. **Probar endpoint:**
```bash
curl -X POST http://localhost:8000/generate_sketch \
  -F "image=@test.jpg" \
  -F "prompt=Piscina moderna con deck"
```

### Frontend - Model Viewer

1. **Instalar dependencia:**
```bash
npm install @google/model-viewer
```

2. **Importar en component:**
```typescript
import '@google/model-viewer'
```

3. **Declarar tipos (TypeScript):**
```typescript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any
    }
  }
}
```

### PWA - Permisos

El manifest ya está configurado con:
- Permisos de cámara
- Sensores de movimiento
- XR spatial tracking

**Auto-solicita permisos al:**
- Abrir AR Viewer
- Abrir Dream Mode (cámara)

---

## 📊 Flujo de Datos PRO

### Modo Sueño:

```
[Frontend] Usuario sube foto + prompt
     ↓
[Frontend] DreamMode.tsx → generateSketch()
     ↓
[API] POST /generate_sketch
     ↓
[Backend] Vertex AI Image Generation
     ↓
[Backend] Generate image / Fallback description
     ↓
[API] Response { generated_image: base64 }
     ↓
[Frontend] Muestra imagen generada
```

### AR Mode:

```
[Frontend] Usuario selecciona elemento
     ↓
[Frontend] ARVisualizer.tsx monta <model-viewer>
     ↓
[Model Viewer] Carga modelo GLB
     ↓
[Usuario] Click "Ver en Mi Espacio"
     ↓
[WebXR] Activa cámara AR
     ↓
[Device] Coloca modelo en espacio real
```

---

## 🎯 Casos de Uso Reales

### Caso 1: Presentación a Cliente

**Escenario:**
Constructor necesita mostrar cómo se verá una renovación.

**Flujo:**
1. Toma foto del patio actual
2. Usa Modo Sueño: "Quincho moderno con parrilla integrada"
3. Genera render en 20 segundos
4. Muestra al cliente el resultado
5. Cliente aprueba y solicita presupuesto
6. Usa tab Presupuesto para cotizar

**Resultado:**
- Cliente visualiza antes de comprometerse
- Cierre de venta más rápido
- Expectativas alineadas

### Caso 2: Planificación de Espacio

**Escenario:**
Dueño de casa quiere ver si cabe una piscina.

**Flujo:**
1. Abre AR Mode
2. Selecciona "Piscina"
3. Coloca modelo 3D en su jardín
4. Ve dimensiones reales a escala
5. Decide tamaño y ubicación
6. Solicita presupuesto

**Resultado:**
- Visualización espacial precisa
- Decisión informada
- Sin sorpresas en construcción

### Caso 3: Comparación de Opciones

**Escenario:**
Cliente indeciso entre 3 opciones.

**Flujo PRO:**
1. Genera 3 renders diferentes:
   - "Piscina rectangular moderna"
   - "Piscina circular con cascada"
   - "Piscina infinity edge"
2. Compara visualizaciones
3. Usa AR para ver opción favorita in-situ
4. Decide y presupuesta

**Resultado:**
- Exploración rápida de alternativas
- Decisión visual
- Cliente satisfecho

---

## 🚀 Optimizaciones y Best Practices

### Performance:

**Lazy Loading de componentes:**
```typescript
// No cargar AR/Dream hasta que se usen
const ARVisualizer = lazy(() => import('./ARVisualizer'))
const DreamMode = lazy(() => import('./DreamMode'))
```

**Caché de modelos 3D:**
```typescript
// Model viewer cachea automáticamente GLB
// Usar CDN para modelos en producción
```

### UX:

**Loading States:**
- Skeleton screens mientras carga
- Progress indicators
- Mensajes informativos

**Error Handling:**
- Fallback si WebXR no soportado
- Mensaje claro si Image Gen falla
- Modo demo siempre disponible

### Seguridad:

**Validación de imágenes:**
```python
# Limitar tamaño
max_size = 10 * 1024 * 1024  # 10MB

# Validar tipo
allowed_types = ['image/jpeg', 'image/png', 'image/webp']
```

**Rate Limiting:**
```python
# Limitar requests por usuario
# Evitar abuso de API de Image Gen
```

---

## 📱 Soporte de Dispositivos

### Modo Sueño:

| Dispositivo | Soporte | Notas |
|-------------|---------|-------|
| Desktop | ✅ | Sube foto desde disco |
| Mobile | ✅ | Captura con cámara |
| Tablet | ✅ | Ambos modos |

### AR Mode:

| Dispositivo | Soporte | Tecnología |
|-------------|---------|------------|
| Android 7+ | ✅ | ARCore + WebXR |
| iOS 12+ | ✅ | ARKit + Quick Look |
| Desktop | ⚠️ | Solo viewer 3D |
| Tablet | ✅ | Mismo que mobile |

---

## 🔍 Troubleshooting PRO

### Error: "vision_models no disponible"

**Causa:** Vertex AI Image Generation no instalado

**Solución:**
```bash
pip install --upgrade google-cloud-aiplatform
```

**Workaround:**
Usa el fallback automático con Gemini (descripción textual)

### Error: "AR no soportado"

**Causa:** Dispositivo sin ARCore/ARKit

**Verificar:**
```javascript
if (navigator.xr) {
  navigator.xr.isSessionSupported('immersive-ar')
    .then(supported => console.log('AR:', supported))
}
```

**Solución:**
- Usar navegador compatible (Chrome/Safari)
- Actualizar sistema operativo
- Probar en otro dispositivo

### Modelos 3D no cargan

**Causa:** CORS o URL incorrecta

**Solución:**
```typescript
// Verificar modelo accesible
fetch(MODEL_URL)
  .then(res => console.log('Model OK:', res.ok))
  .catch(err => console.error('Model Error:', err))
```

---

## 📈 Métricas y Analytics

### Tracking recomendado:

```javascript
// Uso de Modo Sueño
analytics.track('dream_mode_used', {
  prompt_length: prompt.length,
  generation_time: time_ms
})

// Uso de AR
analytics.track('ar_mode_used', {
  model_type: 'muro' | 'piscina' | 'quincho',
  device_type: 'mobile' | 'desktop'
})
```

---

## 🎓 Recursos Adicionales

### Documentación Oficial:

- [Vertex AI Image Generation](https://cloud.google.com/vertex-ai/docs/generative-ai/image/overview)
- [Google Model Viewer](https://modelviewer.dev/)
- [WebXR Device API](https://immersiveweb.dev/)
- [ARCore](https://developers.google.com/ar)
- [ARKit](https://developer.apple.com/augmented-reality/)

### Modelos 3D:

- [Sketchfab](https://sketchfab.com/) - Modelos arquitectónicos
- [Google Poly](https://poly.pizza/) - Assets gratuitos
- [TurboSquid](https://www.turbosquid.com/) - Modelos profesionales

### Prompts de IA:

- [PromptHero](https://prompthero.com/) - Prompts para arquitectura
- [Lexica](https://lexica.art/) - Ejemplos de renders

---

## ✅ Checklist de Activación PRO

### Backend:

- [ ] Vertex AI habilitado
- [ ] Image Generation API activa
- [ ] Endpoint `/generate_sketch` funcionando
- [ ] Fallback a Gemini configurado
- [ ] Logs de debug activos

### Frontend:

- [ ] `@google/model-viewer` instalado
- [ ] Componente ARVisualizer creado
- [ ] Componente DreamMode creado
- [ ] Tab "Visión" visible
- [ ] Permisos PWA configurados

### Testing:

- [ ] Generar render de prueba
- [ ] Abrir AR en móvil
- [ ] Verificar permisos de cámara
- [ ] Probar todos los modelos 3D
- [ ] Validar en iOS y Android

---

## 🎉 Resumen

**Arkitecto AI PRO te da:**

✅ Generación de renders con IA (Modo Sueño)
✅ Visualización AR en espacios reales
✅ UI moderna con tabs
✅ Experiencia mobile-first
✅ Fallbacks para máxima compatibilidad
✅ PWA con permisos optimizados

**Stack completo:**
- Frontend: React + Model Viewer + WebXR
- Backend: Vertex AI Image Generation + Gemini
- Diseño: Glassmorphism PRO

---

**¿Listo para visualizar el futuro?** 🚀

Lee [README.md](README.md) para setup inicial, luego activa features PRO y empieza a generar renders!
