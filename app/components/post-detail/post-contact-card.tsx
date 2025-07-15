import { Mail, MessageCircle, Phone } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { openEmail, openTelegram, openWhatsApp } from '~/lib'
import type { PostWithAuthorAndImages } from '~/types/post'

interface PostContactCardProps {
  post: PostWithAuthorAndImages
}

export function PostContactCard({ post }: PostContactCardProps) {
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
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
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
  )
}
