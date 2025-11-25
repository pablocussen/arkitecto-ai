# 📚 Arkitecto AI - Índice de Documentación

Bienvenido a **Arkitecto AI** - Sistema de análisis inteligente de presupuestos de construcción.

---

## 🚀 Inicio Rápido

**¿Primera vez?** Comienza aquí:

1. **[QUICKSTART.md](QUICKSTART.md)** ⚡
   - Guía de inicio en 5 minutos
   - Comandos esenciales
   - Checklist de configuración

2. **Ejecuta el setup automático:**
   ```bash
   # Windows
   setup.bat

   # Linux/Mac
   ./setup.sh
   ```

---

## 📖 Documentación Principal

### 🌟 [PRO_FEATURES.md](PRO_FEATURES.md) - Features PRO (¡NUEVO!)
**Léelo para descubrir:**
- 🎨 Modo Sueño - Generación de renders con IA
- 📱 Realidad Aumentada - Visualización 3D en espacios reales
- 🎯 Sistema de Tabs - Interfaz dual Presupuesto + Visión
- 🏗️ Modelos 3D AR - Muro, Piscina, Quincho
- 📊 Casos de uso y ejemplos
- 🔧 Configuración completa
- ⚡ Optimizaciones y best practices

### 1️⃣ [README.md](README.md) - Documentación Completa
**Léelo si necesitas:**
- Entender qué hace Arkitecto AI
- Ver la arquitectura completa
- Instrucciones detalladas de instalación
- Documentación de API endpoints
- Guía de troubleshooting

**Secciones clave:**
- ✨ Características (Core + PRO)
- 🏗️ Arquitectura
- 🚀 Instalación y configuración
- 📱 Guía de uso
- 🛠️ Tecnologías
- 🔧 API Endpoints
- 🐛 Troubleshooting

---

### 2️⃣ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Estructura del Código
**Léelo si necesitas:**
- Entender la organización de archivos
- Saber dónde está cada componente
- Ver el stack tecnológico
- Conocer el flujo de datos
- Comandos útiles por directorio

**Incluye:**
- 📁 Árbol completo de archivos
- 🎯 Descripción de archivos clave
- 🔄 Diagrama de flujo de datos
- 📦 Lista de dependencias
- 💾 Estructura de base de datos

---

### 3️⃣ [TESTING.md](TESTING.md) - Pruebas y Debugging
**Léelo si necesitas:**
- Verificar que todo funciona
- Hacer pruebas del sistema
- Resolver errores
- Tests con cURL
- Casos de prueba específicos

**Incluye:**
- ✅ Checklist pre-testing
- 🔍 Verificación de servicios
- 📸 Tests del frontend
- 🧪 Tests del backend con cURL
- 🐛 Guía de debugging
- 📝 Registro de tests

---

### 4️⃣ [BUILD_SUMMARY.md](BUILD_SUMMARY.md) - Resumen de Construcción
**Léelo si necesitas:**
- Ver qué se construyó exactamente
- Verificar completitud del proyecto
- Conocer el estado actual
- Lista de archivos creados
- Próximos pasos sugeridos

**Incluye:**
- 📦 Componentes entregados
- ✅ Checklist de features
- 🎨 Diseño visual implementado
- 🔄 Arquitectura de la solución
- 📊 Estadísticas del proyecto

---

## 🎯 Guías por Rol

### Si eres Developer Backend:
1. Lee [README.md](README.md) sección "Backend"
2. Revisa [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) sección "Backend"
3. Verifica API en [TESTING.md](TESTING.md) sección "Backend Logs"

**Archivos clave:**
- `backend/main.py` - API FastAPI
- `backend/ingest_apus.py` - Ingesta de datos
- `backend/requirements.txt` - Dependencias

### Si eres Developer Frontend:
1. Lee [README.md](README.md) sección "Frontend"
2. Revisa [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) sección "Frontend"
3. Prueba UI en [TESTING.md](TESTING.md) sección "Testing del Frontend"

**Archivos clave:**
- `frontend/src/App.tsx` - Componente principal
- `frontend/src/components/` - Componentes React
- `frontend/vite.config.ts` - Configuración

### Si eres DevOps:
1. Lee [QUICKSTART.md](QUICKSTART.md) para setup
2. Revisa [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) sección "Dependencias"
3. Configura según [README.md](README.md) sección "Configuración"

**Archivos clave:**
- `setup.sh` / `setup.bat` - Scripts de setup
- `backend/.env.example` - Variables de entorno
- `backend/requirements.txt` - Deps Python
- `frontend/package.json` - Deps Node

### Si eres QA/Tester:
1. Lee [QUICKSTART.md](QUICKSTART.md) para levantar el proyecto
2. Sigue [TESTING.md](TESTING.md) completo
3. Documenta bugs según [TESTING.md](TESTING.md) sección "Registro de Tests"

---

## 📁 Estructura de Carpetas

```
arkitecto-ai/
├── 📄 INDEX.md (este archivo)
├── 📄 README.md
├── 📄 QUICKSTART.md
├── 📄 PROJECT_STRUCTURE.md
├── 📄 TESTING.md
├── 📄 BUILD_SUMMARY.md
├── 🔧 setup.sh / setup.bat
│
├── 📂 backend/          → API Python FastAPI
├── 📂 frontend/         → PWA React
└── 📂 data/            → Archivos Excel con APUs
```

---

## 🔗 Enlaces Rápidos

| Necesito... | Ir a... |
|-------------|---------|
| Instalar todo rápido | [QUICKSTART.md](QUICKSTART.md) |
| Entender el proyecto | [README.md](README.md) |
| Ver estructura de código | [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) |
| Probar la app | [TESTING.md](TESTING.md) |
| Ver qué se construyó | [BUILD_SUMMARY.md](BUILD_SUMMARY.md) |
| Setup automático | `setup.sh` o `setup.bat` |

---

## 🎓 Flujo de Lectura Recomendado

### Para empezar (20 min):
1. [INDEX.md](INDEX.md) (este archivo) - 2 min
2. [QUICKSTART.md](QUICKSTART.md) - 5 min
3. Ejecuta `setup.sh` o `setup.bat` - 5 min
4. [README.md](README.md) secciones clave - 8 min

### Para profundizar (1 hora):
1. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) completo - 20 min
2. [README.md](README.md) completo - 30 min
3. [TESTING.md](TESTING.md) secciones relevantes - 10 min

### Para ser experto (2-3 horas):
1. Lee toda la documentación
2. Revisa el código fuente
3. Ejecuta todos los tests
4. Experimenta con el sistema

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| No arranca el backend | Lee [README.md](README.md) sección "Troubleshooting" |
| Frontend no conecta | Verifica proxy en [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) |
| No se encuentran APUs | Ejecuta `python ingest_apus.py` ([QUICKSTART.md](QUICKSTART.md)) |
| Errores de credenciales | [README.md](README.md) sección "Configurar Credenciales" |
| Tests fallan | [TESTING.md](TESTING.md) sección "Debugging" |

---

## 📞 Recursos Adicionales

### Dentro del proyecto:
- `backend/.env.example` - Template de configuración
- `frontend/package.json` - Lista de dependencias frontend
- `backend/requirements.txt` - Lista de dependencias backend

### Stack tecnológico:
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
- **Backend:** Python 3.11, FastAPI, Firebase, Vertex AI
- **Base de datos:** Firestore
- **IA:** Google Gemini 1.5 Pro

### Enlaces externos:
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
- [Firebase Docs](https://firebase.google.com/docs)

---

## ✅ Checklist de Onboarding

Marca cuando completes cada paso:

- [ ] Leí INDEX.md (este archivo)
- [ ] Leí QUICKSTART.md
- [ ] Ejecuté setup.sh o setup.bat
- [ ] Configuré backend/.env
- [ ] Descargué firebase-credentials.json
- [ ] Ejecuté python ingest_apus.py
- [ ] Levanté el backend (puerto 8000)
- [ ] Levanté el frontend (puerto 5173)
- [ ] Probé la app con una imagen
- [ ] Leí README.md completo
- [ ] Revisé PROJECT_STRUCTURE.md
- [ ] Hice al menos un test de TESTING.md

---

## 🎯 Próximos Pasos

1. **Si aún no instalaste nada:**
   → Lee [QUICKSTART.md](QUICKSTART.md) y ejecuta `setup.sh`

2. **Si ya instalaste pero no funciona:**
   → Lee [README.md](README.md) sección "Troubleshooting"

3. **Si ya funciona y quieres entender más:**
   → Lee [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

4. **Si quieres hacer pruebas:**
   → Lee [TESTING.md](TESTING.md)

5. **Si quieres ver qué más falta:**
   → Lee [BUILD_SUMMARY.md](BUILD_SUMMARY.md) sección "Próximos Pasos"

---

**¡Bienvenido a Arkitecto AI!** 🏗️✨

Para comenzar ahora mismo:
```bash
./setup.sh  # o setup.bat en Windows
```

Luego lee [QUICKSTART.md](QUICKSTART.md)
