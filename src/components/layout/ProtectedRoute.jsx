import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import hasPermission from '../../utils/permissions'
import { usePlanAccess } from './planAccess'
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

    if (!features) {
      return (
        <div role="alert" className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-100">
          <p className="text-sm">
            {t.planStatusUnavailable || 'We could not verify your subscription. Please try again.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {t.retry || 'Retry'}
          </button>
        </div>
      )
    }

    const featureValue = features?.[requiredFeature]
    // Appearance has a Starter/basic mode; keep its route accessible for both
    // valid tiers. Unknown feature values fail closed for protected features.
    const featureLocked = requiredFeature === 'appearance'
      ? !['basic', 'advanced'].includes(featureValue)
      : featureValue !== true

    if (featureLocked) {
      return (
        <div className="mx-auto max-w-2xl py-8">
          <PlanUpgradeNotice t={t} titleKey="upgradeFeatureTitle" descriptionKey="upgradeFeatureDescription" />
        </div>
      )
    }
  }

  
  return children
}

export default ProtectedRoute
