import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export default function RequireAuth() {
  const { isAuthenticated, initializing } = useAuth()
  const location = useLocation()

  if (initializing) return <div className="min-h-screen bg-ink" aria-busy="true" />

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />
  }

  return <Outlet />
}
