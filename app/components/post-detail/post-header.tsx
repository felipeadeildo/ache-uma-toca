import { Clock, DollarSign, MapPin, User, Verified } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { formatPrice, formatRelativeTime } from '~/lib'
import {
  type PostWithAuthorAndImages,
  POST_TYPE_COLORS,
  POST_TYPE_LABELS,
} from '~/types/post'

interface PostHeaderProps {
  post: PostWithAuthorAndImages
}

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Badges */}
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

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
        {post.title}
      </h1>

      {/* Price */}
      <div className="flex items-center gap-2 text-orange-600">
        <DollarSign className="w-6 h-6" />
        <span className="text-3xl font-bold">{formatPrice(post.price)}</span>
      </div>

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
