# ⚡ Quick Test - Features PRO

Guía rápida para probar las nuevas capacidades PRO de Arkitecto AI.

---

## 🎯 Pre-requisitos

- ✅ Backend corriendo en `http://localhost:8000`
- ✅ Frontend corriendo en `http://localhost:5173`
- ✅ Dependencias instaladas (`npm install` ejecutado)

---

## 🧪 Test 1: Sistema de Tabs

**Objetivo:** Verificar navegación entre tabs

### Pasos:

1. Abre `http://localhost:5173`
2. Deberías ver **2 tabs** en el header:
   - "Presupuesto" (ícono calculadora)
   - "Visión" (ícono estrella + badge "PRO")

3. Click en tab **"Visión"**
   - ✅ Debe cambiar contenido
   - ✅ Underline animado debajo del tab
   - ✅ Color cambia a banana (#fff44f)

4. Click en tab **"Presupuesto"**
   - ✅ Vuelve al contenido original
   - ✅ Underline vuelve
   - ✅ Color cyan (#00f3ff)

**Resultado esperado:**
```
✅ Tabs funcionan
✅ Animaciones smooth
✅ Contenido cambia correctamente
```

---

## 🎨 Test 2: Modo Sueño (Dream Mode)

**Objetivo:** Generar un render con IA

### Pasos:

1. Navega a tab **"Visión"**

2. Click en card **"Modo Sueño"**
   - ✅ Abre modal full-screen
   - ✅ Fondo oscuro con blur
   - ✅ Header "Modo Sueño"

3. **Sube una imagen:**
   - Click "Capturar o seleccionar foto"
   - Elige una foto de un espacio (patio, jardín, etc.)
   - ✅ Preview debe aparecer

4. **Escribe un prompt:**
   ```
   Piscina moderna con deck de madera y luces LED perimetrales
   ```

5. Click **"Generar Visión"**
   - ✅ Aparece loading spinner
   - ✅ Mensaje "Soñando..."
   - ✅ Espera 10-30 segundos

6. **Ver resultado:**
   - ✅ Imagen generada aparece
   - ✅ O descripción en SVG (si fallback)

### Test con cURL (Backend directo):

```bash
# Preparar imagen de test
# Guarda una foto como test.jpg

curl -X POST http://localhost:8000/generate_sketch \
  -F "image=@test.jpg" \
  -F "prompt=Piscina moderna con deck de madera"
```

**Resultado esperado:**
```json
{
  "success": true,
  "generated_image": "data:image/png;base64,...",
  "note": "..."
}
```

### Modos de Operación:

**Modo A: Image Generation (Producción)**
- Requiere Vertex AI configurado
- Genera PNG fotorrealista real

**Modo B: Fallback (Demo)**
- Usa Gemini para descripción
- Genera SVG con texto

---

## 📱 Test 3: AR Mode

**Objetivo:** Visualizar modelo 3D en AR

### Test Desktop (Sin AR, solo 3D viewer):

1. Navega a tab **"Visión"**

2. Click en card **"Realidad Aumentada"**
   - ✅ Aparece selector de modelos
   - ✅ 3 opciones: Muro 🧱, Piscina 🏊, Quincho 🏡

3. Click en **"Muro"**
   - ✅ Abre ARVisualizer full-screen
   - ✅ Modelo 3D visible
   - ✅ Fondo oscuro

4. **Interactuar con modelo:**
   - Arrastra mouse → Rotar modelo
   - Scroll → Zoom
   - ✅ Auto-rotate activo

5. **Panel de instrucciones:**
   - ✅ Card arriba-izquierda con tips
   - ✅ Badge "WebXR Ready"

6. **Botón AR:**
   - ✅ Visible abajo (gradiente cyan/banana)
   - ✅ Texto "Ver en Mi Espacio"

7. Click **X** para cerrar
   - ✅ Vuelve a tab Visión

### Test Mobile (Con AR):

**Requisitos:**
- Smartphone Android 7+ o iPhone iOS 12+
- Chrome (Android) o Safari (iOS)

**Pasos:**

1. Abre app en móvil: `http://[TU-IP]:5173`

2. Navega a tab **"Visión"** → **"Realidad Aumentada"**

3. Selecciona **"Piscina"**

4. Click **"Ver en Mi Espacio"**
   - ✅ Solicita permisos de cámara
   - ✅ Se activa cámara nativa
   - ✅ AR mode activo

5. **Apunta al piso:**
   - Mueve el dispositivo lentamente
   - ✅ Aparecen puntos/plano de tracking
   - ✅ Modelo aparece en espacio real

6. **Verificar:**
   - ✅ Escala 1:1 (tamaño real)
   - ✅ Sombras proyectadas
   - ✅ Se mueve con el dispositivo

**Resultado esperado:**
```
✅ AR se activa
✅ Modelo visible en espacio real
✅ Tracking estable
```

### Verificar WebXR Support:

Abre DevTools → Console:

```javascript
if (navigator.xr) {
  navigator.xr.isSessionSupported('immersive-ar').then(supported => {
    console.log('AR Supported:', supported)
  })
} else {
  console.log('WebXR no disponible')
}
```

---

## 🔍 Test 4: Permisos PWA

**Objetivo:** Verificar que PWA solicita permisos correctamente

### Pasos:

1. Abre la app

2. Intenta usar **Modo Sueño**
   - ✅ Solicita permiso de cámara al subir imagen

3. Intenta usar **AR Mode**
   - ✅ Solicita permiso de cámara
   - ✅ Solicita permisos de sensores (en móvil)

4. Verifica en Settings del navegador:
   - Permisos → Arkitecto AI
   - ✅ Cámara: Permitido
   - ✅ Sensores de movimiento: Permitido (móvil)

---

## 🎯 Test 5: Integración Completa

**Objetivo:** Flujo end-to-end

### Escenario:

**Usuario quiere presupuestar una piscina:**

1. **Paso 1: Análisis de presupuesto**
   - Click "Ojo Mágico"
   - Sube foto de jardín
   - Instrucción: "Presupuesta una piscina de 8x4 metros"
   - ✅ Obtiene presupuesto en tab "Presupuesto"

2. **Paso 2: Visualizar render**
   - Navega a tab "Visión"
   - Click "Modo Sueño"
   - Sube misma foto
   - Prompt: "Piscina moderna 8x4m con deck de madera"
   - ✅ Ve render generado

3. **Paso 3: Ver en AR**
   - En tab "Visión"
   - Click "Realidad Aumentada"
   - Selecciona "Piscina"
   - Click "Ver en Mi Espacio" (móvil)
   - ✅ Coloca piscina en jardín real

**Resultado:**
```
✅ Presupuesto generado
✅ Render visualizado
✅ AR funcionando
✅ Experiencia completa PRO
```

---

## 📊 Checklist de Validación

### UI General:
- [ ] Tabs visibles y funcionando
- [ ] Badge "PRO" visible en tab Visión
- [ ] Animaciones smooth (no lag)
- [ ] Glassmorphism aplicado correctamente
- [ ] Colores cyan/banana consistentes

### Modo Sueño:
- [ ] Modal abre correctamente
- [ ] Upload de imagen funciona
- [ ] Preview visible
- [ ] Prompts sugeridos funcionan
- [ ] Botón "Generar Visión" habilitado
- [ ] Loading state visible
- [ ] Imagen/descripción generada aparece
- [ ] Botones descarga/compartir visibles

### AR Mode:
- [ ] Selector de modelos visible
- [ ] ARVisualizer abre al seleccionar
- [ ] Modelo 3D carga
- [ ] Controles (rotar/zoom) funcionan
- [ ] Instrucciones visibles
- [ ] Botón AR visible
- [ ] Botón cerrar funciona

### Permisos:
- [ ] Solicita cámara en Modo Sueño
- [ ] Solicita cámara en AR
- [ ] Solicita sensores en AR (móvil)
- [ ] No hay errores de permisos

### Backend:
- [ ] Endpoint /generate_sketch responde
- [ ] Tiempo de respuesta < 60s
- [ ] No hay errores 500
- [ ] Logs claros en consola

---

## 🐛 Errores Comunes y Soluciones

### Error: "Cannot find module '@google/model-viewer'"

**Causa:** Dependencia no instalada

**Solución:**
```bash
cd frontend
npm install @google/model-viewer
npm run dev
```

### Error: "vision_models no disponible"

**Causa:** Vertex AI Image Generation no configurado

**Resultado:**
- ✅ Fallback automático activo
- ✅ Gemini genera descripción
- ✅ SVG con texto aparece

**Para habilitar producción:**
```bash
gcloud services enable aiplatform.googleapis.com
```

### Error: "WebXR no soportado"

**Causa:** Navegador o dispositivo incompatible

**Verificar:**
- Chrome Android 79+
- Safari iOS 12+
- ARCore/ARKit instalado

**Workaround:**
- ✅ Viewer 3D funciona sin AR
- Rotar y zoom disponibles

### Modelo 3D no carga

**Síntoma:** Spinner infinito

**Debug:**
```javascript
// DevTools → Network
// Buscar request a .glb
// Ver status code
```

**Solución:**
- Verificar URL del modelo
- Comprobar CORS
- Usar modelos de ejemplo de Google

---

## 🎓 Comandos Útiles

### Verificar instalación:

```bash
# Dependencias frontend
cd frontend
npm list @google/model-viewer

# Debería mostrar:
# @google/model-viewer@3.4.0
```

### Logs del backend:

```bash
cd backend
python main.py

# Buscar líneas:
# ✅ Firebase inicializado
# ✅ Vertex AI inicializado
```

### Test rápido de endpoint:

```bash
# Health check
curl http://localhost:8000/health

# Debería retornar:
# {"status":"healthy","firebase":true,"vertex_ai":true}
```

### DevTools Console (Frontend):

```javascript
// Verificar components cargados
console.log(window.location.pathname)

// Verificar WebXR
console.log('XR:', !!navigator.xr)

// Verificar modelo cargado
document.querySelector('model-viewer')
```

---

## ✅ Resultado Esperado

Si todos los tests pasan:

```
✅ Sistema de tabs funcionando
✅ Modo Sueño genera renders
✅ AR Mode visualiza modelos 3D
✅ Permisos PWA correctos
✅ Integración completa end-to-end
✅ UI PRO con glassmorphism
✅ Animaciones smooth
✅ Sin errores críticos
```

---

## 📞 Si Algo Falla

1. **Revisa este documento** desde el principio
2. **Lee [PRO_FEATURES.md](PRO_FEATURES.md)** sección Troubleshooting
3. **Verifica logs** del backend y frontend
4. **Comprueba permisos** del navegador
5. **Prueba en otro dispositivo** (si es problema de AR)

---

## 🎉 ¡Test Completado!

Si llegaste hasta aquí y todos los tests pasaron:

**🌟 Arkitecto AI PRO está funcionando correctamente!**

Próximos pasos:
- Configura Vertex AI Image Gen para producción
- Reemplaza modelos 3D con arquitectónicos reales
- Prueba con clientes reales
- Recopila feedback

---

**Tiempo estimado de testing:** 15-20 minutos
**Última actualización:** 2024-11-23
