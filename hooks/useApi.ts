import { useEffect, useState } from 'react'

export const useApi = <T>(callback: () => Promise<T>, deps: any[] = []) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<number | null>(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const result = await callback()
      setData(result)
      setStatus(200)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
      setStatus(err?.response?.status || 500)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, deps)

  return { data, loading, error, status, refetch: fetch }
}
