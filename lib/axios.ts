// lib/axios.ts
import axios from 'axios'

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://kwlc-e6dhgtd9bvg6bkea.canadacentral-01.azurewebsites.net',
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  // withCredentials: true,
  timeout: 30000, // 30 seconds timeout
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    try {
      const token = localStorage.getItem('kwlc_admin_token')
      if (token) {
        config.headers = config.headers || {}
        ;(config.headers as any).Authorization = `Bearer ${token}`
      }
    } catch {}
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      fullError: error
    })
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Could redirect to login or refresh token
    }
    
    // Log validation errors specifically
    if (error.response?.status === 400 && error.response?.data?.errors) {
      console.error('Validation Errors:', error.response.data.errors)
    }
    
    return Promise.reject(error)
  }
)

export default api