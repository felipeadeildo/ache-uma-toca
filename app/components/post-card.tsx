import {
  Calendar,
  DollarSign,
  Eye,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  formatDate,
  formatPrice,
  formatRelativeTime,
  openEmail,
  openTelegram,
  openWhatsApp,
  truncateText,
} from '~/lib'
import {
  type PostWithAuthor,
  POST_TYPE_COLORS,
  POST_TYPE_LABELS,
} from '~/types/post'

interface PostCardProps {
  post: PostWithAuthor
}

export function PostCard({ post }: PostCardProps) {
  const handleContact = (type: 'whatsapp' | 'email' | 'telegram') => {
    switch (type) {
      case 'whatsapp':
        openWhatsApp(post.contact_whatsapp)
        break
      case 'email':
        openEmail(post.contact_email)
        break
      case 'telegram':
        openTelegram(post.contact_telegram)
        break
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  POST_TYPE_COLORS[post.post_type]
                }`}
              >
                {POST_TYPE_LABELS[post.post_type]}
              </span>
            </div>
            <CardTitle className="text-lg">
              {truncateText(post.title, 80)}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <User className="w-3 h-3" />
              {post.profiles.name}
              {post.created_at && (
                <>
                  <span>•</span>
                  <span>{formatRelativeTime(post.created_at)}</span>
                </>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 line-clamp-3">
          {truncateText(post.description, 150)}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {post.location}
          </div>

          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {formatPrice(post.price)}
          </div>

          {post.available_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.available_date)}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {post.contact_whatsapp && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('whatsapp')}
                className="text-green-600 hover:text-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                WhatsApp
              </Button>
            )}

            {post.contact_email && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('email')}
                className="text-blue-600 hover:text-blue-700"
              >
                <Mail className="w-4 h-4 mr-1" />
                Email
              </Button>
            )}

            {post.contact_telegram && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('telegram')}
                className="text-blue-500 hover:text-blue-600"
              >
                <Phone className="w-4 h-4 mr-1" />
                Telegram
              </Button>
            )}
          </div>

          <Button variant="outline" size="sm" asChild>
            <Link to={`/post/${post.id}`}>
              <Eye className="w-4 h-4 mr-1" />
              Ver detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
