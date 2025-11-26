"""
ARKITECTO AI - Catalogo APU Profesional v2.0
Sistema avanzado de presupuestos de construccion
Precios reales de mercado chileno (CLP) - 2024/2025
+100 partidas con codigos ONDAC/CDT compatibles
"""

# APUs organizados por categorias profesionales
APU_CATALOG = {
    # OBRAS PRELIMINARES
    "preliminares": {
        "nombre": "Obras Preliminares",
        "items": [
            {"desc": "Instalacion de faenas completa", "unidad": "gl", "precio": 850000, "codigo": "A-001"},
            {"desc": "Trazado y replanteo topografico", "unidad": "m2", "precio": 450, "codigo": "A-002"},
            {"desc": "Cierre perimetral provisorio", "unidad": "ml", "precio": 8500, "codigo": "A-003"},
            {"desc": "Bodega para materiales 3x3m", "unidad": "un", "precio": 180000, "codigo": "A-004"},
            {"desc": "Letrero de obra normativo", "unidad": "un", "precio": 85000, "codigo": "A-005"},
            {"desc": "Bano quimico mensual", "unidad": "mes", "precio": 95000, "codigo": "A-006"},
        ]
    },

    # MOVIMIENTO DE TIERRAS
    "movimiento_tierras": {
        "nombre": "Movimiento de Tierras",
        "items": [
            {"desc": "Excavacion manual terreno normal", "unidad": "m3", "precio": 12500, "codigo": "B-001"},
            {"desc": "Excavacion mecanizada retroexcavadora", "unidad": "m3", "precio": 8500, "codigo": "B-002"},
            {"desc": "Excavacion en roca con martillo", "unidad": "m3", "precio": 45000, "codigo": "B-003"},
            {"desc": "Relleno compactado material sitio", "unidad": "m3", "precio": 9500, "codigo": "B-004"},
            {"desc": "Relleno estructural estabilizado", "unidad": "m3", "precio": 18500, "codigo": "B-005"},
            {"desc": "Retiro escombros con contenedor", "unidad": "m3", "precio": 22000, "codigo": "B-006"},
            {"desc": "Escarpe terreno vegetal e=20cm", "unidad": "m2", "precio": 2500, "codigo": "B-007"},
            {"desc": "Nivelacion terreno con motoniveladora", "unidad": "m2", "precio": 1850, "codigo": "B-008"},
        ]
    },

    # FUNDACIONES
    "fundacion": {
        "nombre": "Fundaciones y Estructura",
        "items": [
            {"desc": "Emplantillado hormigon pobre H5", "unidad": "m3", "precio": 85000, "codigo": "C-001"},
            {"desc": "Hormigon fundaciones H20", "unidad": "m3", "precio": 125000, "codigo": "C-002"},
            {"desc": "Hormigon fundaciones H25", "unidad": "m3", "precio": 135000, "codigo": "C-003"},
            {"desc": "Hormigon fundaciones H30", "unidad": "m3", "precio": 145000, "codigo": "C-004"},
            {"desc": "Sobrecimiento hormigon H20", "unidad": "m3", "precio": 135000, "codigo": "C-005"},
            {"desc": "Radier hormigon H20 e=10cm", "unidad": "m2", "precio": 22500, "codigo": "C-006"},
            {"desc": "Radier hormigon H20 e=15cm con malla", "unidad": "m2", "precio": 28500, "codigo": "C-007"},
            {"desc": "Losa hormigon armado e=15cm", "unidad": "m2", "precio": 65000, "codigo": "C-008"},
            {"desc": "Viga hormigon armado 20x40cm", "unidad": "ml", "precio": 45000, "codigo": "C-009"},
            {"desc": "Pilares hormigon 30x30cm", "unidad": "ml", "precio": 55000, "codigo": "C-010"},
        ]
    },

    # ENFIERRADURA
    "enfierradura": {
        "nombre": "Enfierradura y Acero",
        "items": [
            {"desc": "Enfierradura A630-420H en barras", "unidad": "kg", "precio": 1250, "codigo": "E-001"},
            {"desc": "Malla acma C-139 4.2mm", "unidad": "m2", "precio": 4500, "codigo": "E-002"},
            {"desc": "Malla acma C-188 5.0mm", "unidad": "m2", "precio": 5800, "codigo": "E-003"},
            {"desc": "Malla acma C-257 6.0mm", "unidad": "m2", "precio": 7200, "codigo": "E-004"},
            {"desc": "Fierro estriado 8mm A630-420H", "unidad": "kg", "precio": 1180, "codigo": "E-005"},
            {"desc": "Fierro estriado 10mm A630-420H", "unidad": "kg", "precio": 1150, "codigo": "E-006"},
            {"desc": "Fierro estriado 12mm A630-420H", "unidad": "kg", "precio": 1120, "codigo": "E-007"},
            {"desc": "Conectores metalicos Simpson", "unidad": "un", "precio": 2500, "codigo": "E-008"},
        ]
    },

    # ALBANILERIA Y MUROS
    "muros": {
        "nombre": "Albanileria y Muros",
        "items": [
            {"desc": "Muro ladrillo princesa fiscal", "unidad": "m2", "precio": 42000, "codigo": "F-001"},
            {"desc": "Muro ladrillo titan 29x14x9", "unidad": "m2", "precio": 38000, "codigo": "F-002"},
            {"desc": "Muro bloque hormigon 19x19x39", "unidad": "m2", "precio": 28500, "codigo": "F-003"},
            {"desc": "Muro hormigon celular e=10cm", "unidad": "m2", "precio": 32000, "codigo": "F-004"},
            {"desc": "Muro piedra natural tipo laja", "unidad": "m2", "precio": 95000, "codigo": "F-005"},
            {"desc": "Cerco metalico malla acma", "unidad": "ml", "precio": 45000, "codigo": "F-006"},
            {"desc": "Pilar ladrillo 30x30cm", "unidad": "ml", "precio": 55000, "codigo": "F-007"},
            {"desc": "Cadena hormigon armado 15x20", "unidad": "ml", "precio": 22000, "codigo": "F-008"},
        ]
    },

    # ESTRUCTURA METALICA
    "metalica": {
        "nombre": "Estructura Metalica",
        "items": [
            {"desc": "Estructura metalica galpon liviano", "unidad": "m2", "precio": 65000, "codigo": "G-001"},
            {"desc": "Estructura metalica nave industrial", "unidad": "m2", "precio": 85000, "codigo": "G-002"},
            {"desc": "Viga metalica perfil H 200mm", "unidad": "kg", "precio": 2800, "codigo": "G-003"},
            {"desc": "Columna metalica perfil H 150mm", "unidad": "kg", "precio": 2650, "codigo": "G-004"},
            {"desc": "Costanera metalica 80x40x15x2mm", "unidad": "ml", "precio": 4500, "codigo": "G-005"},
            {"desc": "Tensores y arriostramientos", "unidad": "kg", "precio": 3200, "codigo": "G-006"},
            {"desc": "Pintura anticorrosiva estructura", "unidad": "m2", "precio": 8500, "codigo": "G-007"},
            {"desc": "Galvanizado en caliente", "unidad": "kg", "precio": 850, "codigo": "G-008"},
        ]
    },

    # TABIQUERIA
    "tabiques": {
        "nombre": "Tabiqueria Interior",
        "items": [
            {"desc": "Tabique metalcom simple 70mm + yeso", "unidad": "m2", "precio": 18500, "codigo": "H-001"},
            {"desc": "Tabique metalcom doble 90mm + yeso", "unidad": "m2", "precio": 24500, "codigo": "H-002"},
            {"desc": "Tabique madera OSB 9mm ambas caras", "unidad": "m2", "precio": 22000, "codigo": "H-003"},
            {"desc": "Tabique madera terciado 12mm", "unidad": "m2", "precio": 28000, "codigo": "H-004"},
            {"desc": "Aislacion lana mineral 50mm", "unidad": "m2", "precio": 4500, "codigo": "H-005"},
            {"desc": "Aislacion lana mineral 100mm", "unidad": "m2", "precio": 7800, "codigo": "H-006"},
            {"desc": "Barrera humedad polietileno 0.2mm", "unidad": "m2", "precio": 850, "codigo": "H-007"},
            {"desc": "Fibrocemento 6mm para exterior", "unidad": "m2", "precio": 12500, "codigo": "H-008"},
        ]
    },

    # TECHUMBRE
    "techumbre": {
        "nombre": "Techumbre y Cubierta",
        "items": [
            {"desc": "Cerchas madera pino dimensionado", "unidad": "m2", "precio": 28000, "codigo": "I-001"},
            {"desc": "Cerchas metalicas galvanizadas", "unidad": "m2", "precio": 35000, "codigo": "I-002"},
            {"desc": "Cubierta zinc ondulado 0.35mm", "unidad": "m2", "precio": 12500, "codigo": "I-003"},
            {"desc": "Cubierta zinc acanalado 0.5mm", "unidad": "m2", "precio": 18500, "codigo": "I-004"},
            {"desc": "Cubierta teja asfaltica premium", "unidad": "m2", "precio": 22500, "codigo": "I-005"},
            {"desc": "Cubierta teja ceramica natural", "unidad": "m2", "precio": 45000, "codigo": "I-006"},
            {"desc": "Cubierta policarbonato alveolar 6mm", "unidad": "m2", "precio": 28000, "codigo": "I-007"},
            {"desc": "Canal zinc desarrollo 33cm", "unidad": "ml", "precio": 4800, "codigo": "I-008"},
            {"desc": "Bajada aguas lluvia PVC 110mm", "unidad": "ml", "precio": 8500, "codigo": "I-009"},
            {"desc": "Fieltro asfaltico 15lb", "unidad": "m2", "precio": 1850, "codigo": "I-010"},
            {"desc": "Membrana asfaltica 3mm", "unidad": "m2", "precio": 12500, "codigo": "I-011"},
            {"desc": "Aislacion termica poliestireno 50mm", "unidad": "m2", "precio": 5500, "codigo": "I-012"},
        ]
    },

    # CIELOS
    "cielos": {
        "nombre": "Cielos y Plafones",
        "items": [
            {"desc": "Cielo yeso carton 10mm + estructura", "unidad": "m2", "precio": 12800, "codigo": "J-001"},
            {"desc": "Cielo yeso carton 15mm resistente fuego", "unidad": "m2", "precio": 15500, "codigo": "J-002"},
            {"desc": "Cielo PVC machihembrado blanco", "unidad": "m2", "precio": 9500, "codigo": "J-003"},
            {"desc": "Cielo madera pino cepillado", "unidad": "m2", "precio": 22000, "codigo": "J-004"},
            {"desc": "Cielo modular Armstrong 60x60", "unidad": "m2", "precio": 18500, "codigo": "J-005"},
            {"desc": "Cornisa yeso decorativa", "unidad": "ml", "precio": 4500, "codigo": "J-006"},
        ]
    },

    # REVESTIMIENTOS INTERIORES
    "revestimientos": {
        "nombre": "Revestimientos Interiores",
        "items": [
            {"desc": "Enlucido yeso interior 15mm", "unidad": "m2", "precio": 8500, "codigo": "K-001"},
            {"desc": "Estuco cemento exterior 20mm", "unidad": "m2", "precio": 12800, "codigo": "K-002"},
            {"desc": "Pasta muro + lijado fino", "unidad": "m2", "precio": 4500, "codigo": "K-003"},
            {"desc": "Ceramica muro 25x40cm bano", "unidad": "m2", "precio": 22000, "codigo": "K-004"},
            {"desc": "Porcelanato muro 30x60cm", "unidad": "m2", "precio": 35000, "codigo": "K-005"},
            {"desc": "Piedra pizarra natural muro", "unidad": "m2", "precio": 65000, "codigo": "K-006"},
            {"desc": "Papel mural vinilico lavable", "unidad": "m2", "precio": 12500, "codigo": "K-007"},
            {"desc": "Pintura latex interior 2 manos", "unidad": "m2", "precio": 3800, "codigo": "K-008"},
            {"desc": "Pintura esmalte al agua 2 manos", "unidad": "m2", "precio": 4500, "codigo": "K-009"},
            {"desc": "Pintura exterior acrilica 2 manos", "unidad": "m2", "precio": 5200, "codigo": "K-010"},
        ]
    },

    # PISOS
    "pisos": {
        "nombre": "Pisos y Pavimentos",
        "items": [
            {"desc": "Ceramica piso 45x45cm trafico alto", "unidad": "m2", "precio": 18500, "codigo": "L-001"},
            {"desc": "Porcelanato piso 60x60cm rectificado", "unidad": "m2", "precio": 32000, "codigo": "L-002"},
            {"desc": "Porcelanato 80x80cm premium", "unidad": "m2", "precio": 45000, "codigo": "L-003"},
            {"desc": "Piso flotante 8mm AC4 residencial", "unidad": "m2", "precio": 12500, "codigo": "L-004"},
            {"desc": "Piso flotante 12mm AC5 comercial", "unidad": "m2", "precio": 18500, "codigo": "L-005"},
            {"desc": "Piso vinilico SPC 5mm click", "unidad": "m2", "precio": 22000, "codigo": "L-006"},
            {"desc": "Parquet roble americano macizo", "unidad": "m2", "precio": 65000, "codigo": "L-007"},
            {"desc": "Alfombra bouclé instalada", "unidad": "m2", "precio": 15500, "codigo": "L-008"},
            {"desc": "Piso epóxico industrial", "unidad": "m2", "precio": 28000, "codigo": "L-009"},
            {"desc": "Hormigon pulido con endurecedor", "unidad": "m2", "precio": 22000, "codigo": "L-010"},
            {"desc": "Guardapolvo MDF 7cm pintado", "unidad": "ml", "precio": 3500, "codigo": "L-011"},
        ]
    },

    # PUERTAS Y VENTANAS
    "aberturas": {
        "nombre": "Puertas y Ventanas",
        "items": [
            {"desc": "Puerta terciado 200x80cm con marco", "unidad": "un", "precio": 85000, "codigo": "M-001"},
            {"desc": "Puerta terciado 200x90cm con marco", "unidad": "un", "precio": 95000, "codigo": "M-002"},
            {"desc": "Puerta MDF moldurada premium", "unidad": "un", "precio": 125000, "codigo": "M-003"},
            {"desc": "Puerta madera solida cedro", "unidad": "un", "precio": 185000, "codigo": "M-004"},
            {"desc": "Puerta metalica cortafuego 90min", "unidad": "un", "precio": 450000, "codigo": "M-005"},
            {"desc": "Puerta corredera empotrada", "unidad": "un", "precio": 185000, "codigo": "M-006"},
            {"desc": "Ventana aluminio corredera 100x100", "unidad": "un", "precio": 95000, "codigo": "M-007"},
            {"desc": "Ventana aluminio corredera 150x120", "unidad": "un", "precio": 145000, "codigo": "M-008"},
            {"desc": "Ventana PVC DVH 120x100cm", "unidad": "un", "precio": 180000, "codigo": "M-009"},
            {"desc": "Ventana PVC DVH 180x150cm", "unidad": "un", "precio": 320000, "codigo": "M-010"},
            {"desc": "Puerta ventana aluminio corredera", "unidad": "un", "precio": 285000, "codigo": "M-011"},
            {"desc": "Vidrio flotado 4mm instalado", "unidad": "m2", "precio": 18500, "codigo": "M-012"},
            {"desc": "Vidrio templado 6mm instalado", "unidad": "m2", "precio": 45000, "codigo": "M-013"},
            {"desc": "DVH 4+12+4mm instalado", "unidad": "m2", "precio": 65000, "codigo": "M-014"},
            {"desc": "Quincalleria puerta completa", "unidad": "un", "precio": 25000, "codigo": "M-015"},
            {"desc": "Cerradura cilindro europeo", "unidad": "un", "precio": 45000, "codigo": "M-016"},
        ]
    },

    # INSTALACIONES SANITARIAS
    "sanitarias": {
        "nombre": "Instalaciones Sanitarias",
        "items": [
            {"desc": "Punto agua fria PVC 20mm", "unidad": "un", "precio": 22000, "codigo": "P-001"},
            {"desc": "Punto agua caliente cobre 1/2", "unidad": "un", "precio": 28500, "codigo": "P-002"},
            {"desc": "Punto desague PVC 50mm", "unidad": "un", "precio": 24500, "codigo": "P-003"},
            {"desc": "Punto desague PVC 110mm", "unidad": "un", "precio": 32000, "codigo": "P-004"},
            {"desc": "Camara inspeccion 60x60cm", "unidad": "un", "precio": 125000, "codigo": "P-005"},
            {"desc": "Fosa septica 3000L instalada", "unidad": "un", "precio": 850000, "codigo": "P-006"},
            {"desc": "WC one piece economico", "unidad": "un", "precio": 95000, "codigo": "P-007"},
            {"desc": "WC one piece premium", "unidad": "un", "precio": 185000, "codigo": "P-008"},
            {"desc": "Lavamanos pedestal blanco", "unidad": "un", "precio": 65000, "codigo": "P-009"},
            {"desc": "Lavamanos sobreponer premium", "unidad": "un", "precio": 125000, "codigo": "P-010"},
            {"desc": "Vanitorio MDF 60cm con lavamanos", "unidad": "un", "precio": 185000, "codigo": "P-011"},
            {"desc": "Ducha completa con griferia", "unidad": "un", "precio": 145000, "codigo": "P-012"},
            {"desc": "Tina acrilica 170x70cm", "unidad": "un", "precio": 285000, "codigo": "P-013"},
            {"desc": "Jacuzzi 2 personas instalado", "unidad": "un", "precio": 1250000, "codigo": "P-014"},
            {"desc": "Calefon 16L tiro natural", "unidad": "un", "precio": 185000, "codigo": "P-015"},
            {"desc": "Calefon 16L tiro forzado", "unidad": "un", "precio": 285000, "codigo": "P-016"},
            {"desc": "Termotanque electrico 80L", "unidad": "un", "precio": 225000, "codigo": "P-017"},
            {"desc": "Lavaplatos acero 80x50cm", "unidad": "un", "precio": 85000, "codigo": "P-018"},
            {"desc": "Griferia lavaplatos monocomando", "unidad": "un", "precio": 65000, "codigo": "P-019"},
        ]
    },

    # INSTALACIONES ELECTRICAS
    "electricas": {
        "nombre": "Instalaciones Electricas",
        "items": [
            {"desc": "Punto electrico enchufe 10A", "unidad": "un", "precio": 18500, "codigo": "R-001"},
            {"desc": "Punto electrico enchufe 20A", "unidad": "un", "precio": 24500, "codigo": "R-002"},
            {"desc": "Punto iluminacion centro", "unidad": "un", "precio": 16500, "codigo": "R-003"},
            {"desc": "Punto iluminacion muro", "unidad": "un", "precio": 14500, "codigo": "R-004"},
            {"desc": "Punto interruptor simple", "unidad": "un", "precio": 12500, "codigo": "R-005"},
            {"desc": "Punto interruptor doble", "unidad": "un", "precio": 15500, "codigo": "R-006"},
            {"desc": "Punto interruptor 9/12", "unidad": "un", "precio": 18500, "codigo": "R-007"},
            {"desc": "Tablero electrico 12 polos", "unidad": "un", "precio": 125000, "codigo": "R-008"},
            {"desc": "Tablero electrico 24 polos", "unidad": "un", "precio": 185000, "codigo": "R-009"},
            {"desc": "Diferencial 25A 30mA", "unidad": "un", "precio": 45000, "codigo": "R-010"},
            {"desc": "Automatico 16A curva C", "unidad": "un", "precio": 8500, "codigo": "R-011"},
            {"desc": "Empalme monofasico SEC", "unidad": "un", "precio": 350000, "codigo": "R-012"},
            {"desc": "Empalme trifasico SEC", "unidad": "un", "precio": 650000, "codigo": "R-013"},
            {"desc": "Luminaria LED panel 60x60 40W", "unidad": "un", "precio": 35000, "codigo": "R-014"},
            {"desc": "Luminaria LED sobreponer 18W", "unidad": "un", "precio": 18500, "codigo": "R-015"},
            {"desc": "Foco LED embutido 7W dicroico", "unidad": "un", "precio": 8500, "codigo": "R-016"},
        ]
    },

    # INSTALACIONES GAS
    "gas": {
        "nombre": "Instalaciones de Gas",
        "items": [
            {"desc": "Punto gas cocina con llave", "unidad": "un", "precio": 65000, "codigo": "S-001"},
            {"desc": "Punto gas calefont con llave", "unidad": "un", "precio": 75000, "codigo": "S-002"},
            {"desc": "Red gas cobre 1/2 interior", "unidad": "ml", "precio": 12500, "codigo": "S-003"},
            {"desc": "Medidor gas SEC instalado", "unidad": "un", "precio": 185000, "codigo": "S-004"},
            {"desc": "Regulador gas 2 etapas", "unidad": "un", "precio": 45000, "codigo": "S-005"},
            {"desc": "Estanque gas 45kg instalado", "unidad": "un", "precio": 285000, "codigo": "S-006"},
        ]
    },

    # CLIMATIZACION
    "climatizacion": {
        "nombre": "Climatizacion y Ventilacion",
        "items": [
            {"desc": "Aire acondicionado split 12000BTU", "unidad": "un", "precio": 450000, "codigo": "T-001"},
            {"desc": "Aire acondicionado split 18000BTU", "unidad": "un", "precio": 650000, "codigo": "T-002"},
            {"desc": "Aire acondicionado split 24000BTU", "unidad": "un", "precio": 850000, "codigo": "T-003"},
            {"desc": "Estufa pellet 10kW instalada", "unidad": "un", "precio": 1250000, "codigo": "T-004"},
            {"desc": "Chimenea a gas ventilada", "unidad": "un", "precio": 950000, "codigo": "T-005"},
            {"desc": "Radiador electrico mural 1500W", "unidad": "un", "precio": 125000, "codigo": "T-006"},
            {"desc": "Extractor bano 100mm", "unidad": "un", "precio": 35000, "codigo": "T-007"},
            {"desc": "Campana cocina 60cm instalada", "unidad": "un", "precio": 185000, "codigo": "T-008"},
            {"desc": "Piso radiante electrico", "unidad": "m2", "precio": 45000, "codigo": "T-009"},
        ]
    },

    # ESPACIOS EXTERIORES
    "exteriores": {
        "nombre": "Espacios Exteriores",
        "items": [
            {"desc": "Piscina prefabricada 6x3m instalada", "unidad": "un", "precio": 3500000, "codigo": "Q-001"},
            {"desc": "Piscina prefabricada 8x4m instalada", "unidad": "un", "precio": 4500000, "codigo": "Q-002"},
            {"desc": "Piscina hormigon 8x4m terminada", "unidad": "un", "precio": 12500000, "codigo": "Q-003"},
            {"desc": "Deck madera pino impregnado", "unidad": "m2", "precio": 35000, "codigo": "Q-004"},
            {"desc": "Deck madera composite WPC", "unidad": "m2", "precio": 55000, "codigo": "Q-005"},
            {"desc": "Quincho mamposteria completo", "unidad": "un", "precio": 2800000, "codigo": "Q-006"},
            {"desc": "Quincho metalico con cubierta", "unidad": "un", "precio": 1850000, "codigo": "Q-007"},
            {"desc": "Parrilla ladrillo refractario", "unidad": "un", "precio": 450000, "codigo": "Q-008"},
            {"desc": "Horno barro artesanal", "unidad": "un", "precio": 650000, "codigo": "Q-009"},
            {"desc": "Pergola madera 4x4m", "unidad": "un", "precio": 850000, "codigo": "Q-010"},
            {"desc": "Pergola metalica 4x4m", "unidad": "un", "precio": 1250000, "codigo": "Q-011"},
            {"desc": "Pavimento adocreto 6cm", "unidad": "m2", "precio": 22000, "codigo": "Q-012"},
            {"desc": "Pavimento hormigon impreso", "unidad": "m2", "precio": 28000, "codigo": "Q-013"},
            {"desc": "Pavimento hormigon e=10cm", "unidad": "m2", "precio": 18500, "codigo": "Q-014"},
            {"desc": "Baldosa cemento 40x40cm", "unidad": "m2", "precio": 15500, "codigo": "Q-015"},
            {"desc": "Pasto natural en palmetas", "unidad": "m2", "precio": 5500, "codigo": "Q-016"},
            {"desc": "Pasto sintetico 35mm", "unidad": "m2", "precio": 25000, "codigo": "Q-017"},
            {"desc": "Cerco madera impregnada 1.8m", "unidad": "ml", "precio": 45000, "codigo": "Q-018"},
            {"desc": "Porton metalico corredera 3m", "unidad": "un", "precio": 650000, "codigo": "Q-019"},
            {"desc": "Porton automatico con motor", "unidad": "un", "precio": 1250000, "codigo": "Q-020"},
            {"desc": "Iluminacion solar jardin LED", "unidad": "un", "precio": 25000, "codigo": "Q-021"},
            {"desc": "Riego automatico por zona", "unidad": "un", "precio": 185000, "codigo": "Q-022"},
        ]
    },

    # MANO DE OBRA
    "mano_obra": {
        "nombre": "Mano de Obra",
        "items": [
            {"desc": "Maestro primera especializado", "unidad": "hr", "precio": 12500, "codigo": "MO-001"},
            {"desc": "Maestro segunda", "unidad": "hr", "precio": 9500, "codigo": "MO-002"},
            {"desc": "Jornal construccion", "unidad": "hr", "precio": 8500, "codigo": "MO-003"},
            {"desc": "Ayudante obra", "unidad": "hr", "precio": 6500, "codigo": "MO-004"},
            {"desc": "Electricista certificado SEC", "unidad": "hr", "precio": 15000, "codigo": "MO-005"},
            {"desc": "Gasfiter certificado SEC", "unidad": "hr", "precio": 15000, "codigo": "MO-006"},
            {"desc": "Soldador calificado", "unidad": "hr", "precio": 14000, "codigo": "MO-007"},
            {"desc": "Pintor profesional", "unidad": "hr", "precio": 10000, "codigo": "MO-008"},
            {"desc": "Ceramista instalador", "unidad": "hr", "precio": 11000, "codigo": "MO-009"},
            {"desc": "Carpintero terminaciones", "unidad": "hr", "precio": 12000, "codigo": "MO-010"},
        ]
    },

    # EQUIPOS Y HERRAMIENTAS
    "equipos": {
        "nombre": "Arriendo Equipos",
        "items": [
            {"desc": "Retroexcavadora JCB dia", "unidad": "dia", "precio": 185000, "codigo": "U-001"},
            {"desc": "Minicargador Bobcat dia", "unidad": "dia", "precio": 145000, "codigo": "U-002"},
            {"desc": "Placa compactadora dia", "unidad": "dia", "precio": 35000, "codigo": "U-003"},
            {"desc": "Betonera 350L dia", "unidad": "dia", "precio": 25000, "codigo": "U-004"},
            {"desc": "Andamio cuerpo mes", "unidad": "mes", "precio": 15000, "codigo": "U-005"},
            {"desc": "Bomba hormigon hora", "unidad": "hr", "precio": 85000, "codigo": "U-006"},
            {"desc": "Grua torre mes", "unidad": "mes", "precio": 2500000, "codigo": "U-007"},
            {"desc": "Generador 10KVA dia", "unidad": "dia", "precio": 65000, "codigo": "U-008"},
        ]
    },
}

# Keywords para busqueda inteligente (expandido)
KEYWORD_MAPPING = {
    # Preliminares
    "faena": "preliminares", "instalacion": "preliminares", "bodega": "preliminares",
    "letrero": "preliminares", "bano quimico": "preliminares",

    # Movimiento tierras
    "excav": "movimiento_tierras", "excavacion": "movimiento_tierras",
    "zanja": "movimiento_tierras", "relleno": "movimiento_tierras",
    "escarpe": "movimiento_tierras", "nivelacion": "movimiento_tierras",
    "escombro": "movimiento_tierras", "retiro": "movimiento_tierras",

    # Fundaciones
    "fundacion": "fundacion", "cimiento": "fundacion", "hormigon": "fundacion",
    "radier": "fundacion", "losa": "fundacion", "viga": "fundacion",
    "pilar": "fundacion", "columna": "fundacion", "sobrecimiento": "fundacion",

    # Enfierradura
    "fierro": "enfierradura", "enfierradura": "enfierradura", "acero": "enfierradura",
    "malla": "enfierradura", "armadura": "enfierradura",

    # Muros
    "muro": "muros", "pared": "muros", "albanileria": "muros",
    "ladrillo": "muros", "bloque": "muros", "cerco": "muros",
    "cadena": "muros", "piedra": "muros",

    # Metalica
    "galpon": "metalica", "nave": "metalica", "estructura metalica": "metalica",
    "perfil": "metalica", "costanera": "metalica",

    # Tabiques
    "tabique": "tabiques", "metalcom": "tabiques", "divisorio": "tabiques",
    "aislacion": "tabiques", "lana": "tabiques", "fibrocemento": "tabiques",

    # Techumbre
    "techo": "techumbre", "cubierta": "techumbre", "tejado": "techumbre",
    "zinc": "techumbre", "teja": "techumbre", "cercha": "techumbre",
    "canal": "techumbre", "bajada": "techumbre", "membrana": "techumbre",

    # Cielos
    "cielo": "cielos", "plafon": "cielos", "cornisa": "cielos",

    # Revestimientos
    "enlucido": "revestimientos", "estuco": "revestimientos",
    "pintura": "revestimientos", "pintar": "revestimientos",
    "papel mural": "revestimientos", "revestimiento": "revestimientos",

    # Pisos
    "piso": "pisos", "ceramica": "pisos", "porcelanato": "pisos",
    "flotante": "pisos", "parquet": "pisos", "alfombra": "pisos",
    "vinilico": "pisos", "guardapolvo": "pisos", "epoxico": "pisos",

    # Aberturas
    "puerta": "aberturas", "ventana": "aberturas", "vidrio": "aberturas",
    "acceso": "aberturas", "entrada": "aberturas", "cerradura": "aberturas",
    "quincalleria": "aberturas", "dvh": "aberturas",

    # Sanitarias
    "agua": "sanitarias", "desague": "sanitarias", "bano": "sanitarias",
    "sanitario": "sanitarias", "wc": "sanitarias", "lavamanos": "sanitarias",
    "ducha": "sanitarias", "tina": "sanitarias", "calefont": "sanitarias",
    "termo": "sanitarias", "lavaplatos": "sanitarias", "griferia": "sanitarias",
    "fosa": "sanitarias", "camara": "sanitarias",

    # Electricas
    "electrico": "electricas", "electricidad": "electricas",
    "enchufe": "electricas", "iluminacion": "electricas", "luz": "electricas",
    "tablero": "electricas", "empalme": "electricas", "led": "electricas",
    "interruptor": "electricas", "luminaria": "electricas",

    # Gas
    "gas": "gas", "cocina": "gas", "regulador": "gas", "estanque": "gas",

    # Climatizacion
    "aire acondicionado": "climatizacion", "split": "climatizacion",
    "calefaccion": "climatizacion", "estufa": "climatizacion",
    "chimenea": "climatizacion", "extractor": "climatizacion",
    "campana": "climatizacion", "ventilacion": "climatizacion",

    # Exteriores
    "piscina": "exteriores", "deck": "exteriores", "quincho": "exteriores",
    "parrilla": "exteriores", "horno": "exteriores", "pergola": "exteriores",
    "pavimento": "exteriores", "adocreto": "exteriores",
    "pasto": "exteriores", "jardin": "exteriores", "riego": "exteriores",
    "porton": "exteriores", "exterior": "exteriores",

    # Mano de obra
    "maestro": "mano_obra", "jornal": "mano_obra", "ayudante": "mano_obra",
    "instalador": "mano_obra", "mano de obra": "mano_obra",

    # Equipos
    "retroexcavadora": "equipos", "bobcat": "equipos", "betonera": "equipos",
    "andamio": "equipos", "grua": "equipos", "arriendo": "equipos",
}

def buscar_apus(consulta: str, max_resultados: int = 8) -> list:
    """
    Busqueda inteligente de APUs usando multiples criterios.
    Soporta busqueda por keywords, categorias y texto libre.
    Retorna lista ordenada por relevancia.
    """
    consulta_lower = consulta.lower()
    resultados = []
    categorias_encontradas = set()

    # 1. Buscar por keywords exactos
    for keyword, categoria in KEYWORD_MAPPING.items():
        if keyword in consulta_lower and categoria not in categorias_encontradas:
            if categoria in APU_CATALOG:
                categorias_encontradas.add(categoria)
                # Agregar items de esta categoria
                for item in APU_CATALOG[categoria]["items"]:
                    item_copy = item.copy()
                    item_copy["categoria"] = APU_CATALOG[categoria]["nombre"]
                    resultados.append(item_copy)

    # 2. Si no hay resultados, buscar en descripciones
    if not resultados:
        palabras = consulta_lower.split()
        for cat_key, categoria in APU_CATALOG.items():
            for item in categoria["items"]:
                desc_lower = item["desc"].lower()
                for palabra in palabras:
                    if len(palabra) > 3 and palabra in desc_lower:
                        item_copy = item.copy()
                        item_copy["categoria"] = categoria["nombre"]
                        if item_copy not in resultados:
                            resultados.append(item_copy)

    # 3. Si aun no hay resultados, usar terminaciones como fallback
    if not resultados:
        for item in APU_CATALOG["revestimientos"]["items"][:3]:
            item_copy = item.copy()
            item_copy["categoria"] = "Terminaciones"
            resultados.append(item_copy)

    # 4. Eliminar duplicados manteniendo orden
    vistos = set()
    unicos = []
    for item in resultados:
        key = item["codigo"]
        if key not in vistos:
            vistos.add(key)
            unicos.append(item)

    return unicos[:max_resultados]


def calcular_presupuesto_completo(consulta: str, area: float = None, cantidad: int = None) -> dict:
    """
    Genera un presupuesto completo con desglose profesional.
    Incluye materiales, mano de obra, gastos generales e imprevistos.
    """
    apus = buscar_apus(consulta)

    items = []
    subtotal_directo = 0

    for apu in apus:
        # Determinar cantidad segun unidad
        if apu["unidad"] in ["m2", "m²"]:
            cant = area if area else 30
        elif apu["unidad"] in ["m3", "m³"]:
            cant = (area / 10) if area else 3
        elif apu["unidad"] in ["ml", "m"]:
            cant = (area ** 0.5 * 4) if area else 12
        elif apu["unidad"] == "kg":
            cant = (area * 5) if area else 50
        elif apu["unidad"] == "un":
            cant = cantidad if cantidad else 1
        else:
            cant = 1

        cant = round(cant, 2)
        subtotal = apu["precio"] * cant
        subtotal_directo += subtotal

        items.append({
            "elemento": apu["desc"].split(" - ")[0][:50],
            "descripcion": f"{apu['desc']} | Codigo: {apu['codigo']}",
            "cantidad": cant,
            "unidad": apu["unidad"],
            "precio_unitario": apu["precio"],
            "subtotal": subtotal,
            "apu_origen": f"APU Pro {apu['codigo']}",
            "categoria": apu.get("categoria", "General")
        })

    # Agregar costos indirectos
    mano_obra = subtotal_directo * 0.18  # 18%
    gastos_generales = subtotal_directo * 0.08  # 8%
    imprevistos = subtotal_directo * 0.05  # 5%
    utilidad = subtotal_directo * 0.10  # 10%

    items.append({
        "elemento": "Mano de obra especializada",
        "descripcion": "Maestros, oficiales y ayudantes segun partidas | 18% CD",
        "cantidad": 1, "unidad": "gl",
        "precio_unitario": mano_obra, "subtotal": mano_obra,
        "apu_origen": "MO-18%", "categoria": "Costos Indirectos"
    })

    items.append({
        "elemento": "Gastos generales de obra",
        "descripcion": "Supervision, seguros, arriendos, transporte | 8% CD",
        "cantidad": 1, "unidad": "gl",
        "precio_unitario": gastos_generales, "subtotal": gastos_generales,
        "apu_origen": "GG-8%", "categoria": "Costos Indirectos"
    })

    items.append({
        "elemento": "Imprevistos y contingencias",
        "descripcion": "Reserva para variaciones y emergencias | 5% CD",
        "cantidad": 1, "unidad": "gl",
        "precio_unitario": imprevistos, "subtotal": imprevistos,
        "apu_origen": "IMP-5%", "categoria": "Costos Indirectos"
    })

    items.append({
        "elemento": "Utilidad contratista",
        "descripcion": "Margen profesional del ejecutor | 10% CD",
        "cantidad": 1, "unidad": "gl",
        "precio_unitario": utilidad, "subtotal": utilidad,
        "apu_origen": "UTI-10%", "categoria": "Costos Indirectos"
    })

    total = subtotal_directo + mano_obra + gastos_generales + imprevistos + utilidad

    return {
        "items": items,
        "subtotal_directo": int(subtotal_directo),
        "mano_obra": int(mano_obra),
        "gastos_generales": int(gastos_generales),
        "imprevistos": int(imprevistos),
        "utilidad": int(utilidad),
        "total_estimado": int(total),
        "moneda": "CLP",
        "iva_incluido": False,
        "total_con_iva": int(total * 1.19)
    }
