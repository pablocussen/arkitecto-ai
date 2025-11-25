"""
Script para ingerir APUs (Análisis de Precios Unitarios) desde archivos Excel a Firestore.
"""
import os
import sys
from pathlib import Path
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import re
from typing import Dict, List, Any

# Cargar variables de entorno
load_dotenv()

def initialize_firebase():
    """Inicializa la conexión con Firebase."""
    cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH', './firebase-credentials.json')

    if not os.path.exists(cred_path):
        print(f"❌ Error: No se encontró el archivo de credenciales en {cred_path}")
        print("Por favor, descarga tus credenciales de Firebase y guárdalas en ese path.")
        sys.exit(1)

    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase inicializado correctamente")
        return firestore.client()
    except Exception as e:
        print(f"❌ Error al inicializar Firebase: {e}")
        sys.exit(1)

def clean_price(price_value) -> float:
    """Limpia y convierte valores de precio a float."""
    if pd.isna(price_value):
        return 0.0

    if isinstance(price_value, (int, float)):
        return float(price_value)

    # Si es string, eliminar símbolos de moneda, puntos y convertir comas a puntos
    if isinstance(price_value, str):
        price_str = price_value.strip()
        price_str = price_str.replace('$', '').replace('€', '')
        price_str = price_str.replace('.', '').replace(',', '.')
        price_str = re.sub(r'[^\d.]', '', price_str)
        try:
            return float(price_str) if price_str else 0.0
        except:
            return 0.0

    return 0.0

def extract_apu_from_excel(file_path: str) -> List[Dict[str, Any]]:
    """
    Extrae datos de APU de un archivo Excel.
    Intenta diferentes estrategias para encontrar los datos relevantes.
    """
    apus = []

    try:
        # Leer el archivo Excel
        xl_file = pd.ExcelFile(file_path)

        for sheet_name in xl_file.sheet_names:
            df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

            # Buscar patrones comunes en APUs
            # Estrategia 1: Buscar columnas con "Item", "Descripción", "Unidad", "Precio"
            for idx, row in df.iterrows():
                row_str = ' '.join([str(cell).lower() for cell in row if pd.notna(cell)])

                # Si encontramos una fila que parece ser encabezado
                if any(keyword in row_str for keyword in ['item', 'descripción', 'descripcion', 'unidad', 'precio', 'unitario']):
                    # Intentar extraer datos de las filas siguientes
                    header_idx = idx

                    # Buscar columnas clave
                    item_col = None
                    desc_col = None
                    unit_col = None
                    price_col = None

                    for col_idx, cell in enumerate(row):
                        cell_str = str(cell).lower() if pd.notna(cell) else ''
                        if 'item' in cell_str or 'código' in cell_str or 'codigo' in cell_str:
                            item_col = col_idx
                        elif 'descripción' in cell_str or 'descripcion' in cell_str or 'detalle' in cell_str:
                            desc_col = col_idx
                        elif 'unidad' in cell_str:
                            unit_col = col_idx
                        elif 'precio' in cell_str or 'unitario' in cell_str or 'total' in cell_str:
                            price_col = col_idx

                    # Extraer datos de las filas siguientes
                    if desc_col is not None:
                        for data_idx in range(header_idx + 1, min(header_idx + 100, len(df))):
                            row_data = df.iloc[data_idx]

                            descripcion = str(row_data.iloc[desc_col]) if desc_col < len(row_data) else ''

                            # Si la fila está vacía o es un subtotal, saltar
                            if pd.isna(row_data.iloc[desc_col]) or descripcion.lower() in ['nan', 'total', 'subtotal', '']:
                                continue

                            item = str(row_data.iloc[item_col]) if item_col is not None and item_col < len(row_data) else ''
                            unidad = str(row_data.iloc[unit_col]) if unit_col is not None and unit_col < len(row_data) else 'UN'
                            precio = clean_price(row_data.iloc[price_col]) if price_col is not None and price_col < len(row_data) else 0.0

                            if descripcion and descripcion != 'nan':
                                apus.append({
                                    'item': item,
                                    'descripcion': descripcion,
                                    'unidad': unidad,
                                    'precio_unitario': precio,
                                    'archivo_origen': Path(file_path).name,
                                    'hoja': sheet_name
                                })

                    break  # Ya procesamos esta hoja

            # Estrategia 2: Si el archivo tiene el nombre del APU, extraer precio total
            if len(apus) == 0:
                # Buscar valores numéricos que puedan ser precios
                file_name = Path(file_path).stem

                # Buscar celdas con valores de precio
                for idx, row in df.iterrows():
                    for col_idx, cell in enumerate(row):
                        if isinstance(cell, (int, float)) and cell > 0:
                            # Buscar descripción cercana
                            desc_candidates = []
                            for nearby_col in range(max(0, col_idx - 3), col_idx):
                                nearby_cell = row.iloc[nearby_col] if nearby_col < len(row) else None
                                if pd.notna(nearby_cell) and isinstance(nearby_cell, str) and len(nearby_cell) > 5:
                                    desc_candidates.append(nearby_cell)

                            descripcion = ' '.join(desc_candidates) if desc_candidates else file_name

                            if descripcion and len(descripcion) > 3:
                                apus.append({
                                    'item': file_name,
                                    'descripcion': descripcion,
                                    'unidad': 'UN',
                                    'precio_unitario': clean_price(cell),
                                    'archivo_origen': Path(file_path).name,
                                    'hoja': sheet_name
                                })
                                break

                    if len(apus) > 0:
                        break

    except Exception as e:
        print(f"⚠️  Error procesando {file_path}: {e}")

    return apus

def process_all_excels(data_dir: str = '../data') -> List[Dict[str, Any]]:
    """Procesa todos los archivos Excel en el directorio de datos."""
    all_apus = []
    data_path = Path(data_dir)

    if not data_path.exists():
        print(f"❌ Error: El directorio {data_dir} no existe")
        return []

    # Buscar todos los archivos Excel
    excel_files = list(data_path.rglob('*.xlsx'))
    excel_files.extend(list(data_path.rglob('*.xls')))

    print(f"📁 Encontrados {len(excel_files)} archivos Excel")

    for excel_file in excel_files:
        print(f"📄 Procesando: {excel_file.name}")
        apus = extract_apu_from_excel(str(excel_file))

        if apus:
            print(f"   ✅ Extraídos {len(apus)} items")
            all_apus.extend(apus)
        else:
            print(f"   ⚠️  No se encontraron datos")

    return all_apus

def upload_to_firestore(db, apus: List[Dict[str, Any]]):
    """Sube los APUs a Firestore."""
    collection_ref = db.collection('apus_db')

    print(f"\n🔄 Subiendo {len(apus)} items a Firestore...")

    batch = db.batch()
    batch_count = 0
    total_uploaded = 0

    for idx, apu in enumerate(apus):
        # Crear un ID único basado en el nombre del archivo y descripción
        doc_id = f"{apu['item']}_{apu['descripcion'][:50]}"
        doc_id = re.sub(r'[^\w\s-]', '', doc_id).strip().replace(' ', '_')

        doc_ref = collection_ref.document(doc_id)
        batch.set(doc_ref, apu)
        batch_count += 1

        # Firestore permite máximo 500 operaciones por batch
        if batch_count >= 500:
            batch.commit()
            total_uploaded += batch_count
            print(f"   📤 Subidos {total_uploaded}/{len(apus)} items")
            batch = db.batch()
            batch_count = 0

    # Commit final
    if batch_count > 0:
        batch.commit()
        total_uploaded += batch_count

    print(f"✅ Total subidos: {total_uploaded} items a Firestore")

def main():
    """Función principal."""
    print("🚀 Iniciando ingesta de APUs...")

    # Inicializar Firebase
    db = initialize_firebase()

    # Procesar archivos Excel
    apus = process_all_excels('../data')

    if not apus:
        print("❌ No se encontraron APUs para procesar")
        return

    print(f"\n📊 Total de APUs procesados: {len(apus)}")

    # Mostrar algunos ejemplos
    print("\n📋 Ejemplos de APUs:")
    for apu in apus[:5]:
        print(f"   - {apu['descripcion'][:60]}: ${apu['precio_unitario']:,.2f} / {apu['unidad']}")

    # Confirmar antes de subir
    respuesta = input("\n¿Deseas subir estos datos a Firestore? (s/n): ")

    if respuesta.lower() == 's':
        upload_to_firestore(db, apus)
        print("\n✅ ¡Ingesta completada exitosamente!")
    else:
        print("\n❌ Ingesta cancelada")

if __name__ == '__main__':
    main()
