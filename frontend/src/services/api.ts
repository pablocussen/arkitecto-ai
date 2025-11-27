import axios from 'axios';
import { AnalysisResponse, Project, ProjectMetadata } from '../types';
import { auth } from './firebase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const publicApi = axios.create({
  baseURL: API_BASE_URL,
});

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const analyzeBudget = async (
  imageFile: File,
  instruction: string
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('instruction', instruction);

  const response = await publicApi.post<AnalysisResponse>('/analyze_budget', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const generateSketch = async (
  imageFile: File | null,
  prompt: string
): Promise<{ success: boolean; generated_image?: string; error?: string }> => {
  const formData = new FormData();
  if (imageFile) {
    formData.append('image', imageFile);
  }
  formData.append('prompt', prompt);

  const response = await publicApi.post('/generate_sketch', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
};

export const getProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>('/api/v1/projects');
  return response.data;
};

export const createProject = async (projectMetadata: Partial<ProjectMetadata>): Promise<Project> => {
  const response = await apiClient.post<Project>('/api/v1/projects', projectMetadata);
  return response.data;
};

export const updateProject = async (projectId: string, projectMetadata: Partial<ProjectMetadata>): Promise<Project> => {
  const response = await apiClient.put<Project>(`/api/v1/projects/${projectId}`, projectMetadata);
  return response.data;
};

export const deleteProject = async (projectId: string): Promise<void> => {
  await apiClient.delete(`/api/v1/projects/${projectId}`);
};

// =====================================================
// EXPORT FUNCTIONS - Phase 1 Optimization
// =====================================================

export interface ExportData {
  presupuesto: {
    items: Array<{
      elemento: string;
      descripcion: string;
      cantidad: number;
      unidad: string;
      precio_unitario: number;
      subtotal: number;
      apu_origen?: string;
    }>;
    total_estimado: number;
    subtotal_directo?: number;
    mano_obra?: number;
    gastos_generales?: number;
    imprevistos?: number;
    utilidad?: number;
    total_con_iva?: number;
  };
  metadata?: {
    categoria?: string;
  };
  client_info?: {
    nombre?: string;
    email?: string;
  };
}

export const exportToPDF = async (data: ExportData): Promise<Blob> => {
  const response = await publicApi.post('/export/pdf', data, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportToExcel = async (data: ExportData): Promise<Blob> => {
  const response = await publicApi.post('/export/excel', data, {
    responseType: 'blob',
  });
  return response.data;
};

export const exportToText = async (data: ExportData): Promise<{ success: boolean; text: string }> => {
  const response = await publicApi.post('/export/text', data);
  return response.data;
};
