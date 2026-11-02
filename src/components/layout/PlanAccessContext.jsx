import { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosClient from '../../api/axiosClient'

const PlanAccessContext = createContext({
  features: null,
  loading: false,
  error: null,
})

export const PlanAccessProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  const [features, setFeatures] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.role !== 'owner') {
      setFeatures(null)
      setLoading(false)
      setError(null)
      return undefined
    }

    let active = true
    setLoading(true)
    setError(null)

    axiosClient.get('/subscription/')
      .then(({ data }) => {
        if (!active) return
        setFeatures(data?.plan?.features || {})
      })
      .catch((requestError) => {
        if (!active) return
        console.error('Load subscription features error:', requestError)
        setFeatures(null)
        setError(requestError)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [user?.role, user?.restaurant_id])

  return (
    <PlanAccessContext.Provider value={{ features, loading, error }}>
      {children}
    </PlanAccessContext.Provider>
  )
}

export const usePlanAccess = () => useContext(PlanAccessContext)
