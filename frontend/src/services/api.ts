import axios from 'axios';
import { AnalysisResponse, Project, ProjectMetadata } from '../types';
import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:8000';

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
  imageFile: File,
  prompt: string
): Promise<{ success: boolean; generated_image?: string; error?: string }> => {
  const formData = new FormData();
  formData.append('image', imageFile);
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
