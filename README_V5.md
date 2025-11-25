# 🚀 Arkitecto AI v5.0 PRO

**Sistema revolucionario de presupuestos y visualización arquitectónica con IA**

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Version](https://img.shields.io/badge/version-5.0%20PRO-blue.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

---

## ✨ ¿Qué hace Arkitecto AI?

Transforma la manera de presupuestar y visualizar proyectos de construcción:

1. **📸 Sube una foto** de tu espacio o proyecto
2. **💰 Obtén presupuesto PRO** con APUs reales de mercado chileno
3. **🎨 Visualiza el resultado** con renders fotorrealistas generados por IA

---

## 🎯 Características v5.0 PRO

### 💎 Sistema de Presupuestos Profesional

- **40+ APUs** con precios reales de mercado CLP 2024
- **Búsqueda inteligente** por lenguaje natural
- **Transparencia total**: códigos APU, origen, precios unitarios
- **Cálculo automático**: mano de obra (15%) + imprevistos (5%)
- **Organización por necesidades** no por códigos técnicos:
  - 🏗️ Fundaciones y Estructura
  - 🧱 Muros y Tabiques
  - 🏠 Techumbre y Cubierta
  - 🚪 Puertas y Ventanas
  - 🎨 Terminaciones y Acabados
  - ⚡ Instalaciones
  - 🏊 Espacios Exteriores
  - 🛠️ Mano de Obra

### 🎨 Dream Mode - Renders Fotorrealistas

- **Análisis de imagen original** con Gemini Vision
- **Renders ultra-realistas** con Vertex AI Image Generation
- **Prompts profesionales** estilo arquitectónico cinematográfico
- **Sin personas ni astronautas** solo edificios puros
- **Contexto inteligente**: combina foto + visión del usuario
- **Calidad 8K** exportable en PNG

### 🏗️ Realidad Aumentada (WebXR)

- **Visualización 3D** de elementos arquitectónicos
- **Modelos profesionales**: piscinas, quinchos, estructuras
- **Interacción en AR** para ver proyectos en espacios reales
- **Escala real** 1:1 con dimensiones precisas

---

## 🛠️ Stack Tecnológico

### Backend
- **FastAPI** - Framework web Python ultrarrápido
- **Vertex AI** - Gemini 1.5 Flash + Image Generation
- **Firebase** - Firestore para datos persistentes
- **Python 3.11** - Lenguaje base

### Frontend
- **React 19** - Framework UI moderno
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **TailwindCSS** - Estilos utility-first
- **Three.js** - Renderizado 3D
- **WebXR** - API de Realidad Aumentada

---

## 📦 Instalación Local

### Requisitos Previos
- Python 3.11+
- Node.js 18+
- Cuenta Google Cloud con Vertex AI habilitado
- Credenciales Firebase

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/arkitecto-ai.git
cd arkitecto-ai
```

### 2. Configurar Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurar variables de entorno
export GOOGLE_CLOUD_PROJECT=arkitecto-ai-pro-v1
export GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

# Iniciar servidor
python main.py
```

Backend estará en: `http://localhost:8000`

### 3. Configurar Frontend
```bash
cd frontend
npm install

# Crear archivo .env
echo "VITE_API_URL=http://localhost:8000" > .env

# Iniciar dev server
npm run dev
```

Frontend estará en: `http://localhost:5173`

---

## 🚀 Deploy en Producción

Ver guía completa en: **[DEPLOY.md](DEPLOY.md)**

### Opción Rápida (Gratis)
- **Frontend**: Vercel
- **Backend**: Render.com

### Opción Profesional
- **Frontend**: Firebase Hosting
- **Backend**: Google Cloud Run

---

## 📖 Uso

### 1. Presupuestos Inteligentes

```
Usuario: "necesito instalar una puerta de 200x80cm"

Arkitecto AI:
✅ Categoría: Puertas y Ventanas
📋 Partidas:
  - Puerta terciado 200x80cm | Código M-110
    1 un × $85,000 = $85,000
  - Mano de obra especializada
    15% × $12,750 = $12,750
  - Imprevistos (5%)
    5% × $4,250 = $4,250

💰 Total: $102,000 CLP
```

### 2. Dream Mode

1. Sube foto del espacio actual
2. Describe tu visión: "convertir en bodega industrial moderna"
3. IA analiza contexto + genera render fotorrealista
4. Descarga o comparte el resultado

### 3. Realidad Aumentada

1. Click en "Realidad Aumentada"
2. Permite acceso a cámara
3. Selecciona modelo 3D (piscina, quincho, etc.)
4. Apunta al suelo para colocar el elemento
5. Visualiza en escala real

---

## 🎨 Capturas de Pantalla

### Dashboard Principal
![Dashboard](docs/screenshots/dashboard.png)

### Presupuesto PRO
![Presupuesto](docs/screenshots/budget.png)

### Dream Mode
![Dream Mode](docs/screenshots/dream-mode.png)

### Realidad Aumentada
![AR](docs/screenshots/ar-mode.png)

---

## 📊 Estructura del Proyecto

```
arkitecto-ai/
├── backend/
│   ├── main.py              # API FastAPI
│   ├── apu_catalog.py       # Catálogo 40+ APUs PRO
│   ├── requirements.txt     # Dependencias Python
│   └── Dockerfile          # Configuración Docker
├── frontend/
│   ├── src/
│   │   ├── App.tsx         # Componente principal
│   │   ├── components/     # Componentes React
│   │   └── assets/         # Recursos estáticos
│   ├── package.json        # Dependencias npm
│   └── vite.config.ts      # Configuración Vite
├── data/
│   ├── apu/                # APUs originales Excel
│   └── render/             # Ejemplos de renders
├── DEPLOY.md               # Guía de deploy
└── README.md               # Este archivo
```

---

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:8000/

# Respuesta esperada:
{"status":"online","brain":"v4.0 Cascade"}
```

### Test Presupuesto
```bash
curl -X POST http://localhost:8000/analyze_budget \
  -F "instruction=construir piscina 8x4m con deck"

# Respuesta:
{
  "success": true,
  "analisis": "Presupuesto profesional...",
  "presupuesto": {
    "items": [...],
    "total_estimado": 11244000,
    "moneda": "CLP"
  }
}
```

---

## 🔧 Configuración Avanzada

### Variables de Entorno Backend
```bash
GOOGLE_CLOUD_PROJECT=arkitecto-ai-pro-v1
GOOGLE_APPLICATION_CREDENTIALS=/path/to/creds.json
PORT=8000
```

### Variables de Entorno Frontend
```bash
VITE_API_URL=https://tu-backend.com
VITE_ENABLE_AR=true
```

---

## 📝 Changelog

### v5.0 PRO (Noviembre 2024)
- ✨ Sistema APU Profesional con 40+ items
- 🎨 Dream Mode con análisis de imagen
- 🚫 Eliminados astronautas de renders
- 💎 Presupuestos más precisos
- 🏗️ Mejoras de UX/UI

### v4.0 (Noviembre 2024)
- 🎨 Modo Sueño agregado
- 📱 Realidad Aumentada WebXR
- 🎯 Sistema de tabs

### v3.0 (Noviembre 2024)
- 🤖 Integración Vertex AI
- 💰 Sistema de presupuestos
- 📸 Captura de imágenes

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Pablo Cussen** - Arkitecto AI

- Proyecto: [arkitecto-ai](https://github.com/TU_USUARIO/arkitecto-ai)
- Email: tu@email.com

---

## 🙏 Agradecimientos

- Google Cloud Vertex AI
- FastAPI framework
- React team
- TailwindCSS
- Three.js community

---

## 📞 Soporte

¿Problemas o preguntas?

- 📧 Email: soporte@arkitecto.ai
- 💬 Issues: [GitHub Issues](https://github.com/TU_USUARIO/arkitecto-ai/issues)
- 📖 Docs: [Documentación completa](https://arkitecto.ai/docs)

---

**¡Construye el futuro con IA! 🚀💎**
