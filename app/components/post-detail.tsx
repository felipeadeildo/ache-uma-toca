import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  Expand,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  User,
  Users,
  Verified,
  X,
} from 'lucide-react'
import { useState } from 'react'
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

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
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    )
  }

  const openImageFullscreen = () => {
    setIsImageModalOpen(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative">
        {/* Main Image Showcase */}
        {sortedImages.length > 0 && (
          <div className="relative h-[70vh] w-full overflow-hidden">
            {/* Background Image with Blur */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
              style={{
                backgroundImage: `url(${sortedImages[currentImageIndex]?.image_url})`,
              }}
            />
            <div className="absolute inset-0 bg-black/30" />

            {/* Main Image Container */}
            <div className="relative h-full flex items-center justify-center p-8">
              <div className="relative max-w-5xl w-full h-full">
                <div className="h-full rounded-3xl overflow-hidden shadow-2xl bg-white">
                  <img
                    src={sortedImages[currentImageIndex]?.image_url}
                    alt={`Imagem ${currentImageIndex + 1} de ${post.title}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Image Navigation Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20">
                    {/* Navigation Controls */}
                    {sortedImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                      </>
                    )}

                    {/* Top Controls */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                      {/* Image Counter */}
                      {sortedImages.length > 1 && (
                        <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                          {currentImageIndex + 1} / {sortedImages.length}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={openImageFullscreen}
                          className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 text-gray-600"
                        >
                          <Expand className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Image Dots */}
                    {sortedImages.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                        <div className="flex gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
                          {sortedImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                currentImageIndex === index
                                  ? 'bg-white scale-125'
                                  : 'bg-white/60 hover:bg-white/80'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Floating Price Tag */}
                <div className="absolute -bottom-6 left-8">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      <span className="text-3xl font-bold">
                        {formatPrice(post.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Header Info */}
        <div className="absolute -bottom-16 left-0 right-0 px-8">
          <div className="max-w-6xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge
                        className={`${
                          POST_TYPE_COLORS[post.post_type]
                        } text-sm px-4 py-1`}
                      >
                        {POST_TYPE_LABELS[post.post_type]}
                      </Badge>
                      {post.expires_at &&
                        new Date(post.expires_at) > new Date() && (
                          <Badge
                            variant="outline"
                            className="text-green-600 border-green-500 bg-green-50"
                          >
                            <Verified className="w-3 h-3 mr-1" />
                            Ativo
                          </Badge>
                        )}
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                      {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {post.profiles.name}
                          </p>
                          <p className="text-sm text-gray-500">Anunciante</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <span className="font-medium text-gray-900">
                          {post.location}
                        </span>
                      </div>

                      {post.created_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span>{formatRelativeTime(post.created_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Contact */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
                    {post.contact_whatsapp && (
                      <Button
                        onClick={() => handleContact('whatsapp')}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp
                      </Button>
                    )}

                    {post.contact_email && (
                      <Button
                        onClick={() => handleContact('email')}
                        variant="outline"
                        size="lg"
                        className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Email
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Thumbnail Gallery */}
              {sortedImages.length > 1 && (
                <Card className="overflow-hidden shadow-lg border-0">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Todas as fotos
                    </h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                      {sortedImages.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                            index === currentImageIndex
                              ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                        >
                          <img
                            src={image.image_url}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-gray-900">
                    Descrição
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-lg max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                      {post.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              {post.extra_info && (
                <Card className="shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl text-gray-900">
                      Informações Extras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                      {post.extra_info}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Details */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-gray-900">
                    Detalhes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {post.available_date && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <Calendar className="w-8 h-8 text-orange-500 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            Disponível em
                          </p>
                          <p className="text-gray-600">
                            {formatDate(post.available_date)}
                          </p>
                        </div>
                      </div>
                    )}

                    {post.gender_preference &&
                      post.gender_preference !== 'qualquer' && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                          <Users className="w-8 h-8 text-orange-500 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              Preferência
                            </p>
                            <p className="text-gray-600">
                              {GENDER_PREFERENCE_LABELS[post.gender_preference]}
                            </p>
                          </div>
                        </div>
                      )}

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl sm:col-span-2">
                      <Clock className="w-8 h-8 text-orange-500 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Publicado em
                        </p>
                        <p className="text-gray-600">
                          {formatDateTime(post.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="sticky top-8 shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">
                    Entre em Contato
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Fale com{' '}
                    <span className="font-semibold text-orange-600">
                      {post.profiles.name}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {post.contact_whatsapp && (
                    <Button
                      onClick={() => handleContact('whatsapp')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      size="lg"
                    >
                      <MessageCircle className="w-6 h-6 mr-3" />
                      Conversar no WhatsApp
                    </Button>
                  )}

                  {post.contact_email && (
                    <Button
                      onClick={() => handleContact('email')}
                      variant="outline"
                      className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      size="lg"
                    >
                      <Mail className="w-6 h-6 mr-3" />
                      Enviar Email
                    </Button>
                  )}

                  {post.contact_telegram && (
                    <Button
                      onClick={() => handleContact('telegram')}
                      variant="outline"
                      className="w-full border-2 border-purple-200 text-purple-600 hover:bg-purple-50 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      size="lg"
                    >
                      <Phone className="w-6 h-6 mr-3" />
                      Telegram
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Summary */}
              <Card className="shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Resumo Rápido
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
                    <span className="font-semibold text-gray-900">
                      {post.location}
                    </span>
                  </div>
                  {post.available_date && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">
                        Disponível:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatDate(post.available_date)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-medium">
                      Categoria:
                    </span>
                    <Badge className={POST_TYPE_COLORS[post.post_type]}>
                      {POST_TYPE_LABELS[post.post_type]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={sortedImages[currentImageIndex]?.image_url}
              alt={`Imagem em tela cheia`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
