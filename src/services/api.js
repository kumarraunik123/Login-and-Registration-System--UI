import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:54613/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser    = (data) => api.post('/auth/login',    data)

// ── User endpoints ────────────────────────────────────────────────────────────
export const getUserProfile = () => api.get('/user/profile')

export default api
