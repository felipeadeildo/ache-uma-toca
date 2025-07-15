import { AlertCircle, ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PostDetail } from '~/components/post-detail'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import RippleWaveLoader from '~/components/ui/ripple-loader'
import { usePost } from '~/hooks/use-posts'
import { supabase } from '~/lib/supabase'
import type { Route } from './+types/post'

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { data } = await supabase
    .from('posts')
    .select('title')
    .eq('id', params.id)
    .single()

  return { postTitle: data?.title }
}

export function meta({ data, params }: Route.MetaArgs) {
  const title = data?.postTitle || `Post ${params.id}`
  return [
    { title: `${title} - Ache uma Toca` },
    { name: 'description', content: 'Detalhes do anúncio no Ache uma Toca' },
  ]
}

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { post, loading, error, fetchPost, clearPost } = usePost()

  useEffect(() => {
    if (id) {
      fetchPost(id)
    }
    return () => clearPost()
  }, [id, fetchPost, clearPost])

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
