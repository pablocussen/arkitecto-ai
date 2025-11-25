export interface BudgetItem {
  elemento: string
  descripcion: string
  cantidad: number
  unidad: string
  precio_unitario: number
  subtotal: number
  apu_origen: string
}

export interface AnalysisResponse {
  success: boolean
  analisis: string
  presupuesto: {
    items: BudgetItem[]
    total_estimado: number
    moneda: string
  }
  metadata: {
    elementos_detectados: number
    items_con_precio: number
  }
}
