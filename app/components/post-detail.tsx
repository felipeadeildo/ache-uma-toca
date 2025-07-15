import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { useAuth } from '~/contexts/auth-context'
import type { PostWithAuthorAndImages } from '~/types/post'
import { PostContactCard } from './post-detail/post-contact-card'
import { PostDescription } from './post-detail/post-description'
import { PostHeader } from './post-detail/post-header'
import { PostImageGallery } from './post-detail/post-image-gallery'
import { PostSummary } from './post-detail/post-summary'

interface PostDetailProps {
  post: PostWithAuthorAndImages
}

export function PostDetail({ post }: PostDetailProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para início
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <PostImageGallery images={post.post_images} title={post.title} />

            {/* Post Header */}
            <PostHeader post={post} currentUserId={user?.id} />

            {/* Description and Details */}
            <PostDescription post={post} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <PostContactCard post={post} />

            {/* Summary */}
            <PostSummary post={post} />
          </div>
        </div>
      </div>
    </div>
  )
}
