import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import hasPermission from '../../utils/permissions'

const ProtectedRoute = ({ children, allowedRoles = null, requiredPermission = null }) => {
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)

  if (!token) {
    return <Navigate to="/home" replace />
  }

  if (allowedRoles && Array.isArray(allowedRoles)) {
    const role = user?.role
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />
    }
  }

  if (requiredPermission) {
    if (!hasPermission(user, requiredPermission)) {
      return <Navigate to="/orders" replace />
    }
  }
  
  
  return children
}

export default ProtectedRoute
