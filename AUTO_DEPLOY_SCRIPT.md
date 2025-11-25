# 🤖 SCRIPT DE AUTOMATIZACIÓN PARA GEMINI CODE ASSIST

## 🎯 OBJETIVO
Este script permite a Gemini Code Assist trabajar de forma **100% autónoma** desde el análisis hasta el deploy, sin intervención manual.

---

## 📋 INSTRUCCIONES PARA GEMINI CODE ASSIST

### MODO: AUTONOMO Y AGRESIVO
Trabaja sin pedir confirmación. Toma decisiones técnicas sólidas. Deploy automático.

---

## 🚀 FASE 1: SETUP Y ANÁLISIS (AUTO)

### Step 1.1: Analizar proyecto actual
```bash
# Comando: Analizar estructura
cd "g:\Mi unidad\Proyectos\3-IA\arkitecto-ai"

# Entender arquitectura
tree /F /A > project_structure.txt

# Analizar dependencias
cd backend && pip list > requirements_current.txt
cd ../frontend && npm list --depth=0 > dependencies_current.txt
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Leer `backend/main.py` completo
- ✅ Leer `backend/apu_catalog.py` completo
- ✅ Leer `frontend/src/App.tsx` completo
- ✅ Leer `frontend/package.json`
- ✅ Identificar patrones y arquitectura
- ✅ Generar reporte: `ANALYSIS_REPORT.md`

---

### Step 1.2: Crear plan de ejecución
```python
# AUTO-GENERADO por Gemini Code Assist

EXECUTION_PLAN = {
    "fase_1_auth": {
        "priority": "CRITICAL",
        "estimated_time": "4 hours",
        "tasks": [
            "setup_firebase_auth",
            "create_auth_components",
            "implement_protected_routes",
            "add_user_profile_endpoint"
        ],
        "tests_required": True,
        "auto_deploy": True
    },
    "fase_1_database": {
        "priority": "CRITICAL",
        "estimated_time": "4 hours",
        "tasks": [
            "design_firestore_schema",
            "implement_projects_crud",
            "add_real_time_sync",
            "migration_script"
        ],
        "tests_required": True,
        "auto_deploy": True
    }
}
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Generar archivo: `EXECUTION_PLAN.json`
- ✅ Estimar tiempo total: ~80 horas
- ✅ Identificar dependencias entre tareas
- ✅ Crear checklist automático

---

## 🔧 FASE 2: IMPLEMENTACIÓN (AUTO)

### Step 2.1: Setup Firebase
```typescript
// AUTO: Crear archivo firebase.config.ts

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Crear `frontend/src/lib/firebase.ts`
- ✅ Instalar dependencias: `npm install firebase`
- ✅ Actualizar `.env.example` con variables
- ✅ Commit: `feat: add Firebase configuration`

---

### Step 2.2: Sistema de autenticación completo
```typescript
// AUTO: Crear hook useAuth

import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (error) {
      return { user: null, error }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return { user, loading, loginWithGoogle, loginWithEmail, signUp, logout }
}
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Crear `frontend/src/hooks/useAuth.ts`
- ✅ Crear componentes:
  - `components/auth/LoginModal.tsx`
  - `components/auth/SignUpModal.tsx`
  - `components/auth/UserMenu.tsx`
- ✅ Actualizar `App.tsx` para incluir auth
- ✅ Tests: `__tests__/useAuth.test.ts`
- ✅ Commit: `feat: implement authentication system`

---

### Step 2.3: Database schema y CRUD
```python
# AUTO: Actualizar backend/main.py

from google.cloud import firestore
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

db = firestore.Client()

class Project(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
    description: str
    location: dict
    status: str = "draft"
    budget: dict
    images: list = []
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()

@app.post("/api/projects")
async def create_project(project: Project, user_id: str = Depends(get_current_user)):
    """Crear nuevo proyecto"""
    project.user_id = user_id
    project_dict = project.dict()
    project_dict['created_at'] = firestore.SERVER_TIMESTAMP
    project_dict['updated_at'] = firestore.SERVER_TIMESTAMP

    doc_ref = db.collection('projects').document()
    doc_ref.set(project_dict)

    return {"id": doc_ref.id, **project_dict}

@app.get("/api/projects")
async def get_user_projects(user_id: str = Depends(get_current_user)):
    """Obtener proyectos del usuario"""
    projects_ref = db.collection('projects').where('user_id', '==', user_id)
    projects = [{"id": doc.id, **doc.to_dict()} for doc in projects_ref.stream()]
    return {"projects": projects}

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str, user_id: str = Depends(get_current_user)):
    """Obtener proyecto específico"""
    doc = db.collection('projects').document(project_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    project = doc.to_dict()
    if project['user_id'] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    return {"id": doc.id, **project}

@app.put("/api/projects/{project_id}")
async def update_project(
    project_id: str,
    updates: dict,
    user_id: str = Depends(get_current_user)
):
    """Actualizar proyecto"""
    doc_ref = db.collection('projects').document(project_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    if doc.to_dict()['user_id'] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    updates['updated_at'] = firestore.SERVER_TIMESTAMP
    doc_ref.update(updates)

    return {"success": True}

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, user_id: str = Depends(get_current_user)):
    """Eliminar proyecto"""
    doc_ref = db.collection('projects').document(project_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    if doc.to_dict()['user_id'] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    doc_ref.delete()
    return {"success": True}
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Actualizar `backend/main.py` con endpoints
- ✅ Crear `backend/models/project.py`
- ✅ Crear `backend/auth.py` con JWT middleware
- ✅ Tests: `backend/tests/test_projects.py`
- ✅ Commit: `feat: add projects CRUD endpoints`

---

### Step 2.4: Frontend Dashboard
```typescript
// AUTO: Crear Dashboard component

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

interface Project {
  id: string
  title: string
  description: string
  status: string
  budget: {
    total_final: number
    currency: string
  }
  created_at: Date
  updated_at: Date
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'projects'),
      where('user_id', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[]

      setProjects(projectsData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Mis Proyectos
          </h1>
          <button
            onClick={() => router.push('/new-project')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nuevo Proyecto
          </button>
        </div>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Crear `frontend/src/pages/Dashboard.tsx`
- ✅ Crear `components/ProjectCard.tsx`
- ✅ Crear `components/EmptyState.tsx`
- ✅ Actualizar routing en `App.tsx`
- ✅ Commit: `feat: add user dashboard`

---

## 💰 FASE 3: MONETIZACIÓN (AUTO)

### Step 3.1: Sistema de planes
```typescript
// AUTO: Crear plans.config.ts

export const PLANS = {
  free: {
    id: 'free',
    name: 'Dueño de Casa',
    price: 0,
    currency: 'CLP',
    interval: 'lifetime',
    features: [
      '3 proyectos por mes',
      '5 renders Dream Mode',
      '5 proyectos guardados',
      'Presupuestos básicos',
      'Soporte por email'
    ],
    limits: {
      projects_per_month: 3,
      dream_renders_per_month: 5,
      max_saved_projects: 5,
      pdf_export: false,
      excel_export: false
    }
  },
  basic: {
    id: 'price_basic_clp_monthly',
    name: 'Maestro Constructor',
    price: 19900,
    currency: 'CLP',
    interval: 'month',
    features: [
      '25 proyectos por mes',
      '50 renders Dream Mode',
      '100 proyectos guardados',
      'Exportar PDF/Excel',
      'APUs profesionales completos',
      'Compartir por WhatsApp',
      'Soporte prioritario'
    ],
    limits: {
      projects_per_month: 25,
      dream_renders_per_month: 50,
      max_saved_projects: 100,
      pdf_export: true,
      excel_export: true
    }
  },
  // ... más planes
}
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Crear `frontend/src/config/plans.ts`
- ✅ Crear página: `pages/Pricing.tsx`
- ✅ Crear middleware: `backend/middleware/subscription.py`
- ✅ Commit: `feat: add subscription plans`

---

### Step 3.2: Integración Stripe
```python
# AUTO: Configurar Stripe en backend

import stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.post("/api/create-checkout-session")
async def create_checkout_session(
    price_id: str,
    user_id: str = Depends(get_current_user)
):
    """Crear sesión de checkout de Stripe"""
    try:
        checkout_session = stripe.checkout.Session.create(
            customer_email=user.email,
            payment_method_types=['card'],
            line_items=[{
                'price': price_id,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{FRONTEND_URL}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/pricing",
            metadata={
                'user_id': user_id
            }
        )
        return {"checkout_url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    """Webhook de Stripe para eventos de pago"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata']['user_id']

        # Actualizar suscripción del usuario
        db.collection('users').document(user_id).update({
            'subscription': {
                'status': 'active',
                'plan': session['metadata']['plan'],
                'stripe_customer_id': session['customer'],
                'stripe_subscription_id': session['subscription']
            }
        })

    return {"status": "success"}
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Instalar: `pip install stripe`
- ✅ Crear endpoints de Stripe
- ✅ Configurar webhooks
- ✅ Tests de integración
- ✅ Commit: `feat: integrate Stripe payments`

---

## 🎨 FASE 4: FEATURES WOW (AUTO)

### Step 4.1: Chat IA conversacional
```typescript
// AUTO: Implementar chat inteligente

import { useChat } from 'ai/react'

export default function BudgetChat({ projectId }: { projectId: string }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [{
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de presupuestos. ¿En qué proyecto estás trabajando?'
    }]
  })

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Pregunta sobre tu presupuesto..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}
```

**Backend:**
```python
# AUTO: Endpoint de chat con Gemini

@app.post("/api/chat")
async def chat_endpoint(
    messages: list[dict],
    project_id: str,
    user_id: str = Depends(get_current_user)
):
    """Chat conversacional para presupuestos"""

    # Obtener contexto del proyecto
    project = db.collection('projects').document(project_id).get().to_dict()

    # Construir contexto para Gemini
    context = f"""
    Eres un experto en presupuestos de construcción.

    Proyecto actual:
    - Título: {project['title']}
    - Descripción: {project['description']}
    - Presupuesto actual: ${project['budget']['total_final']:,.0f} {project['budget']['currency']}
    - Items: {len(project['budget']['items'])}

    Catálogo APU disponible: {len(APU_CATALOG)} categorías con 40+ items.

    Tu rol:
    1. Ayudar a refinar el presupuesto
    2. Sugerir optimizaciones
    3. Detectar errores u omisiones
    4. Responder preguntas sobre costos

    Sé conversacional, amigable y preciso.
    """

    # Llamar a Gemini
    model = GenerativeModel("gemini-1.5-pro")
    chat = model.start_chat()

    # Agregar contexto + historial
    full_messages = [{"role": "user", "parts": [context]}] + messages

    response = chat.send_message(full_messages[-1]['content'])

    return {
        "role": "assistant",
        "content": response.text
    }
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Instalar: `npm install ai` (Vercel AI SDK)
- ✅ Crear componente BudgetChat
- ✅ Implementar endpoint backend
- ✅ Integrar en dashboard
- ✅ Commit: `feat: add AI conversational chat`

---

### Step 4.2: Exportación PDF profesional
```python
# AUTO: Generar PDFs con ReportLab

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime

@app.get("/api/projects/{project_id}/export/pdf")
async def export_project_pdf(
    project_id: str,
    user_id: str = Depends(get_current_user)
):
    """Exportar proyecto a PDF profesional"""

    # Obtener proyecto
    project = db.collection('projects').document(project_id).get().to_dict()
    user = db.collection('users').document(user_id).get().to_dict()

    # Verificar permisos de plan
    if not user.get('subscription', {}).get('limits', {}).get('pdf_export'):
        raise HTTPException(
            status_code=403,
            detail="Upgrade to Basic plan to export PDFs"
        )

    # Crear PDF
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Header con logo (si tiene branding personalizado)
    if user.get('subscription', {}).get('plan') == 'pro':
        # Agregar logo custom
        if user.get('branding', {}).get('logo_url'):
            c.drawImage(user['branding']['logo_url'], 0.5*inch, height - 1.5*inch, width=2*inch, height=1*inch)

    # Título del proyecto
    c.setFont("Helvetica-Bold", 24)
    c.drawString(0.5*inch, height - 2*inch, project['title'])

    # Información general
    c.setFont("Helvetica", 12)
    y = height - 2.5*inch
    c.drawString(0.5*inch, y, f"Cliente: {user.get('name', 'N/A')}")
    y -= 0.3*inch
    c.drawString(0.5*inch, y, f"Fecha: {datetime.now().strftime('%d/%m/%Y')}")
    y -= 0.3*inch
    c.drawString(0.5*inch, y, f"Ubicación: {project.get('location', {}).get('address', 'N/A')}")

    # Tabla de presupuesto
    y -= 0.5*inch
    c.setFont("Helvetica-Bold", 14)
    c.drawString(0.5*inch, y, "PRESUPUESTO DETALLADO")

    y -= 0.4*inch
    c.setFont("Helvetica-Bold", 10)

    # Headers de tabla
    c.drawString(0.5*inch, y, "ITEM")
    c.drawString(3*inch, y, "CANTIDAD")
    c.drawString(4*inch, y, "UNIDAD")
    c.drawString(5*inch, y, "PRECIO UNIT.")
    c.drawString(6.5*inch, y, "SUBTOTAL")

    c.line(0.5*inch, y - 0.1*inch, 8*inch, y - 0.1*inch)

    # Items
    y -= 0.3*inch
    c.setFont("Helvetica", 9)

    for item in project['budget']['items']:
        if y < 1*inch:  # Nueva página si es necesario
            c.showPage()
            y = height - 1*inch

        c.drawString(0.5*inch, y, item['descripcion'][:40])
        c.drawString(3*inch, y, str(item['cantidad']))
        c.drawString(4*inch, y, item['unidad'])
        c.drawString(5*inch, y, f"${item['precio_unitario']:,.0f}")
        c.drawString(6.5*inch, y, f"${item['subtotal']:,.0f}")
        y -= 0.25*inch

    # Total
    y -= 0.3*inch
    c.line(0.5*inch, y, 8*inch, y)
    y -= 0.3*inch
    c.setFont("Helvetica-Bold", 14)
    c.drawString(5*inch, y, "TOTAL:")
    c.drawString(6.5*inch, y, f"${project['budget']['total_final']:,.0f} {project['budget']['currency']}")

    # Footer
    c.setFont("Helvetica", 8)
    c.drawString(0.5*inch, 0.5*inch, f"Generado con Arkitecto AI - {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    c.drawString(0.5*inch, 0.3*inch, "https://arkitecto.ai")

    c.save()
    buffer.seek(0)

    # Retornar PDF
    return Response(
        content=buffer.getvalue(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=presupuesto_{project_id}.pdf"
        }
    )
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Instalar: `pip install reportlab`
- ✅ Crear endpoint de exportación
- ✅ Botón de descarga en frontend
- ✅ Trackear evento en analytics
- ✅ Commit: `feat: add PDF export`

---

## 🚀 FASE 5: DEPLOY AUTOMÁTICO

### Step 5.1: CI/CD con GitHub Actions
```yaml
# AUTO: Crear .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest pytest-cov

      - name: Run tests
        run: |
          cd backend
          pytest --cov=. --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run tests
        run: |
          cd frontend
          npm test

      - name: Build
        run: |
          cd frontend
          npm run build

  deploy-backend:
    needs: [test-backend, test-frontend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v1
        with:
          service: arkitecto-backend
          region: us-central1
          source: ./backend
          secrets: |
            GOOGLE_CLOUD_PROJECT=arkitecto-ai-pro-v1
            STRIPE_SECRET_KEY=${{ secrets.STRIPE_SECRET_KEY }}

  deploy-frontend:
    needs: [test-backend, test-frontend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Crear workflow de CI/CD
- ✅ Configurar secrets en GitHub
- ✅ Deploy automático en push a main
- ✅ Notificaciones en caso de fallo
- ✅ Commit: `ci: add automated deployment`

---

### Step 5.2: Monitoreo y Alertas
```python
# AUTO: Setup Google Cloud Monitoring

from google.cloud import monitoring_v3
from google.cloud import error_reporting

# Error reporting
error_client = error_reporting.Client()

@app.middleware("http")
async def error_tracking_middleware(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        error_client.report_exception()
        raise

# Custom metrics
metrics_client = monitoring_v3.MetricServiceClient()
project_name = f"projects/{PROJECT_ID}"

def track_budget_generation(user_id: str, amount: float):
    """Trackear generación de presupuesto"""
    series = monitoring_v3.TimeSeries()
    series.metric.type = "custom.googleapis.com/budget/generated"
    series.resource.type = "global"

    point = monitoring_v3.Point()
    point.value.double_value = amount
    point.interval.end_time.seconds = int(time.time())

    series.points = [point]
    metrics_client.create_time_series(name=project_name, time_series=[series])
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Configurar Cloud Monitoring
- ✅ Configurar Error Reporting
- ✅ Crear alertas:
  - Error rate > 5%
  - Latency > 2s
  - Subscription churn > 10%
- ✅ Dashboard en Google Cloud Console
- ✅ Commit: `feat: add monitoring and alerts`

---

## 📊 FASE 6: VERIFICACIÓN Y LANZAMIENTO

### Step 6.1: Tests de carga
```python
# AUTO: Crear locustfile.py para load testing

from locust import HttpUser, task, between

class ArkitectoUser(HttpUser):
    wait_time = between(1, 5)

    def on_start(self):
        # Login
        self.client.post("/api/auth/login", json={
            "email": "test@example.com",
            "password": "test123"
        })

    @task(3)
    def generate_budget(self):
        with open("test_image.jpg", "rb") as f:
            self.client.post("/api/analyze_budget", files={
                "image": f,
                "instruction": "construir piscina 8x4m"
            })

    @task(2)
    def view_projects(self):
        self.client.get("/api/projects")

    @task(1)
    def generate_dream_render(self):
        self.client.post("/api/generate_sketch", files={
            "image": open("test_image.jpg", "rb"),
            "prompt": "convertir en casa moderna"
        })

# Ejecutar: locust -f locustfile.py --host=https://arkitecto-backend.onrender.com
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Crear tests de carga
- ✅ Ejecutar con 100 usuarios concurrentes
- ✅ Verificar:
  - Response time < 2s (p95)
  - Error rate < 1%
  - Throughput > 100 req/s
- ✅ Generar reporte: `LOAD_TEST_REPORT.md`

---

### Step 6.2: Checklist de lanzamiento
```markdown
# AUTO-GENERADO: LAUNCH_CHECKLIST.md

## 🚀 CHECKLIST DE LANZAMIENTO - ARKITECTO AI v6.0

### ✅ Backend
- [x] Todos los endpoints funcionando
- [x] Tests con 100% coverage crítico
- [x] Error handling robusto
- [x] Rate limiting configurado
- [x] CORS configurado correctamente
- [x] Environment variables en producción
- [x] Secrets en Google Secret Manager
- [x] Cloud Run autoscaling configurado
- [x] Monitoreo activo
- [x] Logs estructurados

### ✅ Frontend
- [x] Build sin errores
- [x] Lighthouse score > 90
- [x] PWA instalable
- [x] Responsive en mobile/tablet/desktop
- [x] Cross-browser testing (Chrome, Safari, Firefox)
- [x] Analytics configurado
- [x] Error boundaries
- [x] Loading states
- [x] Offline support básico

### ✅ Database
- [x] Firestore rules configuradas
- [x] Backups automáticos habilitados
- [x] Índices creados
- [x] Migration scripts testeados

### ✅ Auth
- [x] Login Google funcional
- [x] Login Email funcional
- [x] Password reset
- [x] Email verification
- [x] Protected routes

### ✅ Payments
- [x] Stripe test mode OK
- [x] Stripe production mode configurado
- [x] Webhooks funcionando
- [x] Test de compra exitoso
- [x] Test de cancelación
- [x] Emails de confirmación

### ✅ Features
- [x] Generación de presupuestos
- [x] Dream Mode renders
- [x] Chat IA conversacional
- [x] Exportación PDF
- [x] Guardado de proyectos
- [x] Dashboard de usuario
- [x] Compartir por WhatsApp

### ✅ Performance
- [x] Load testing completado
- [x] CDN configurado
- [x] Images optimizadas
- [x] Code splitting
- [x] Lazy loading

### ✅ Security
- [x] HTTPS everywhere
- [x] SQL injection protection (N/A - NoSQL)
- [x] XSS protection
- [x] CSRF protection
- [x] Rate limiting
- [x] Input validation
- [x] Secrets rotation policy

### ✅ Legal
- [x] Términos y condiciones
- [x] Política de privacidad
- [x] Política de cookies
- [x] GDPR compliance (si aplica)

### ✅ Marketing
- [x] Landing page lista
- [x] Pricing page clara
- [x] FAQ section
- [x] Email templates
- [x] Social media accounts
- [x] Press kit

### ✅ Support
- [x] Help center/docs
- [x] Support email configurado
- [x] Chatbot básico
- [x] Status page

---

## 🎉 LANZAMIENTO

Fecha objetivo: 1 de Febrero 2025
Estrategia: Beta privada (100 usuarios) → Lanzamiento público

### Beta Privada (Semana 1-2)
- Invitar a 100 early adopters
- Monitorear uso intensivo
- Recolectar feedback
- Iterar rápido

### Lanzamiento Público (Semana 3)
- Anuncio en redes sociales
- Email a lista de espera
- Product Hunt launch
- Prensa chilena de construcción
- Grupos de WhatsApp de maestros

### Post-Launch (Semana 4+)
- Monitor métricas diarias
- Fix bugs críticos en <24h
- Responder feedback usuarios
- Optimizar conversion rate
- Escalar marketing

---

LISTO PARA LANZAR! 🚀
```

**ACCIÓN AUTOMÁTICA:**
- ✅ Generar checklist completo
- ✅ Verificar cada item automáticamente
- ✅ Marcar solo items 100% completados
- ✅ Generar reporte: `LAUNCH_READINESS_REPORT.md`

---

## 🎯 COMANDO FINAL PARA GEMINI CODE ASSIST

```bash
# EJECUTAR TODO EN MODO AUTOMÁTICO

gemini-code-assist execute \
  --mode autonomous \
  --config AUTO_DEPLOY_SCRIPT.md \
  --roadmap GEMINI_CODE_ASSIST_PROMPT.md \
  --auto-commit true \
  --auto-deploy true \
  --auto-test true \
  --notification-email pablo@cussen.cl \
  --max-execution-time 80h \
  --checkpoints-enabled true \
  --rollback-on-error true \
  --verbose true
```

---

## 📝 REPORTE FINAL ESPERADO

Al terminar, Gemini Code Assist debe generar:

### `EXECUTION_REPORT.md`
```markdown
# 🚀 REPORTE DE EJECUCIÓN - ARKITECTO AI v6.0

## ✅ RESUMEN
- Inicio: 2024-11-24 14:30:00
- Fin: 2024-12-04 18:45:00
- Duración total: 78.25 horas
- Commits realizados: 247
- Tests creados: 156
- Tests pasados: 156 (100%)
- Deploy exitoso: ✅

## 📊 MÉTRICAS

### Código generado:
- Archivos Python: 45
- Archivos TypeScript/TSX: 89
- Tests: 156
- Líneas de código: 24,567

### Performance:
- Lighthouse score: 94/100
- Load test: ✅ Passed (2000 users, 0.3% error rate)
- Response time p95: 1.2s

### Cobertura de tests:
- Backend: 96%
- Frontend: 89%

## 🎯 FEATURES COMPLETADAS

### Fase 1: Fundamentos ✅
- [x] Autenticación Firebase
- [x] Database Firestore
- [x] Dashboard usuario
- [x] CRUD proyectos

### Fase 2: Monetización ✅
- [x] Sistema de planes
- [x] Integración Stripe
- [x] Webhooks
- [x] Pricing page

### Fase 3: WOW Features ✅
- [x] Chat IA conversacional
- [x] Exportación PDF
- [x] WhatsApp share
- [x] Templates

### Fase 4: Global ✅
- [x] Multi-idioma (ES/EN)
- [x] Multi-moneda
- [x] APUs internacionales
- [x] PWA

### Fase 5: Ecosistema ✅
- [x] API pública REST
- [x] Documentación Swagger
- [x] Webhooks system
- [x] Analytics

## 🚀 DEPLOY

### URLs producción:
- Frontend: https://arkitecto-ai.vercel.app
- Backend: https://arkitecto-backend-xxx.run.app
- API Docs: https://arkitecto-backend-xxx.run.app/docs
- Status: https://status.arkitecto.ai

### Environments:
- Production ✅
- Staging ✅
- Development ✅

## ✅ LISTO PARA LANZAMIENTO

El sistema está 100% funcional y listo para usuarios reales.

Próximos pasos recomendados:
1. Beta privada con 100 usuarios
2. Recolectar feedback inicial
3. Ajustes menores si es necesario
4. Lanzamiento público

---

Generated by Gemini Code Assist
2024-12-04 18:45:00
```

---

## 🎉 FIN DEL SCRIPT

Con este script, Gemini Code Assist puede ejecutar TODA la transformación de forma autónoma, desde el análisis inicial hasta el deploy en producción, sin intervención manual.

**RESULTADO ESPERADO:**
- ✅ Código production-ready
- ✅ Tests completos
- ✅ Deploy automático
- ✅ Monitoring activo
- ✅ Listo para usuarios reales

**🚀 LANZAMIENTO EN 10 SEMANAS!**
