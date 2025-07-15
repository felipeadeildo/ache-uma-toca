import { Home as HomeIcon, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { EmptyState } from '~/components/empty-state'
import { PostCard } from '~/components/post-card'
import { PostFilter } from '~/components/post-filter'
import { Button } from '~/components/ui/button'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useAuth } from '~/contexts/auth-context'
import { useHomePosts } from '~/hooks/use-posts'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Ache uma Toca' },
    { name: 'description', content: 'Ache uma Toca - Insper (não-oficial)' },
  ]
}

export default function Home() {
  const { user } = useAuth()
  const { posts, loading, error, filters, setFilters, fetchPosts } = useHomePosts()
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [filters, fetchPosts])

  const handleCreatePost = () => {
    if (!user) {
      navigate('/login')
    } else {
      navigate('/dashboard/create-post')
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Anúncios recentes
          </h2>
          <Button
            onClick={handleCreatePost}
            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Publicar anúncio
          </Button>
        </div>

        <PostFilter
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={posts.length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <RippleWaveLoader />
              <p className="mt-4 text-gray-600">Carregando anúncios...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="Nenhum anúncio encontrado"
            description="Não há anúncios que correspondam aos seus critérios de busca. Tente ajustar os filtros ou seja o primeiro a publicar!"
            icon="search"
            action={{
              label: 'Publicar anúncio',
              onClick: handleCreatePost,
            }}
          />
        ) : (
          <ScrollArea className="h-[400px] sm:h-[600px] lg:h-[800px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
