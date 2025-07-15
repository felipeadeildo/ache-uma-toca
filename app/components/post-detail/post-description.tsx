import { Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { formatDate } from '~/lib'
import {
  type PostWithAuthorAndImages,
  GENDER_PREFERENCE_LABELS,
} from '~/types/post'

interface PostDescriptionProps {
  post: PostWithAuthorAndImages
}

export function PostDescription({ post }: PostDescriptionProps) {
  return (
    <div className="space-y-6">
      {/* Main Description */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-gray-900">Descrição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
              {post.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Extra Info */}
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

      {/* Additional Details */}
      {(post.available_date ||
        (post.gender_preference && post.gender_preference !== 'qualquer')) && (
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-gray-900">
              Detalhes Adicionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {post.available_date && (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-8 h-8 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Disponível em</p>
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
                      <p className="font-semibold text-gray-900">Preferência</p>
                      <p className="text-gray-600">
                        {GENDER_PREFERENCE_LABELS[post.gender_preference]}
                      </p>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
