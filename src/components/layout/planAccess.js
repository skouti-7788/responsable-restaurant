import { createContext, useContext } from 'react'

export const PlanAccessContext = createContext({
  features: null,
  loading: false,
  error: null,
})

export const usePlanAccess = () => useContext(PlanAccessContext)
