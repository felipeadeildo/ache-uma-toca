import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { useAuth } from '~/contexts/auth-context'

export default function ProtectedLayout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      // Evitar redirecionamento infinito - não redirecionar se já estiver em páginas de auth
      if (location.pathname !== '/login' && location.pathname !== '/signup') {
        navigate('/login')
      }
    }
  }, [user, loading, navigate, location.pathname])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <RippleWaveLoader />
          <p className="mt-2 text-sm text-gray-600">Autenticando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <Outlet />
}
