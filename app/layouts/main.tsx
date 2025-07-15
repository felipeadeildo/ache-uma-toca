import { LayoutDashboard, LogIn, LogOut, User, UserPlus } from 'lucide-react'
import { Link, Outlet } from 'react-router'
import { Button } from '~/components/ui/button'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { useAuth } from '~/contexts/auth-context'
import { ImagesProvider } from '~/contexts/images-context'
import { PostsProvider } from '~/contexts/posts-context'

export default function MainLayout() {
  const { user, profile, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <PostsProvider>
      <ImagesProvider>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14 sm:h-16">
                <div className="flex items-center">
                  <Link
                    to="/"
                    className="flex items-center gap-1 sm:gap-2 text-lg sm:text-2xl font-bold text-gray-900 hover:text-orange-600"
                  >
                    🦊 Ache uma Toca
                  </Link>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-4">
                  {loading ? (
                    <div className="scale-50">
                      <RippleWaveLoader />
                    </div>
                  ) : user ? (
                    <>
                      <span className="hidden md:flex text-xs sm:text-sm text-gray-600 items-center gap-1 sm:gap-2 mr-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        Olá,{' '}
                        {profile?.name?.split(' ')[0] ||
                          user?.email?.split('@')[0]}
                      </span>
                      <Button
                        variant="outline"
                        asChild
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9"
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-1 sm:gap-2"
                        >
                          <LayoutDashboard className="w-3 h-3 sm:w-4 sm:h-4" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9 flex items-center gap-1 sm:gap-2"
                      >
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Sair</span>
                      </Button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Button
                        variant="outline"
                        asChild
                        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9"
                      >
                        <Link
                          to="/login"
                          className="flex items-center gap-1 sm:gap-2"
                        >
                          <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Entrar</span>
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="text-xs sm:text-sm bg-orange-600 hover:bg-orange-700 px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9"
                      >
                        <Link
                          to="/signup"
                          className="flex items-center gap-1 sm:gap-2"
                        >
                          <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Cadastrar</span>
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto py-3 sm:py-4 sm:px-6 lg:px-8">
            <div className="px-4 py-2 sm:px-0 sm:py-0">
              <Outlet />
            </div>
          </main>
        </div>
      </ImagesProvider>
    </PostsProvider>
  )
}
