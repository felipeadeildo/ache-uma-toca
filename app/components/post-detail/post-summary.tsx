import { Clock, Star } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { formatDate, formatDateTime, formatPrice } from '~/lib'
import {
  type PostWithAuthorAndImages,
  POST_TYPE_COLORS,
  POST_TYPE_LABELS,
} from '~/types/post'

interface PostSummaryProps {
  post: PostWithAuthorAndImages
}

export function PostSummary({ post }: PostSummaryProps) {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-orange-500" />
          Resumo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">Valor:</span>
          <span className="text-2xl font-bold text-orange-600">
            {formatPrice(post.price)}
          </span>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">Local:</span>
          <span className="font-semibold text-gray-900">{post.location}</span>
        </div>

        {post.available_date && (
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600 font-medium">Disponível:</span>
            <span className="font-semibold text-gray-900">
              {formatDate(post.available_date)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium">Categoria:</span>
          <Badge className={POST_TYPE_COLORS[post.post_type]}>
            {POST_TYPE_LABELS[post.post_type]}
          </Badge>
        </div>

        <div className="flex justify-between items-center py-3">
          <span className="text-gray-600 font-medium">Publicado:</span>
          <div className="text-right">
            <div className="font-semibold text-gray-900 text-sm">
              {formatDateTime(post.created_at)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
