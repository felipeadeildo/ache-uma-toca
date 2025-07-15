import { Badge } from '~/components/ui/badge'
import { GENDER_PREFERENCE_LABELS, type GenderPreference } from '~/types/post'

interface ReviewStepProps {
  title: string
  description: string
  location: string
  price: string
  availableDate: string
  contactWhatsapp: string
  contactEmail: string
  contactTelegram: string
  genderPreference: GenderPreference | ''
  extraInfo: string
  images: File[]
}

export function ReviewStep({
  title,
  description,
  location,
  price,
  availableDate,
  contactWhatsapp,
  contactEmail,
  contactTelegram,
  genderPreference,
  extraInfo,
  images,
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">
          Revise seu anúncio
        </h3>
        <p className="text-gray-600">
          Confira todas as informações antes de publicar
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Images Preview */}
        {images.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              Fotos ({images.length})
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {images.map((image, index) => (
                <div
                  key={`review-${index}`}
                  className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Título</h4>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Descrição
            </h4>
            <p className="text-gray-700 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Location and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Localização
            </h4>
            <p className="text-gray-900 font-medium">{location}</p>
          </div>

          {price && (
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Preço</h4>
              <p className="text-xl font-bold text-green-600">
                R$ {price}
                <span className="text-sm font-normal text-gray-500">/mês</span>
              </p>
            </div>
          )}
        </div>

        {/* Available Date */}
        {availableDate && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Data de Disponibilidade
            </h4>
            <p className="text-gray-900">
              {new Date(availableDate).toLocaleDateString('pt-BR')}
            </p>
          </div>
        )}

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-2">
            Formas de Contato
          </h4>
          <div className="flex flex-wrap gap-2">
            {contactWhatsapp && (
              <Badge
                variant="outline"
                className="text-green-700 border-green-300"
              >
                WhatsApp: {contactWhatsapp}
              </Badge>
            )}
            {contactEmail && (
              <Badge
                variant="outline"
                className="text-blue-700 border-blue-300"
              >
                Email: {contactEmail}
              </Badge>
            )}
            {contactTelegram && (
              <Badge
                variant="outline"
                className="text-purple-700 border-purple-300"
              >
                Telegram: {contactTelegram}
              </Badge>
            )}
          </div>
        </div>

        {/* Preferences */}
        {genderPreference && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Preferência de Gênero
            </h4>
            <Badge variant="secondary">
              {GENDER_PREFERENCE_LABELS[genderPreference]}
            </Badge>
          </div>
        )}

        {/* Extra Info */}
        {extraInfo && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">
              Informações Adicionais
            </h4>
            <p className="text-gray-700 leading-relaxed">{extraInfo}</p>
          </div>
        )}
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h4 className="text-sm font-medium text-orange-900 mb-1">
              Antes de publicar
            </h4>
            <ul className="text-xs text-orange-700 space-y-0.5">
              <li>• Seu anúncio ficará ativo por 60 dias</li>
              <li>• Você pode editar ou excluir a qualquer momento</li>
              <li>
                • Responda rapidamente aos interessados para ter mais sucesso
              </li>
              <li>• Mantenha as informações sempre atualizadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
