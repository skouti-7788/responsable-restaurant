export const isPlanUpgradeError = (error) => {
  const data = error?.response?.data || error?.data || error
  return (
    (data?.code === 'PLAN_LIMIT_REACHED' && data?.upgrade_required === true) ||
    data?.code === 'PLAN_FEATURE_LOCKED'
  )
}
