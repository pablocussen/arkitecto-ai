import axios from 'axios'
import { AnalysisResponse } from '../types'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const analyzeBudget = async (
  imageFile: File,
  instruction: string
): Promise<AnalysisResponse> => {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('instruction', instruction)

  const response = await api.post<AnalysisResponse>('/analyze_budget', formData)
  return response.data
}

export const searchAPUs = async (query: string) => {
  const response = await api.get('/search_apus', {
    params: { q: query, limit: 10 }
  })
  return response.data
}

export const checkHealth = async () => {
  const response = await api.get('/health')
  return response.data
}

export const generateSketch = async (
  imageFile: File,
  prompt: string
): Promise<{ success: boolean; generated_image?: string; error?: string }> => {
  const formData = new FormData()
  formData.append('image', imageFile)
  formData.append('prompt', prompt)

  const response = await api.post('/generate_sketch', formData)
  return response.data
}
