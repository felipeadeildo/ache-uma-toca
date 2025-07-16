import { Clock, Edit, Eye, Plus, Trash2, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { useAuth } from '~/contexts/auth-context'
import { useUserPosts } from '~/hooks/use-posts'
import { formatRelativeTime } from '~/lib'
import { POST_TYPE_COLORS, POST_TYPE_LABELS } from '~/types/post'
import type { Route } from './+types/dashboard'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard - Ache uma Toca' },
    {
      name: 'description',
      content: 'Painel principal da plataforma Ache uma Toca',
    },
  ]
}

export default function Dashboard() {
  const { profile, user } = useAuth()
  const { posts, loading, error, fetchUserPosts, deletePost, stats } =
    useUserPosts()

  useEffect(() => {
    if (user?.id) {
      console.log('Dashboard: Fetching user posts for user:', user.id)
      fetchUserPosts(user.id)
    } else {
      console.log('Dashboard: No user ID available')
    }
  }, [user?.id, fetchUserPosts])

  const handleDeletePost = async (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      const success = await deletePost(postId)
      if (!success) {
        alert('Erro ao excluir post. Tente novamente.')
      }
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header with Profile */}
      <div className="border-b border-gray-200 pb-4 sm:pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Olá, {profile?.name || 'Usuário'}! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Gerencie seus anúncios e acompanhe o desempenho da sua conta.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center">
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-blue-600">
                Total de Posts
              </p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center">
            <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-green-600">
                Posts Ativos
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-orange-600">
                Expirados
              </p>
              <p className="text-xl sm:text-2xl font-bold text-orange-900">
                {stats.expired}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          asChild
          className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
        >
          <Link to="/dashboard/create-post">
            <Plus className="w-4 h-4" />
            Criar Novo Anúncio
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link to="/">
            <Eye className="w-4 h-4" />
            Ver Todos os Anúncios
          </Link>
        </Button>
      </div>

      {/* Posts List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Meus Posts</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <RippleWaveLoader />
              <p className="mt-4 text-gray-600">Carregando seus posts...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum post ainda
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando seu primeiro anúncio para encontrar colegas de
              quarto.
            </p>
            <Button className="bg-orange-600 hover:bg-orange-700" asChild>
              <Link to="/dashboard/create-post">
                <Plus className="w-4 h-4" />
                Criar Primeiro Post
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
              const isExpired =
                post.expires_at && new Date(post.expires_at) <= new Date()

              return (
                <div
                  key={post.id}
                  className={`border rounded-lg p-6 ${
                    isExpired
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            POST_TYPE_COLORS[post.post_type]
                          }`}
                        >
                          {POST_TYPE_LABELS[post.post_type]}
                        </span>
                        {isExpired && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expirado
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                        {post.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Criado {formatRelativeTime(post.created_at)}
                        {post.expires_at && (
                          <>
                            {' • '}
                            Expira {formatRelativeTime(post.expires_at)}
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex-1 sm:flex-none"
                    >
                      <Link to={`/post/${post.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="flex-1 sm:flex-none"
                    >
                      <Link to={`/dashboard/posts/${post.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
