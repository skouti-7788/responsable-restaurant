import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import hasPermission from '../../utils/permissions'
import { usePlanAccess } from './PlanAccessContext'
import translations from '../../i18n/translations'
import PlanUpgradeNotice from './PlanUpgradeNotice'

const ProtectedRoute = ({ children, allowedRoles = null, requiredPermission = null, requiredFeature = null }) => {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const { features, loading } = usePlanAccess()
  const language = useSelector((state) => state.ui.language)
  const t = translations[language] || translations.en
  // const location = useLocation()

  if (!token) {
    return <Navigate to="/home" replace />
  }

  if (allowedRoles && Array.isArray(allowedRoles)) {
    const role = user?.role
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/orders" replace />
    }
  }

  if (requiredPermission) {
    if (!hasPermission(user, requiredPermission)) {
      return <Navigate to="/orders" replace />
    }
  }
  
  if (requiredFeature && user?.role === 'owner') {
    if (loading) {
      return (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand" />
        </div>
      )
    }

    if (features?.[requiredFeature] === false) {
      return (
        <div className="mx-auto max-w-2xl py-8">
          <PlanUpgradeNotice t={t} />
        </div>
      )
    }
  }

  
  return children
}

export default ProtectedRoute
