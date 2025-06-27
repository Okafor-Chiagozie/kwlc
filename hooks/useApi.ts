// hooks/useApi.ts
import { useEffect, useState, useCallback } from 'react'

export const useApi = <T>(
  callback: () => Promise<T>, 
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setStatus(null)
    
    try {
      const result = await callback()
      setData(result)
      setStatus(200)
    } catch (err: any) {
      // Extract error message from different possible sources
      let errorMessage = 'An unexpected error occurred'
      
      if (err?.response?.data?.responseMessage) {
        errorMessage = err.response.data.responseMessage
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err?.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
        errorMessage = err.response.data.errors.map((e: any) => e.description || e.message).join(', ')
      } else if (err?.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      setStatus(err?.response?.status || 500)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [callback])

  useEffect(() => {
    fetchData()
  }, deps)

  return { 
    data, 
    loading, 
    error, 
    status, 
    refetch: fetchData 
  }
}