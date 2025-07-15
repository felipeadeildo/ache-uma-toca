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
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            📱 Formas de Contato
          </h3>
          <p className="text-sm text-gray-600">
            Pelo menos uma forma de contato é obrigatória
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="contact_whatsapp" className="text-sm font-medium">WhatsApp</Label>
            <Input
              id="contact_whatsapp"
              placeholder="(11) 99999-9999"
              value={contactWhatsapp}
              onChange={(e) => onContactWhatsappChange(e.target.value)}
              className={`text-sm ${errors.contact_whatsapp ? 'border-red-500' : ''}`}
            />
            <p className="text-xs text-gray-500">Mais usado</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact_email" className="text-sm font-medium">E-mail</Label>
            <Input
              id="contact_email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={contactEmail}
              onChange={(e) => onContactEmailChange(e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-gray-500">Contatos formais</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_telegram" className="text-sm font-medium">Telegram</Label>
          <Input
            id="contact_telegram"
            placeholder="@seuusuario"
            value={contactTelegram}
            onChange={(e) => onContactTelegramChange(e.target.value)}
            className="text-sm"
          />
          <p className="text-xs text-gray-500">Opcional</p>
        </div>

        {errors.contact_whatsapp && (
          <p className="text-xs text-red-600">{errors.contact_whatsapp}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
          ⚙️ Preferências
        </h3>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="gender_preference" className="text-sm font-medium">Preferência de Gênero</Label>
            <Select
              value={genderPreference}
              onValueChange={onGenderPreferenceChange}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Opcional" />
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
            <p className="text-xs text-gray-500">Opcional</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="extra_info" className="text-sm font-medium">Informações Extras</Label>
            <textarea
              id="extra_info"
              placeholder="Regras da casa, pets, fumantes, proximidade universidades..."
              value={extraInfo}
              onChange={(e) => onExtraInfoChange(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500">Opcional</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <div>
            <h4 className="text-xs font-medium text-blue-900 mb-1">
              🔒 Segurança
            </h4>
            <p className="text-xs text-blue-700">
              Converse antes da visita. Prefira horários seguros.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
