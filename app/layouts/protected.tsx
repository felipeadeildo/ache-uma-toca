import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <Outlet />
}
