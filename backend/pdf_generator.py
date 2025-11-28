"""
ARKITECTO AI - Generador de PDF Profesional
Genera presupuestos en formato PDF con diseño profesional
"""

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from io import BytesIO
from datetime import datetime
import locale

# Intentar configurar locale para formato de moneda chilena
try:
    locale.setlocale(locale.LC_ALL, 'es_CL.UTF-8')
except:
    try:
        locale.setlocale(locale.LC_ALL, 'Spanish_Chile.1252')
    except:
        pass

def format_clp(amount: int) -> str:
    """Formatea un monto en pesos chilenos"""
    try:
        return f"${amount:,.0f}".replace(",", ".")
    except:
        return f"${amount}"

def generate_budget_pdf(presupuesto: dict, metadata: dict = None, client_info: dict = None) -> BytesIO:
    """
    Genera un PDF profesional del presupuesto.

    Args:
        presupuesto: Dict con items, total_estimado, etc.
        metadata: Info adicional del presupuesto
        client_info: Info del cliente (opcional)

    Returns:
        BytesIO buffer con el PDF generado
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=1.5*cm,
        leftMargin=1.5*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    elements = []
    styles = getSampleStyleSheet()

    # Estilos personalizados
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#00F3FF'),
        spaceAfter=30,
        alignment=TA_CENTER
    )

    subtitle_style = ParagraphStyle(
        'CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#666666'),
        spaceAfter=20,
        alignment=TA_CENTER
    )

    section_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#1a1a2e'),
        spaceBefore=20,
        spaceAfter=10
    )

    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.HexColor('#333333')
    )

    # Header
    elements.append(Paragraph("ARKITECTO AI", title_style))
    elements.append(Paragraph("Presupuesto de Construccion Profesional", subtitle_style))
    elements.append(Spacer(1, 0.3*inch))

    # Fecha y numero de presupuesto
    fecha = datetime.now().strftime("%d/%m/%Y %H:%M")
    num_presupuesto = f"PRE-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    info_data = [
        ["Fecha:", fecha, "N° Presupuesto:", num_presupuesto],
    ]

    if client_info:
        if client_info.get('nombre'):
            info_data.append(["Cliente:", client_info.get('nombre', ''), "", ""])
        if client_info.get('email'):
            info_data.append(["Email:", client_info.get('email', ''), "", ""])

    info_table = Table(info_data, colWidths=[1.5*inch, 2.5*inch, 1.5*inch, 2*inch])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#666666')),
        ('TEXTCOLOR', (2, 0), (2, -1), colors.HexColor('#666666')),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica-Bold'),
        ('FONTNAME', (3, 0), (3, -1), 'Helvetica-Bold'),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 0.3*inch))

    # Descripcion del proyecto
    if metadata and metadata.get('categoria'):
        elements.append(Paragraph(f"Categoria: {metadata.get('categoria')}", section_style))

    elements.append(Spacer(1, 0.2*inch))

    # Tabla de partidas
    elements.append(Paragraph("Detalle de Partidas", section_style))

    # Headers de la tabla
    table_data = [
        ["Item", "Descripcion", "Cant.", "Unidad", "P. Unit.", "Subtotal"]
    ]

    items = presupuesto.get('items', [])
    for i, item in enumerate(items, 1):
        # Truncar descripcion si es muy larga
        desc = item.get('descripcion', item.get('elemento', ''))
        if len(desc) > 50:
            desc = desc[:47] + "..."

        table_data.append([
            str(i),
            desc,
            f"{item.get('cantidad', 0):.2f}",
            item.get('unidad', 'gl'),
            format_clp(int(item.get('precio_unitario', 0))),
            format_clp(int(item.get('subtotal', 0)))
        ])

    # Crear tabla
    col_widths = [0.4*inch, 3*inch, 0.6*inch, 0.6*inch, 1*inch, 1*inch]
    table = Table(table_data, colWidths=col_widths, repeatRows=1)

    table.setStyle(TableStyle([
        # Header
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1a1a2e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),

        # Body
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 8),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),  # Item number
        ('ALIGN', (2, 1), (2, -1), 'RIGHT'),   # Cantidad
        ('ALIGN', (3, 1), (3, -1), 'CENTER'),  # Unidad
        ('ALIGN', (4, 1), (-1, -1), 'RIGHT'),  # Precios

        # Alternating row colors
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')]),

        # Borders
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#dddddd')),
        ('LINEBELOW', (0, 0), (-1, 0), 2, colors.HexColor('#00F3FF')),

        # Padding
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    elements.append(table)
    elements.append(Spacer(1, 0.3*inch))

    # Resumen de costos
    elements.append(Paragraph("Resumen de Costos", section_style))

    subtotal_directo = presupuesto.get('subtotal_directo', 0)
    mano_obra = presupuesto.get('mano_obra', 0)
    gastos_generales = presupuesto.get('gastos_generales', 0)
    imprevistos = presupuesto.get('imprevistos', 0)
    utilidad = presupuesto.get('utilidad', 0)
    total = presupuesto.get('total_estimado', 0)
    total_iva = presupuesto.get('total_con_iva', int(total * 1.19))

    summary_data = [
        ["Subtotal Directo (Materiales)", format_clp(int(subtotal_directo))],
        ["Mano de Obra (18%)", format_clp(int(mano_obra))],
        ["Gastos Generales (8%)", format_clp(int(gastos_generales))],
        ["Imprevistos (5%)", format_clp(int(imprevistos))],
        ["Utilidad (10%)", format_clp(int(utilidad))],
        ["TOTAL NETO", format_clp(int(total))],
        ["IVA (19%)", format_clp(int(total * 0.19))],
        ["TOTAL CON IVA", format_clp(int(total_iva))],
    ]

    summary_table = Table(summary_data, colWidths=[4*inch, 2*inch])
    summary_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),

        # Total neto destacado
        ('FONTNAME', (0, 5), (-1, 5), 'Helvetica-Bold'),
        ('LINEABOVE', (0, 5), (-1, 5), 1, colors.HexColor('#333333')),

        # Total con IVA mas destacado
        ('FONTNAME', (0, 7), (-1, 7), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 7), (-1, 7), 12),
        ('BACKGROUND', (0, 7), (-1, 7), colors.HexColor('#00F3FF')),
        ('TEXTCOLOR', (0, 7), (-1, 7), colors.HexColor('#1a1a2e')),
        ('TOPPADDING', (0, 7), (-1, 7), 8),
        ('BOTTOMPADDING', (0, 7), (-1, 7), 8),
    ]))

    elements.append(summary_table)
    elements.append(Spacer(1, 0.5*inch))

    # Notas y condiciones
    elements.append(Paragraph("Notas y Condiciones", section_style))

    notes = [
        "• Precios basados en catalogo APU profesional",
        "• Valores en Pesos Chilenos (CLP) - Precios de mercado 2024/2025",
        "• Presupuesto valido por 30 dias desde la fecha de emision",
        "• No incluye permisos municipales ni derechos de construccion",
        "• Sujeto a visita tecnica para confirmacion de cantidades",
    ]

    for note in notes:
        elements.append(Paragraph(note, normal_style))

    elements.append(Spacer(1, 0.3*inch))

    # Footer
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=8,
        textColor=colors.HexColor('#999999'),
        alignment=TA_CENTER
    )

    elements.append(Paragraph("_" * 80, footer_style))
    elements.append(Spacer(1, 0.1*inch))
    elements.append(Paragraph(
        "Generado por ARKITECTO AI PRO - Sistema de Presupuestos Inteligente",
        footer_style
    ))
    elements.append(Paragraph(
        f"www.arkitecto.ai | {fecha}",
        footer_style
    ))

    # Build PDF
    doc.build(elements)
    buffer.seek(0)

    return buffer


def generate_simple_budget_text(presupuesto: dict, metadata: dict = None) -> str:
    """
    Genera un resumen de texto del presupuesto para compartir.
    """
    lines = []
    lines.append("=" * 50)
    lines.append("ARKITECTO AI - PRESUPUESTO")
    lines.append("=" * 50)
    lines.append(f"Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    lines.append("")

    if metadata and metadata.get('categoria'):
        lines.append(f"Categoria: {metadata.get('categoria')}")
        lines.append("")

    lines.append("DETALLE DE PARTIDAS:")
    lines.append("-" * 50)

    items = presupuesto.get('items', [])
    for i, item in enumerate(items, 1):
        elemento = item.get('elemento', '')[:40]
        cantidad = item.get('cantidad', 0)
        unidad = item.get('unidad', 'gl')
        subtotal = format_clp(int(item.get('subtotal', 0)))
        lines.append(f"{i}. {elemento}")
        lines.append(f"   {cantidad:.2f} {unidad} = {subtotal}")

    lines.append("-" * 50)
    lines.append("")
    lines.append("RESUMEN:")

    total = presupuesto.get('total_estimado', 0)
    total_iva = presupuesto.get('total_con_iva', int(total * 1.19))

    lines.append(f"Total Neto: {format_clp(int(total))}")
    lines.append(f"IVA (19%): {format_clp(int(total * 0.19))}")
    lines.append(f"TOTAL: {format_clp(int(total_iva))}")
    lines.append("")
    lines.append("=" * 50)
    lines.append("Generado por ARKITECTO AI PRO")

    return "\n".join(lines)
