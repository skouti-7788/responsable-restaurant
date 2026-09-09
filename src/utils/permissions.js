export const hasPermission = (user, permission) => {
  if (!user) return false
  if (user.role === 'owner') return true
  const perms = user.permissions || []
  return perms.includes(permission)
}

export default hasPermission
