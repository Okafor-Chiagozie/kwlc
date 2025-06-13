import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://kwlc-e6dhgtd9bvg6bkea.canadacentral-01.azurewebsites.net/',
  withCredentials: true,
})

api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error?.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api
