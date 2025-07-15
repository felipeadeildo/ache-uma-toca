import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PostDetail } from '~/components/post-detail'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { supabase } from '~/lib/supabase'
import { type PostWithAuthorAndImages } from '~/types/post'
import type { Route } from './+types/post'

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Post ${params.id} - Ache uma Toca` },
    { name: 'description', content: 'Detalhes do anúncio no Ache uma Toca' },
  ]
}

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<PostWithAuthorAndImages | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data, error } = await supabase
          .from('posts')
          .select(
            `
            *,
            profiles!posts_user_id_fkey (
              name,
              email,
              avatar_url
            ),
            post_images (
              id,
              image_url,
              display_order
            )
          `
          )
          .eq('id', id)
          .single()

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Post não encontrado')
          } else {
            setError('Erro ao carregar o post')
          }
          return
        }

        // Verificar se o post não expirou
        if (data.expires_at && new Date(data.expires_at) <= new Date()) {
          setError('Este post expirou')
          return
        }

        setPost(data as PostWithAuthorAndImages)
      } catch (err) {
        setError('Erro inesperado ao carregar o post')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <RippleWaveLoader />
          <p className="mt-4 text-gray-600">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para início
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-lg">{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Post não encontrado</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para início
        </Button>
      </div>

      <PostDetail post={post} />
    </div>
  )
}
