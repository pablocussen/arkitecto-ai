"""
Prompt para generar presupuestos desde respuestas del Wizard
Usa el proyecto LOICA como referencia
"""

LOICA_REFERENCE = """
EJEMPLO DE PROYECTO PROFESIONAL (Central Loica):
- Tipo: Quincho
- Area: 50m2
- Items principales:
  * Fundaciones y radieres
  * Estructura de madera
  * Cubierta de teja
  * Instalaciones eléctricas
  * Terminaciones
  * Mobiliario
- Total: ~$8,000,000 CLP
"""

def build_wizard_prompt(answers: dict) -> str:
    """Construye prompt para Gemini desde respuestas del wizard"""
    return f"""
Eres un experto en presupuestación de construcción en Chile.

{LOICA_REFERENCE}

PROYECTO DEL USUARIO:
- Tipo: {answers.get('type', 'No especificado')}
- Dimensiones: {answers.get('dimensions', 'No especificado')}
- Calidad: {answers.get('quality', 'Estándar')}
- Detalles: {answers.get('details', 'Ninguno')}
- Ubicación: {answers.get('location', 'Chile central')}

INSTRUCCIONES:
1. Genera un presupuesto DETALLADO similar al ejemplo LOICA
2. Incluye TODAS las partidas necesarias del catálogo APU
3. Considera la calidad solicitada: 
   - Económico: materiales básicos, -20% en precios
   - Estándar: precios normales APU
   - Premium: materiales premium, +30% en precios
4. Ajusta por ubicación si es necesario
5. Incluye:
   - Movimiento de tierras
   - Fundaciones
   - Estructura
   - Instalaciones
   - Terminaciones
   - Imprevistos (10%)

FORMATO DE SALIDA: JSON con estructura Budget
"""