import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axiosClient from '../../api/axiosClient'
import { PlanAccessContext } from './planAccess'

const PlanAccessProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user)
  const identity = user?.role === 'owner'
    ? `owner:${user?.restaurant_id ?? 'default'}`
    : 'not-owner'

  const [result, setResult] = useState({
    identity: null,
    features: null,
    error: null,
  })

  useEffect(() => {
    if (user?.role !== 'owner') return undefined

    let active = true

    axiosClient.get('/subscription/')
      .then(({ data }) => {
        if (!active) return
        setResult({
          identity,
          features: data?.plan?.features || {},
          error: null,
        })
      })
      .catch((requestError) => {
        if (!active) return
        console.error('Load subscription features error:', requestError)
        setResult({
          identity,
          features: null,
          error: requestError,
        })
      })

    return () => {
      active = false
    }
  }, [identity, user?.role])

  const isCurrent = result.identity === identity
  const value = {
    features: user?.role === 'owner' && isCurrent ? result.features : null,
    loading: user?.role === 'owner' && !isCurrent,
    error: isCurrent ? result.error : null,
  }

  return (
    <PlanAccessContext.Provider value={value}>
      {children}
    </PlanAccessContext.Provider>
  )
}

export default PlanAccessProvider
