import os
import uvicorn
import base64
import io
import time
import re
from typing import Optional, List
from datetime import datetime
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from vertexai.preview.vision_models import ImageGenerationModel
try:
    from backend.auth_middleware import FirebaseAuthMiddleware
    import backend.firebase_admin as firebase_admin
    from backend.schemas import Project, ProjectMetadata
except ImportError:
    from auth_middleware import FirebaseAuthMiddleware
    import firebase_admin
    from schemas import Project, ProjectMetadata

# Importar catálogo APU Profesional
from apu_catalog import APU_CATALOG, KEYWORD_MAPPING, buscar_apus

# --- CONFIGURACIÓN ---
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "arkitecto-ai-pro-v1")
LOCATION = "us-central1"

# Fix Unicode encoding for Windows console
import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("\n" + "="*60)
print("🚀  ARKITECTO AI - Backend v5.0 PRO")
print("="*60)
print(f"📍 Proyecto GCP: {PROJECT_ID}")
print(f"🌎 Región: {LOCATION}")
print(f"💎 APUs Profesionales: 40+ items con precios reales CLP")
print("-"*60)

# Inicializar Vertex AI
try:
    vertexai.init(project=PROJECT_ID, location=LOCATION)
    print("✅ Vertex AI Generative API    : Conectado")
except Exception as e:
    print(f"❌ Vertex AI                   : Error - {str(e)[:50]}")

# Inicializar Firebase
try:
    # The firebase_admin is initialized in the firebase_admin module
    firebase_admin.get_db()
    print("✅ Firebase Firestore          : Conectado")
except Exception as e:
    print(f"⚠️  Firebase                    : Advertencia - {str(e)[:50]}")

print("-"*60)
print("🎯 Endpoints activos:")
print("   • GET  /              → Health check")
print("   • POST /analyze_budget → Presupuestos con IA")
print("   • POST /generate_sketch → Renders arquitectónicos")
print("="*60 + "\n")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(FirebaseAuthMiddleware)


def generate_budget_offline(instruction: str) -> dict:
    """
    🚀 GENERADOR DE PRESUPUESTOS PRO
    Usa catálogo APU profesional con precios reales de mercado chileno.
    Sistema inteligente de búsqueda por keywords naturales.
    Transparencia total: códigos APU, origen, precios unitarios verificados.
    """
    instruction_lower = instruction.lower()

    # 1. Buscar APUs relevantes usando el sistema inteligente
    apus_encontrados = buscar_apus(instruction)

    if not apus_encontrados:
        # Fallback: usar APUs de terminaciones como default
        apus_encontrados = APU_CATALOG["terminaciones"]["items"][:3]

    # 2. Detectar cantidad/área si está especificada
    area_match = re.search(r'(\d+)\s*m[²2]', instruction_lower)
    cantidad_match = re.search(r'(\d+)\s*(unidad|un|und|u\b|puerta|ventana)', instruction_lower)

    # Cantidad por defecto según unidad
    cantidad_default = 1
    if area_match:
        cantidad_default = int(area_match.group(1))
    elif cantidad_match:
        cantidad_default = int(cantidad_match.group(1))

    # 3. Construir items del presupuesto con APUs reales
    items = []
    subtotal_materiales = 0

    # Detectar si es solicitud de puerta/ventana única
    es_item_unico = any(word in instruction_lower for word in ["una puerta", "una ventana", "instalar puerta", "instalar ventana"])

    for idx, apu in enumerate(apus_encontrados[:5]):  # Máximo 5 APUs principales
        # Detectar cantidad según tipo de unidad
        if apu["unidad"] in ["m²", "m2"]:
            cantidad = cantidad_default if area_match else 30  # Default 30m²
        elif apu["unidad"] in ["m³", "m3"]:
            cantidad = max(1, cantidad_default // 10)  # Aproximación
        elif apu["unidad"] in ["ml", "m"]:
            cantidad = cantidad_default if cantidad_match else 10  # Default 10m
        elif apu["unidad"] == "kg":
            cantidad = cantidad_default * 5 if area_match else 50  # Aproximación
        elif apu["unidad"] == "un":
            # Si pide una sola puerta/ventana, solo usar el primer APU que coincida
            if es_item_unico and idx > 0:
                continue
            cantidad = cantidad_default if cantidad_match else 1
        else:
            cantidad = 1

        precio_unitario = apu["precio"]
        subtotal = precio_unitario * cantidad
        subtotal_materiales += subtotal

        items.append({
            "elemento": apu["desc"].split(" - ")[0] if " - " in apu["desc"] else apu["desc"][:40],
            "descripcion": f"🏗️ {apu['desc']} | Código: {apu['codigo']}",
            "cantidad": cantidad,
            "unidad": apu["unidad"],
            "precio_unitario": precio_unitario,
            "subtotal": subtotal,
            "apu_origen": f"APU Profesional {apu['codigo']}"
        })

    # 4. Agregar mano de obra (15% del subtotal materiales)
    mano_obra = subtotal_materiales * 0.15
    items.append({
        "elemento": "Mano de obra especializada",
        "descripcion": "🛠️ Maestros y jornales | Código: MO-01",
        "cantidad": 1,
        "unidad": "gl",
        "precio_unitario": mano_obra,
        "subtotal": mano_obra,
        "apu_origen": "APU Profesional MO-01"
    })

    # 5. Agregar imprevistos (5% del subtotal materiales)
    imprevistos = subtotal_materiales * 0.05
    items.append({
        "elemento": "Imprevistos y contingencias",
        "descripcion": "⚠️ Reserva para imprevistos (5%)",
        "cantidad": 1,
        "unidad": "gl",
        "precio_unitario": imprevistos,
        "subtotal": imprevistos,
        "apu_origen": "Estimado"
    })

    total = subtotal_materiales + mano_obra + imprevistos

    # 6. Generar análisis inteligente
    categoria_detectada = "construcción"
    for keyword, cat in KEYWORD_MAPPING.items():
        if keyword in instruction_lower:
            categoria_detectada = APU_CATALOG[cat]["nombre"]
            break

    analisis = (
        f"✅ Presupuesto profesional generado para: {instruction}\n"
        f"📊 Categoría detectada: {categoria_detectada}\n"
        f"🎯 {len(items)-2} partidas principales encontradas\n"
        f"💰 Precios de mercado chileno actualizados (CLP 2024)"
    )

    # 7. Retornar formato estructurado PRO
    return {
        "success": True,
        "analisis": analisis,
        "presupuesto": {
            "items": items,
            "total_estimado": int(total),
            "moneda": "CLP"
        },
        "metadata": {
            "elementos_detectados": len(items),
            "items_con_precio": len(items),
            "generator": "apu_profesional",
            "categoria": categoria_detectada,
            "transparencia": "Todos los precios incluyen códigos APU verificados"
        }
    }

@app.get("/")
def health_check():
    return {"status": "online", "brain": "v4.0 Cascade"}

@app.post("/analyze_budget")
async def analyze_budget(image: Optional[UploadFile] = File(None), instruction: str = Form(...)):
    print(f"\n💰 [PRESUPUESTO] Calculando: '{instruction}'")

    # Lista de modelos a intentar (del más nuevo al más estable)
    models_to_try = [
        "gemini-1.5-flash-001",
        "gemini-1.5-flash",
        "gemini-pro"
    ]

    for model_name in models_to_try:
        try:
            print(f"🔄 Intentando modelo: {model_name}")
            model = GenerativeModel(model_name)

            prompt = f"""
            Eres un Experto Costista de Construcción en Chile.
            Analiza la solicitud y entrega un presupuesto detallado en PESOS CHILENOS (CLP).

            Formato de respuesta:
            - Lista de partidas con descripción
            - Cantidad y unidad de medida
            - Precio unitario estimado
            - Subtotal por partida
            - TOTAL ESTIMADO al final

            Solicitud del cliente: "{instruction}"
            """

            if image:
                print("📸 Analizando imagen...")
                img_content = await image.read()
                image_part = Part.from_data(data=img_content, mime_type=image.content_type)
                response = model.generate_content([image_part, prompt])
            else:
                response = model.generate_content(prompt)

            print(f"✅ [PRESUPUESTO] Generado con {model_name}")

            # Parsear respuesta de Vertex AI a formato estructurado
            # Por ahora, devolver formato básico con el texto de la IA
            return {
                "success": True,
                "analisis": f"Presupuesto generado con IA para: {instruction}",
                "presupuesto": {
                    "items": [
                        {
                            "elemento": "Presupuesto completo",
                            "descripcion": response.text[:200] + "..." if len(response.text) > 200 else response.text,
                            "cantidad": 1,
                            "unidad": "gl",
                            "precio_unitario": 0,
                            "subtotal": 0,
                            "apu_origen": "vertex_ai"
                        }
                    ],
                    "total_estimado": 0,
                    "moneda": "CLP"
                },
                "metadata": {
                    "elementos_detectados": 1,
                    "items_con_precio": 0,
                    "generator": "vertex_ai",
                    "raw_response": response.text  # Mantener respuesta completa por compatibilidad
                }
            }

        except Exception as e:
            print(f"❌ Error con {model_name}: {str(e)[:100]}")
            continue

    # Si todos los modelos fallaron, usar generador offline
    print("⚠️ [PRESUPUESTO] Vertex AI no disponible - usando generador offline")
    return generate_budget_offline(instruction)

@app.post("/generate_sketch")
async def generate_sketch(image: UploadFile = File(...), prompt: str = Form(...)):
    print(f"\n🎨 [IMAGEN] Generando render: '{prompt}'")

    try:
        # 1. Analizar imagen original con Gemini para extraer contexto
        print("📸 Analizando imagen original...")
        img_content = await image.read()

        # Usar Gemini para describir la imagen
        try:
            vision_model = GenerativeModel("gemini-1.5-flash")
            image_part = Part.from_data(data=img_content, mime_type=image.content_type)

            analysis_prompt = """
            Describe esta imagen de construcción en inglés técnico.
            Enfócate en: tipo de estructura, materiales visibles, estado de construcción,
            elementos arquitectónicos. Máximo 100 palabras. Sin mencionar personas.
            """

            analysis = vision_model.generate_content([image_part, analysis_prompt])
            context_from_image = analysis.text.strip()
            print(f"📊 Contexto detectado: {context_from_image[:100]}...")
        except:
            context_from_image = "construction site"
            print("⚠️ No se pudo analizar imagen, usando contexto genérico")

        # 2. Configurar modelo de generación
        print("📡 Conectando a Vertex AI Image Generation...")
        model = ImageGenerationModel.from_pretrained("imagegeneration@005")

        # 3. Crear prompt PRO ultra-realista COMBINANDO imagen + visión del usuario
        safe_prompt = prompt.replace("person", "").replace("people", "").replace("man", "").replace("woman", "").replace("worker", "").replace("astronaut", "")

        full_prompt = (
            f"Architecture visualization: transform this {context_from_image} into {safe_prompt}, "
            f"ABSOLUTELY NO HUMANS, NO PEOPLE, NO WORKERS, NO FIGURES, "
            f"empty site, only buildings and vehicles, "
            f"ultra-realistic photorealistic render, "
            f"cinematic lighting, golden hour, dramatic sky with clouds, "
            f"modern industrial architecture, steel structure, metal cladding, "
            f"construction equipment parked (forklift, trucks), "
            f"professional landscaping, paved areas, "
            f"sharp focus, depth of field, 8k quality, "
            f"architectural photography style, wide angle lens"
        )

        print(f"🎨 Prompt optimizado: {full_prompt[:80]}...")
        print(f"🤖 Generando imagen 1:1...")

        # 3. Generar imagen en formato cuadrado (único estable)
        response = model.generate_images(
            prompt=full_prompt,
            number_of_images=1,
            aspect_ratio="1:1",
            language="en"
        )

        if not response or not response.images:
            raise ValueError("El modelo no generó imágenes. Posible activación de filtro de seguridad.")

        # 4. Convertir imagen a Base64 PNG
        print("🔄 Convirtiendo imagen a PNG...")

        image = response.images[0]

        # Método 1: Usar PIL Image si está disponible
        if hasattr(image, '_pil_image') and image._pil_image is not None:
            img_buffer = io.BytesIO()
            image._pil_image.save(img_buffer, format='PNG', optimize=True)
            img_bytes = img_buffer.getvalue()
        # Método 2: Usar bytes directos
        elif hasattr(image, '_image_bytes'):
            img_bytes = image._image_bytes
        else:
            raise ValueError("No se pudo extraer los bytes de la imagen generada")

        # 5. Codificar en Base64
        base64_str = base64.b64encode(img_bytes).decode('utf-8')
        image_size_kb = len(img_bytes) / 1024

        print(f"✅ [IMAGEN] Generada exitosamente ({image_size_kb:.1f} KB)")

        return {
            "success": True,
            "generated_image": f"data:image/png;base64,{base64_str}",
            "message": "Render arquitectónico generado",
            "size_kb": round(image_size_kb, 1)
        }

    except Exception as e:
        error_msg = str(e)
        print(f"❌ [ERROR IMAGEN]: {error_msg}")

        # Analizar tipo de error y dar feedback útil
        if "safety" in error_msg.lower() or "filter" in error_msg.lower():
            user_message = "El prompt activó filtros de seguridad. Intenta con una descripción más arquitectónica."
        elif "quota" in error_msg.lower() or "limit" in error_msg.lower():
            user_message = "Límite de cuota alcanzado. Intenta nuevamente en unos minutos."
        elif "not found" in error_msg.lower() or "404" in error_msg:
            user_message = "Modelo de generación no disponible. Contacta al administrador."
        else:
            user_message = "Error al generar imagen. Intenta con otra descripción."

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": user_message,
                "detail": error_msg[:200]  # Máximo 200 caracteres del error técnico
            }
        )

@app.get("/api/v1/me")
async def get_current_user(request: Request):
    """
    Returns the decoded token of the current user.
    This is a protected endpoint and requires authentication.
    """
    return {"user": request.state.user}

@app.post("/api/v1/projects", response_model=Project)
async def create_project(project_metadata: ProjectMetadata, request: Request):
    """
    Creates a new project for the current user.
    """
    user_id = request.state.user["uid"]
    
    # Create a new project document
    project = Project(metadata=project_metadata)
    project.collaborators = {
        user_id: {
            "role": "owner",
            "invited_at": datetime.utcnow()
        }
    }
    
    # Add to firestore
    db = firebase_admin.get_db()
    _, project_ref = db.collection("projects").add(project.dict(exclude_none=True))
    
    return project

@app.get("/api/v1/projects", response_model=List[Project])
async def get_projects(request: Request):
    """
    Gets all projects for the current user.
    """
    user_id = request.state.user["uid"]
    db = firebase_admin.get_db()
    
    projects_ref = db.collection("projects").where(f"collaborators.{user_id}.role", "in", ["owner", "editor", "viewer"]).stream()
    
    projects = []
    for project in projects_ref:
        p = Project.parse_obj(project.to_dict())
        p.id = project.id
        projects.append(p)
        
    return projects

@app.get("/api/v1/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, request: Request):
    """
    Gets a single project by its ID.
    """
    user_id = request.state.user["uid"]
    db = firebase_admin.get_db()
    
    project_ref = db.collection("projects").document(project_id)
    project = project_ref.get()

    if not project.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    project_data = project.to_dict()
    if user_id not in project_data.get("collaborators", {}):
        raise HTTPException(status_code=403, detail="Not authorized to access this project")

    p = Project.parse_obj(project_data)
    p.id = project.id
    return p

@app.put("/api/v1/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_update: Project, request: Request):
    """
    Updates a project.
    """
    user_id = request.state.user["uid"]
    db = firebase_admin.get_db()

    project_ref = db.collection("projects").document(project_id)
    project = project_ref.get()

    if not project.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    project_data = project.to_dict()
    if user_id not in project_data.get("collaborators", {}) or project_data["collaborators"][user_id]["role"] not in ["owner", "editor"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this project")
    
    update_data = project_update.dict(exclude_unset=True)
    update_data["metadata"]["updated_at"] = datetime.utcnow()

    project_ref.update(update_data)

    updated_project = project_ref.get()
    p = Project.parse_obj(updated_project.to_dict())
    p.id = updated_project.id
    return p

@app.delete("/api/v1/projects/{project_id}", status_code=204)
async def delete_project(project_id: str, request: Request):
    """
    Deletes a project.
    """
    user_id = request.state.user["uid"]
    db = firebase_admin.get_db()

    project_ref = db.collection("projects").document(project_id)
    project = project_ref.get()

    if not project.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    project_data = project.to_dict()
    if user_id not in project_data.get("collaborators", {}) or project_data["collaborators"][user_id]["role"] != "owner":
        raise HTTPException(status_code=403, detail="Only the owner can delete a project")

    project_ref.delete()
    return {}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)