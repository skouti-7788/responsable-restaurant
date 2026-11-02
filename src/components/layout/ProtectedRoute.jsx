import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import hasPermission from '../../utils/permissions'
import { usePlanAccess } from './PlanAccessContext'
import translations from '../../i18n/translations'

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
        <div className="mx-auto flex min-h-[45vh] max-w-2xl flex-col items-center justify-center rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            <span className="text-2xl" aria-hidden="true">🔒</span>
          </div>
          <h1 className="text-xl font-semibold">
            {t.upgradeLimitTitle || 'You have reached your plan limit'}
          </h1>
          <p className="mt-2 max-w-lg text-sm opacity-85">
            {t.upgradeLimitDescription || 'Upgrade your plan to unlock this feature.'}
          </p>
          <a
            href="/pricing"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {t.upgradePlan || 'Upgrade plan'}
          </a>
        </div>
      )
    }
  }

  
  return children
}

export default ProtectedRoute
