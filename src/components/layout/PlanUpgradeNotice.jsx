import { Link } from 'react-router-dom'

const PlanUpgradeNotice = ({ t, titleKey = 'upgradeLimitTitle', descriptionKey = 'upgradeLimitDescription' }) => (
  <div
    role="status"
    className="mb-5 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100 sm:flex-row sm:items-center sm:justify-between"
  >
    <div>
      <h2 className="font-semibold">
        {t?.[titleKey] || t?.upgradeLimitTitle || 'You have reached your plan limit'}
      </h2>
      <p className="mt-1 text-sm opacity-90">
        {t?.[descriptionKey] || t?.upgradeFeatureDescription || 'Upgrade your plan to unlock more features and capacity.'}
      </p>
    </div>
    <Link
      to="/pricing"
      className="inline-flex shrink-0 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
    >
      {t?.upgradePlan || 'Upgrade plan'}
    </Link>
  </div>
)

export default PlanUpgradeNotice
