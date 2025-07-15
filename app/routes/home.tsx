import { Home as HomeIcon, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState } from '~/components/empty-state'
import { PostCard } from '~/components/post-card'
import { PostFilter } from '~/components/post-filter'
import { Button } from '~/components/ui/button'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useAuth } from '~/contexts/auth-context'
import { supabase } from '~/lib/supabase'
import { type PostFilters, type PostWithAuthor } from '~/types/post'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Ache uma Toca' },
    { name: 'description', content: 'Ache uma Toca - Insper (não-oficial)' },
  ]
}

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<PostFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [filters])

  const fetchPosts = async () => {
    try {
      setLoading(true)

      let query = supabase
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
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.postType && filters.postType !== 'all') {
        query = query.eq('post_type', filters.postType)
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      if (filters.priceMin) {
        query = query.gte('price', filters.priceMin)
      }

      if (filters.priceMax) {
        query = query.lte('price', filters.priceMax)
      }

      if (filters.genderPreference) {
        query = query.eq('gender_preference', filters.genderPreference)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data as PostWithAuthor[])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/login'
    } else {
      // TODO: Redirect to create post page
      console.log('Create post')
    }
  }

  return (
    <div className="space-y-6">
      {/* Posts Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Anúncios recentes
          </h2>
          <Button
            onClick={handleCreatePost}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            Publicar anúncio
          </Button>
        </div>

        {/* Filters */}
        <PostFilter
          filters={filters}
          onFiltersChange={setFilters}
          totalResults={posts.length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Posts List */}
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
          <ScrollArea className="h-[800px]">
            <div className="grid gap-4 pb-4">
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
