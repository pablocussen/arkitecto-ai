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
from fastapi.responses import JSONResponse, StreamingResponse
import vertexai
from vertexai.generative_models import GenerativeModel, Part
from vertexai.preview.vision_models import ImageGenerationModel
try:
    from backend.auth_middleware import FirebaseAuthMiddleware
    import backend.firebase_service as firebase_service
    from backend.schemas import Project, ProjectMetadata
except ImportError:
    from auth_middleware import FirebaseAuthMiddleware
    import firebase_service
    from schemas import Project, ProjectMetadata

# Importar catalogo APU Profesional v2.0
from apu_catalog import (
    APU_CATALOG, KEYWORD_MAPPING, buscar_apus, calcular_presupuesto_completo,
    obtener_sugerencias, obtener_categorias
)

# Importar generador de PDF
from pdf_generator import generate_budget_pdf, generate_simple_budget_text

# --- CONFIGURACIÓN ---
PROJECT_ID = os.getenv("GOOGLE_CLOUD_PROJECT", "arkitecto-ai-pro-v1")
LOCATION = "us-central1"

# Fix Unicode encoding for Windows console
import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

print("\n" + "="*60)
print("  ARKITECTO AI - Backend v5.0 PRO")
print("="*60)
print(f"Proyecto GCP: {PROJECT_ID}")
print(f"Region: {LOCATION}")
print(f"APUs Profesionales: 150+ partidas con precios CLP 2024/2025")
print(f"Categorias: 17 (preliminares a equipos)")
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
    firebase_service.get_db()
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
    GENERADOR DE PRESUPUESTOS PRO v2.0
    Usa catalogo APU profesional con +150 partidas y precios reales CLP.
    Sistema inteligente de busqueda por keywords naturales.
    Incluye desglose completo: materiales, mano obra, GG, imprevistos, utilidad.
    """
    instruction_lower = instruction.lower()

    # Detectar area si esta especificada
    area_match = re.search(r'(\d+)\s*m[²2]', instruction_lower)
    cantidad_match = re.search(r'(\d+)\s*(unidad|un|und|u\b|puerta|ventana)', instruction_lower)

    area = float(area_match.group(1)) if area_match else None
    cantidad = int(cantidad_match.group(1)) if cantidad_match else None

    # Usar el nuevo sistema de presupuesto completo
    presupuesto = calcular_presupuesto_completo(instruction, area=area, cantidad=cantidad)

    # Detectar categoria para el analisis
    categoria_detectada = "Construccion General"
    for keyword, cat in KEYWORD_MAPPING.items():
        if keyword in instruction_lower:
            if cat in APU_CATALOG:
                categoria_detectada = APU_CATALOG[cat]["nombre"]
            break

    # Contar partidas principales (sin costos indirectos)
    partidas_principales = len([i for i in presupuesto["items"] if "%" not in i.get("apu_origen", "")])

    analisis = (
        f"Presupuesto profesional generado para: {instruction}\n"
        f"Categoria detectada: {categoria_detectada}\n"
        f"{partidas_principales} partidas principales + costos indirectos\n"
        f"Precios mercado chileno CLP 2024/2025 - IVA no incluido"
    )

    return {
        "success": True,
        "analisis": analisis,
        "presupuesto": {
            "items": presupuesto["items"],
            "total_estimado": presupuesto["total_estimado"],
            "moneda": "CLP",
            "subtotal_directo": presupuesto["subtotal_directo"],
            "mano_obra": presupuesto["mano_obra"],
            "gastos_generales": presupuesto["gastos_generales"],
            "imprevistos": presupuesto["imprevistos"],
            "utilidad": presupuesto["utilidad"],
            "total_con_iva": presupuesto["total_con_iva"]
        },
        "metadata": {
            "elementos_detectados": len(presupuesto["items"]),
            "items_con_precio": len(presupuesto["items"]),
            "generator": "apu_profesional_v2",
            "categoria": categoria_detectada,
            "version": "2.0",
            "transparencia": "Codigos APU compatibles ONDAC/CDT"
        }
    }

@app.get("/")
def health_check():
    return {
        "status": "online",
        "version": "5.0 PRO",
        "apu_catalog": "v2.0 - 150+ partidas",
        "features": ["budget_analysis", "render_generation", "projects_crud", "smart_suggestions"]
    }


# =====================================================
# SMART SUGGESTIONS - Phase 3 Optimization
# =====================================================

@app.get("/suggestions")
def get_suggestions():
    """
    Retorna sugerencias de proyectos comunes para facilitar
    la creacion rapida de presupuestos.
    """
    return {
        "success": True,
        "suggestions": obtener_sugerencias(),
        "total": len(obtener_sugerencias())
    }


@app.get("/categories")
def get_categories():
    """
    Retorna todas las categorias disponibles en el catalogo APU.
    """
    return {
        "success": True,
        "categories": obtener_categorias(),
        "total": len(obtener_categorias())
    }


@app.get("/search/{query}")
def search_apus(query: str, limit: int = 10):
    """
    Busca APUs por texto libre.
    Util para autocompletado y busqueda en tiempo real.
    """
    resultados = buscar_apus(query, max_resultados=limit)
    return {
        "success": True,
        "query": query,
        "results": resultados,
        "total": len(resultados)
    }


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
    db = firebase_service.get_db()
    _, project_ref = db.collection("projects").add(project.dict(exclude_none=True))
    
    return project

@app.get("/api/v1/projects", response_model=List[Project])
async def get_projects(request: Request):
    """
    Gets all projects for the current user.
    """
    user_id = request.state.user["uid"]
    db = firebase_service.get_db()
    
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
    db = firebase_service.get_db()
    
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
    db = firebase_service.get_db()

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
    db = firebase_service.get_db()

    project_ref = db.collection("projects").document(project_id)
    project = project_ref.get()

    if not project.exists:
        raise HTTPException(status_code=404, detail="Project not found")

    project_data = project.to_dict()
    if user_id not in project_data.get("collaborators", {}) or project_data["collaborators"][user_id]["role"] != "owner":
        raise HTTPException(status_code=403, detail="Only the owner can delete a project")

    project_ref.delete()
    return {}


# =====================================================
# EXPORTACION PDF - Phase 1 Optimization
# =====================================================

@app.post("/export/pdf")
async def export_budget_pdf(request: Request):
    """
    Exporta un presupuesto en formato PDF profesional.
    Recibe el presupuesto completo y genera un PDF descargable.
    """
    try:
        body = await request.json()
        presupuesto = body.get("presupuesto", {})
        metadata = body.get("metadata", {})
        client_info = body.get("client_info", {})

        if not presupuesto or not presupuesto.get("items"):
            raise HTTPException(status_code=400, detail="Presupuesto vacio o sin items")

        print(f"📄 [PDF] Generando presupuesto con {len(presupuesto.get('items', []))} items")

        # Generar PDF
        pdf_buffer = generate_budget_pdf(presupuesto, metadata, client_info)

        # Nombre del archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"presupuesto_arkitecto_{timestamp}.pdf"

        print(f"✅ [PDF] Generado: {filename}")

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ [PDF] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generando PDF: {str(e)}")


@app.post("/export/text")
async def export_budget_text(request: Request):
    """
    Exporta un presupuesto en formato texto plano.
    Util para compartir por WhatsApp, email, etc.
    """
    try:
        body = await request.json()
        presupuesto = body.get("presupuesto", {})
        metadata = body.get("metadata", {})

        if not presupuesto:
            raise HTTPException(status_code=400, detail="Presupuesto vacio")

        print(f"📝 [TEXT] Generando resumen de presupuesto")

        text_content = generate_simple_budget_text(presupuesto, metadata)

        return {
            "success": True,
            "text": text_content,
            "format": "plain_text"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ [TEXT] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generando texto: {str(e)}")


@app.post("/export/excel")
async def export_budget_excel(request: Request):
    """
    Exporta un presupuesto en formato Excel.
    """
    try:
        body = await request.json()
        presupuesto = body.get("presupuesto", {})
        metadata = body.get("metadata", {})

        if not presupuesto or not presupuesto.get("items"):
            raise HTTPException(status_code=400, detail="Presupuesto vacio o sin items")

        print(f"📊 [EXCEL] Generando presupuesto con {len(presupuesto.get('items', []))} items")

        import pandas as pd
        from io import BytesIO

        # Crear DataFrame con los items
        items = presupuesto.get("items", [])
        df_items = pd.DataFrame(items)

        # Renombrar columnas a espanol
        column_names = {
            "elemento": "Elemento",
            "descripcion": "Descripcion",
            "cantidad": "Cantidad",
            "unidad": "Unidad",
            "precio_unitario": "Precio Unitario",
            "subtotal": "Subtotal",
            "apu_origen": "Codigo APU"
        }
        df_items = df_items.rename(columns=column_names)

        # Crear resumen de costos
        resumen_data = {
            "Concepto": [
                "Subtotal Directo (Materiales)",
                "Mano de Obra (18%)",
                "Gastos Generales (8%)",
                "Imprevistos (5%)",
                "Utilidad (10%)",
                "TOTAL NETO",
                "IVA (19%)",
                "TOTAL CON IVA"
            ],
            "Monto (CLP)": [
                presupuesto.get("subtotal_directo", 0),
                presupuesto.get("mano_obra", 0),
                presupuesto.get("gastos_generales", 0),
                presupuesto.get("imprevistos", 0),
                presupuesto.get("utilidad", 0),
                presupuesto.get("total_estimado", 0),
                int(presupuesto.get("total_estimado", 0) * 0.19),
                presupuesto.get("total_con_iva", int(presupuesto.get("total_estimado", 0) * 1.19))
            ]
        }
        df_resumen = pd.DataFrame(resumen_data)

        # Crear Excel con multiples hojas
        excel_buffer = BytesIO()
        with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
            df_items.to_excel(writer, sheet_name='Detalle Partidas', index=False)
            df_resumen.to_excel(writer, sheet_name='Resumen Costos', index=False)

        excel_buffer.seek(0)

        # Nombre del archivo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"presupuesto_arkitecto_{timestamp}.xlsx"

        print(f"✅ [EXCEL] Generado: {filename}")

        return StreamingResponse(
            excel_buffer,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ [EXCEL] Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generando Excel: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)