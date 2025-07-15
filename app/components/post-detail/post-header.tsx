import { Clock, Edit3, MapPin, User, Verified } from 'lucide-react'
import { useNavigate } from 'react-router'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { formatPrice, formatRelativeTime } from '~/lib'
import {
  type PostWithAuthorAndImages,
  POST_TYPE_COLORS,
  POST_TYPE_LABELS,
} from '~/types/post'

interface PostHeaderProps {
  post: PostWithAuthorAndImages
  currentUserId?: string
}

export function PostHeader({ post, currentUserId }: PostHeaderProps) {
  const navigate = useNavigate()
  const isOwner = currentUserId === post.user_id

  return (
    <div className="space-y-4">
      {/* Badges and Edit Button */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            className={`${POST_TYPE_COLORS[post.post_type]} text-sm px-4 py-1`}
          >
            {POST_TYPE_LABELS[post.post_type]}
          </Badge>
          {post.expires_at && new Date(post.expires_at) > new Date() && (
            <Badge
              variant="outline"
              className="text-green-600 border-green-500 bg-green-50"
            >
              <Verified className="w-3 h-3 mr-1" />
              Ativo
            </Badge>
          )}
        </div>

        {/* Edit Button for Owner */}
        {isOwner && (
          <Button
            onClick={() => navigate(`/dashboard/posts/${post.id}/edit`)}
            variant="outline"
            className="border-orange-200 text-orange-600 hover:bg-orange-50"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Editar
          </Button>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
        {post.title}
      </h1>

      <span className="text-3xl font-bold text-orange-600">
        {formatPrice(post.price)}
      </span>

      {/* Meta Info */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-600">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{post.profiles.name}</p>
            <p className="text-sm text-gray-500">Anunciante</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-gray-900">{post.location}</span>
        </div>

        {/* Created At */}
        {post.created_at && (
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            <span>{formatRelativeTime(post.created_at)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
