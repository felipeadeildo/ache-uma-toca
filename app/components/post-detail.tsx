import {
  Calendar,
  Clock,
  DollarSign,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  User,
  Users,
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
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
  formatDateTime,
  formatPrice,
  formatRelativeTime,
  openEmail,
  openTelegram,
  openWhatsApp,
} from '~/lib'
import {
  type PostWithAuthorAndImages,
  GENDER_PREFERENCE_LABELS,
  POST_TYPE_COLORS,
  POST_TYPE_LABELS,
} from '~/types/post'

interface PostDetailProps {
  post: PostWithAuthorAndImages
}

export function PostDetail({ post }: PostDetailProps) {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Badge className={POST_TYPE_COLORS[post.post_type]}>
                  {POST_TYPE_LABELS[post.post_type]}
                </Badge>
                {post.expires_at && new Date(post.expires_at) > new Date() && (
                  <Badge variant="outline" className="text-orange-600">
                    Ativo
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-base">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.profiles.name}
                </div>
                {post.created_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatRelativeTime(post.created_at)}
                  </div>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Images */}
      {post.post_images.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {post.post_images
                .sort((a, b) => a.display_order - b.display_order)
                .map((image) => (
                  <div
                    key={image.id}
                    className="aspect-video rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.image_url}
                      alt={`Imagem do anúncio ${image.display_order}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(image.image_url, '_blank')}
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {post.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {post.extra_info && (
            <Card>
              <CardHeader>
                <CardTitle>Informações adicionais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {post.extra_info}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Localização</p>
                  <p className="text-sm text-gray-600">{post.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Preço</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(post.price)}
                  </p>
                </div>
              </div>

              {post.available_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Disponível a partir de</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(post.available_date)}
                    </p>
                  </div>
                </div>
              )}

              {post.gender_preference &&
                post.gender_preference !== 'qualquer' && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Preferência de gênero</p>
                      <p className="text-sm text-gray-600">
                        {GENDER_PREFERENCE_LABELS[post.gender_preference]}
                      </p>
                    </div>
                  </div>
                )}

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Publicado em</p>
                  <p className="text-sm text-gray-600">
                    {formatDateTime(post.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {post.contact_whatsapp && (
                <Button
                  onClick={() => handleContact('whatsapp')}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Entrar em contato pelo WhatsApp
                </Button>
              )}

              {post.contact_email && (
                <Button
                  onClick={() => handleContact('email')}
                  variant="outline"
                  className="w-full text-blue-600 hover:text-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar email
                </Button>
              )}

              {post.contact_telegram && (
                <Button
                  onClick={() => handleContact('telegram')}
                  variant="outline"
                  className="w-full text-blue-500 hover:text-blue-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contatar no Telegram
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
