import { Clock, Edit, Eye, Plus, Trash2, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/contexts/auth-context'
import { formatRelativeTime } from '~/lib'
import { supabase } from '~/lib/supabase'
import {
  POST_TYPE_COLORS,
  POST_TYPE_LABELS,
  type PostWithAuthor,
} from '~/types/post'
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
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
  })

  useEffect(() => {
    if (user) {
      fetchUserPosts()
    }
  }, [user])

  const fetchUserPosts = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          profiles!posts_user_id_fkey (
            name,
            email,
            avatar_url
          )
        `
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user posts:', error)
      } else {
        const postsData = data as PostWithAuthor[]
        setPosts(postsData)

        const now = new Date()
        const activeCount = postsData.filter(
          (post) => post.expires_at && new Date(post.expires_at) > now
        ).length

        setStats({
          total: postsData.length,
          active: activeCount,
          expired: postsData.length - activeCount,
        })
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      try {
        const { error } = await supabase.from('posts').delete().eq('id', postId)

        if (!error) {
          fetchUserPosts()
        }
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header with Profile */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {profile?.name || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600">
          Gerencie seus anúncios e acompanhe o desempenho da sua conta.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">
                Total de Posts
              </p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Posts Ativos</p>
              <p className="text-2xl font-bold text-green-900">
                {stats.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Expirados</p>
              <p className="text-2xl font-bold text-orange-900">
                {stats.expired}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button asChild className="bg-orange-600 hover:bg-orange-700">
          <Link to="/dashboard/create-post">
            <Plus className="w-4 h-4 mr-2" />
            Criar Novo Post
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/">
            <Eye className="w-4 h-4 mr-2" />
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
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando posts...</p>
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
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link to="/dashboard/create-post">
                <Plus className="w-4 h-4 mr-2" />
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

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/post/${post.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/dashboard/posts/${post.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
