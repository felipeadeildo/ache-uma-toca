import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  GENDER_PREFERENCE_LABELS,
  type GenderPreference,
} from '~/types/post'

interface ContactPreferencesStepProps {
  contactWhatsapp: string
  contactEmail: string
  contactTelegram: string
  genderPreference: GenderPreference | ''
  extraInfo: string
  onContactWhatsappChange: (value: string) => void
  onContactEmailChange: (value: string) => void
  onContactTelegramChange: (value: string) => void
  onGenderPreferenceChange: (value: string) => void
  onExtraInfoChange: (value: string) => void
  errors: {
    contact_whatsapp?: string
  }
}

export function ContactPreferencesStep({
  contactWhatsapp,
  contactEmail,
  contactTelegram,
  genderPreference,
  extraInfo,
  onContactWhatsappChange,
  onContactEmailChange,
  onContactTelegramChange,
  onGenderPreferenceChange,
  onExtraInfoChange,
  errors,
}: ContactPreferencesStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Formas de Contato
          </h3>
          <p className="text-sm text-gray-600">
            Adicione pelo menos uma forma de contato para que interessados
            possam entrar em contato com você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_whatsapp">WhatsApp</Label>
            <Input
              id="contact_whatsapp"
              placeholder="(11) 99999-9999"
              value={contactWhatsapp}
              onChange={(e) => onContactWhatsappChange(e.target.value)}
              className={errors.contact_whatsapp ? 'border-red-500' : ''}
            />
            <p className="text-xs text-gray-500">
              Forma de contato mais utilizada
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email">E-mail</Label>
            <Input
              id="contact_email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={contactEmail}
              onChange={(e) => onContactEmailChange(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Para contatos mais formais
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_telegram">Telegram (opcional)</Label>
          <Input
            id="contact_telegram"
            placeholder="@seuusuario"
            value={contactTelegram}
            onChange={(e) => onContactTelegramChange(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Adicione seu @ do Telegram
          </p>
        </div>

        {errors.contact_whatsapp && (
          <p className="text-sm text-red-600">{errors.contact_whatsapp}</p>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Preferências
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gender_preference">Preferência de Gênero</Label>
            <Select
              value={genderPreference}
              onValueChange={onGenderPreferenceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma preferência (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GENDER_PREFERENCE_LABELS).map(
                  ([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Especifique se tem preferência pelo gênero do inquilino
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra_info">Informações Adicionais</Label>
            <textarea
              id="extra_info"
              placeholder="Adicione informações extras como: regras da casa, pets permitidos, fumantes, horários, proximidade de universidades, transporte público, etc..."
              value={extraInfo}
              onChange={(e) => onExtraInfoChange(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500">
              Informações que podem ser importantes para o interessado
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Dica de segurança
            </h4>
            <p className="text-xs text-blue-700">
              Sempre converse com interessados antes de marcar uma visita. 
              Prefira encontros em horários seguros e, se possível, 
              tenha alguém presente durante a visita.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
