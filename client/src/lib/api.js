import axios from 'axios'

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5179/api'

export const api = axios.create({ baseURL: apiBase, timeout: 15000 })

export async function runSimulation(params) {
  const { data } = await api.post('/simulate', params)
  return data
}

export async function listScenarios() {
  const { data } = await api.get('/scenarios')
  return data
}

export async function createScenario(payload) {
  const { data } = await api.post('/scenarios', payload)
  return data
}

export async function shareScenario(id) {
  const { data } = await api.post(`/scenarios/${id}/share`)
  return data
}

export async function getPublicScenario(slug) {
  const { data } = await api.get(`/public/${slug}`)
  return data
}

