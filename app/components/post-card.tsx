import {
  Calendar,
  Eye,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from 'lucide-react'
import { useState } from 'react'
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
  type PostWithAuthorAndImages,
  POST_TYPE_COLORS,
  POST_TYPE_LABELS,
} from '~/types/post'

interface PostCardProps {
  post: PostWithAuthorAndImages
}

export function PostCard({ post }: PostCardProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const sortedImages = post.post_images.sort(
    (a, b) => a.display_order - b.display_order
  )

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

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % sortedImages.length)
  }

  const openImageFullscreen = (imageUrl: string) => {
    window.open(imageUrl, '_blank')
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-200 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2 leading-tight">
          {post.title}
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <User className="w-3 h-3" />
          {post.profiles.name}
          {post.created_at && (
            <>
              <span>•</span>
              <span>{formatRelativeTime(post.created_at)}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>

      {/* Image Gallery */}
      {sortedImages.length > 0 && (
        <div className="px-6 pb-4">
          <div
            className="relative h-48 w-full overflow-hidden rounded-xl bg-gray-100 cursor-pointer group"
            onClick={
              sortedImages.length > 1
                ? nextImage
                : () => openImageFullscreen(sortedImages[0].image_url)
            }
          >
            <img
              src={sortedImages[activeImageIndex].image_url}
              alt={`${post.title} - Imagem ${activeImageIndex + 1}`}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
              loading="lazy"
              draggable={false}
            />

            {/* Post type badge - minimalist overlay */}
            <div className="absolute top-2 left-2">
              <span
                className={`px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm border border-white/20 ${
                  POST_TYPE_COLORS[post.post_type]
                } shadow-sm`}
              >
                {POST_TYPE_LABELS[post.post_type]}
              </span>
            </div>

            {/* Simple image indicator */}
            {sortedImages.length > 1 && (
              <>
                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {sortedImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                        activeImageIndex === index ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Image counter */}
                <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-0.5 text-xs rounded-full">
                  {activeImageIndex + 1}/{sortedImages.length}
                </div>

                {/* Click hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">
                    Clique para próxima
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
        <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
          {truncateText(post.description, 120)}
        </p>

        {/* Key info */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate text-gray-700">{post.location}</span>
          </div>

          <div className="text-xl font-bold text-orange-600">
            {formatPrice(post.price)}
          </div>

          {post.available_date && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Disponível: {formatDate(post.available_date)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          {/* Contact buttons */}
          <div className="flex gap-2 flex-wrap">
            {post.contact_whatsapp && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('whatsapp')}
                className="text-green-600 hover:text-green-700 hover:bg-green-50 flex-1 min-w-0"
              >
                <MessageCircle className="w-3 h-3 mr-1.5" />
                WhatsApp
              </Button>
            )}

            {post.contact_email && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('email')}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-1 min-w-0"
              >
                <Mail className="w-3 h-3 mr-1.5" />
                Email
              </Button>
            )}

            {post.contact_telegram && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleContact('telegram')}
                className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 flex-1 min-w-0"
              >
                <Phone className="w-3 h-3 mr-1.5" />
                Telegram
              </Button>
            )}
          </div>

          {/* View details button */}
          <Button
            variant="default"
            size="sm"
            asChild
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            <Link to={`/post/${post.id}`}>
              <Eye className="w-3 h-3 mr-1.5" />
              Ver detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
