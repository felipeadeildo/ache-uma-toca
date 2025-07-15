import { LayoutDashboard, LogIn, LogOut, User, UserPlus } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { Button } from '~/components/ui/button'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { useAuth } from '~/contexts/auth-context'

export default function MainLayout() {
  const { user, profile, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:text-orange-600"
              >
                🦊 Ache uma Toca
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="scale-50">
                  <RippleWaveLoader />
                </div>
              ) : user ? (
                <>
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Olá, {profile?.name || user?.email}
                  </span>
                  <Button variant="outline" asChild className="text-sm">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSignOut}
                    className="text-sm flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild className="text-sm">
                    <Link to="/login" className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="text-sm bg-orange-600 hover:bg-orange-700"
                  >
                    <Link to="/signup" className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Cadastrar
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
