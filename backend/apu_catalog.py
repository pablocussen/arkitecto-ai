"""
🌟 ARKITECTO AI - Catálogo de APUs Profesional
Sistema revolucionario para presupuestos de construcción
Precios reales de mercado chileno (CLP) - 2024
"""

# APUs organizados por NECESIDADES reales, no códigos técnicos
APU_CATALOG = {
    # 🏗️ FUNDACIONES Y ESTRUCTURA
    "fundacion": {
        "nombre": "Fundaciones y Estructura",
        "items": [
            {"desc": "Excavación de zanjas", "unidad": "m³", "precio": 8500, "codigo": "B-101"},
            {"desc": "Relleno compactado con maquinaria", "unidad": "m³", "precio": 12800, "codigo": "B-205"},
            {"desc": "Hormigón fundaciones H20", "unidad": "m³", "precio": 125000, "codigo": "C-310"},
            {"desc": "Enfierradura A630-420H", "unidad": "kg", "precio": 1250, "codigo": "E-102"},
            {"desc": "Radier e=15cm con malla", "unidad": "m²", "precio": 28500, "codigo": "C-425"},
        ]
    },

    # 🧱 MUROS Y TABIQUES
    "muros": {
        "nombre": "Muros y Tabiques",
        "items": [
            {"desc": "Muro albañilería ladrillo princesa", "unidad": "m²", "precio": 45000, "codigo": "F-110"},
            {"desc": "Tabique metalcom + yeso cartón", "unidad": "m²", "precio": 18500, "codigo": "H-205"},
            {"desc": "Muro hormigón armado e=15cm", "unidad": "m²", "precio": 85000, "codigo": "C-508"},
            {"desc": "Enlucido muro interior", "unidad": "m²", "precio": 8500, "codigo": "K-102"},
            {"desc": "Estuque exterior con malla", "unidad": "m²", "precio": 12800, "codigo": "K-215"},
        ]
    },

    # 🏠 TECHUMBRE
    "techumbre": {
        "nombre": "Techumbre y Cubierta",
        "items": [
            {"desc": "Cerchas de madera pino cepillado", "unidad": "m²", "precio": 28000, "codigo": "I-105"},
            {"desc": "Cubierta zinc ondulado #28", "unidad": "m²", "precio": 15800, "codigo": "I-210"},
            {"desc": "Cubierta teja asfáltica", "unidad": "m²", "precio": 22500, "codigo": "I-315"},
            {"desc": "Canal zinc 0.5mm desarrollo 33cm", "unidad": "ml", "precio": 4800, "codigo": "I-420"},
            {"desc": "Barrera de humedad fieltro 15 lb", "unidad": "m²", "precio": 1850, "codigo": "I-525"},
        ]
    },

    # 🚪 PUERTAS Y VENTANAS
    "aberturas": {
        "nombre": "Puertas y Ventanas",
        "items": [
            {"desc": "Puerta terciado 200x80cm con marco", "unidad": "un", "precio": 85000, "codigo": "M-110"},
            {"desc": "Puerta madera sólida 200x90cm", "unidad": "un", "precio": 145000, "codigo": "M-215"},
            {"desc": "Ventana aluminio corredera 100x100cm", "unidad": "un", "precio": 95000, "codigo": "M-320"},
            {"desc": "Ventana PVC DVH 120x100cm", "unidad": "un", "precio": 180000, "codigo": "M-425"},
            {"desc": "Vidrio flotado 4mm instalado", "unidad": "m²", "precio": 18500, "codigo": "M-530"},
        ]
    },

    # 🎨 TERMINACIONES
    "terminaciones": {
        "nombre": "Terminaciones y Acabados",
        "items": [
            {"desc": "Pintura esmalte al agua 2 manos", "unidad": "m²", "precio": 4500, "codigo": "K-105"},
            {"desc": "Pasta muro + pintura latex", "unidad": "m²", "precio": 6800, "codigo": "K-210"},
            {"desc": "Barniz poliuretano 2 manos", "unidad": "m²", "precio": 5200, "codigo": "K-315"},
            {"desc": "Porcelanato 60x60 instalado", "unidad": "m²", "precio": 32000, "codigo": "L-120"},
            {"desc": "Palmetas cerámicas 30x30", "unidad": "m²", "precio": 18500, "codigo": "L-225"},
            {"desc": "Cielo yeso cartón + estructura", "unidad": "m²", "precio": 12800, "codigo": "J-110"},
        ]
    },

    # ⚡ INSTALACIONES
    "instalaciones": {
        "nombre": "Instalaciones",
        "items": [
            {"desc": "Punto eléctrico completo", "unidad": "un", "precio": 18500, "codigo": "P-110"},
            {"desc": "Punto agua fría PVC", "unidad": "un", "precio": 22000, "codigo": "P-215"},
            {"desc": "Punto desagüe PVC", "unidad": "un", "precio": 24500, "codigo": "P-320"},
            {"desc": "Calefón 16L tiro natural", "unidad": "un", "precio": 185000, "codigo": "P-425"},
            {"desc": "Instalación baño completo", "unidad": "un", "precio": 450000, "codigo": "P-530"},
        ]
    },

    # 🏊 ESPACIOS EXTERIORES
    "exteriores": {
        "nombre": "Espacios Exteriores",
        "items": [
            {"desc": "Piscina prefabricada 8x4m instalada", "unidad": "un", "precio": 4500000, "codigo": "Q-110"},
            {"desc": "Deck madera tratada", "unidad": "m²", "precio": 45000, "codigo": "Q-215"},
            {"desc": "Quincho con parrilla", "unidad": "un", "precio": 2800000, "codigo": "Q-320"},
            {"desc": "Pavimento hormigón e=10cm", "unidad": "m²", "precio": 18500, "codigo": "Q-425"},
            {"desc": "Pasto en palmetas instalado", "unidad": "m²", "precio": 5500, "codigo": "Q-530"},
        ]
    },

    # 🛠️ MANO DE OBRA
    "mano_obra": {
        "nombre": "Mano de Obra",
        "items": [
            {"desc": "Maestro primera especializado", "unidad": "hr", "precio": 12500, "codigo": "MO-01"},
            {"desc": "Jornal construcción", "unidad": "hr", "precio": 8500, "codigo": "MO-02"},
            {"desc": "Ayudante", "unidad": "hr", "precio": 6500, "codigo": "MO-03"},
            {"desc": "Administrativo obra", "unidad": "hr", "precio": 9500, "codigo": "MO-04"},
        ]
    }
}

# Keywords para búsqueda inteligente
KEYWORD_MAPPING = {
    # Fundaciones
    "excav": "fundacion",
    "zanja": "fundacion",
    "relleno": "fundacion",
    "hormigon": "fundacion",
    "radier": "fundacion",
    "fundacion": "fundacion",

    # Muros
    "muro": "muros",
    "pared": "muros",
    "tabique": "muros",
    "albanileria": "muros",
    "ladrillo": "muros",
    "bloque": "muros",

    # Techumbre
    "techo": "techumbre",
    "cubierta": "techumbre",
    "tejado": "techumbre",
    "zinc": "techumbre",
    "teja": "techumbre",
    "canal": "techumbre",

    # Aberturas
    "puerta": "aberturas",
    "ventana": "aberturas",
    "vidrio": "aberturas",
    "acceso": "aberturas",
    "entrada": "aberturas",

    # Terminaciones
    "pintura": "terminaciones",
    "pintar": "terminaciones",
    "ceramica": "terminaciones",
    "porcelanato": "terminaciones",
    "cielo": "terminaciones",
    "terminacion": "terminaciones",
    "acabado": "terminaciones",

    # Instalaciones
    "electrico": "instalaciones",
    "agua": "instalaciones",
    "desague": "instalaciones",
    "baño": "instalaciones",
    "bano": "instalaciones",
    "sanitario": "instalaciones",

    # Exteriores
    "piscina": "exteriores",
    "deck": "exteriores",
    "quincho": "exteriores",
    "pavimento": "exteriores",
    "pasto": "exteriores",
    "jardin": "exteriores",
}

def buscar_apus(consulta: str) -> list:
    """
    Busca APUs relevantes basado en lenguaje natural.
    Retorna lista de APUs que coinciden con la consulta.
    """
    consulta_lower = consulta.lower()
    resultados = []

    # Buscar por keywords
    for keyword, categoria in KEYWORD_MAPPING.items():
        if keyword in consulta_lower:
            if categoria in APU_CATALOG:
                resultados.extend(APU_CATALOG[categoria]["items"])
                break

    # Si no encontró nada, retornar terminaciones como default
    if not resultados:
        resultados = APU_CATALOG["terminaciones"]["items"][:3]

    return resultados[:5]  # Máximo 5 resultados
