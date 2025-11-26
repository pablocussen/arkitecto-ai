export interface BudgetItem {
  elemento: string;
  descripcion: string;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  subtotal: number;
  apu_origen: string;
}

export interface AnalysisResponse {
  success: boolean;
  analisis: string;
  presupuesto: {
    items: BudgetItem[];
    total_estimado: number;
    moneda: string;
    subtotal_directo?: number;
    mano_obra?: number;
    gastos_generales?: number;
    imprevistos?: number;
    utilidad?: number;
    total_con_iva?: number;
  };
  metadata: {
    elementos_detectados: number;
    items_con_precio: number;
    generator: string;
    categoria?: string;
    version?: string;
    transparencia?: string;
  };
}

export interface ProjectMetadata {
  title: string;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  status: "draft" | "budgeted" | "approved" | "in_progress" | "completed";
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  metadata: ProjectMetadata;
  budget: {
    items: BudgetItem[];
    total_materials: number;
    total_labor: number;
    total_contingency: number;
    total_final: number;
    currency: "CLP" | "USD" | "EUR";
  };
  collaborators: {
    [userId: string]: {
      role: "owner" | "editor" | "viewer";
      invited_at: string;
    };
  };
}
