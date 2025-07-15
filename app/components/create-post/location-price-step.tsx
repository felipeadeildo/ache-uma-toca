import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface LocationPriceStepProps {
  location: string
  price: string
  availableDate: string
  onLocationChange: (value: string) => void
  onPriceChange: (value: string) => void
  onAvailableDateChange: (value: string) => void
  errors: {
    location?: string
    price?: string
  }
}

export function LocationPriceStep({
  location,
  price,
  availableDate,
  onLocationChange,
  onPriceChange,
  onAvailableDateChange,
  errors,
}: LocationPriceStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="location">Localização *</Label>
        <Input
          id="location"
          placeholder="Ex: Vila Olímpia, São Paulo - SP"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className={errors.location ? 'border-red-500' : ''}
        />
        {errors.location && (
          <p className="text-sm text-red-600">{errors.location}</p>
        )}
        <p className="text-xs text-gray-500">
          Informe o bairro e cidade. Seja específico para ajudar na busca
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price">Valor Mensal (R$)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              R$
            </span>
            <Input
              id="price"
              type="number"
              placeholder="1500"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-gray-500">
            Deixe em branco se preferir negociar diretamente
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="available_date">Data de Disponibilidade</Label>
          <Input
            id="available_date"
            type="date"
            value={availableDate}
            onChange={(e) => onAvailableDateChange(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Quando o espaço estará disponível
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Dica para atrair mais interessados
            </h4>
            <p className="text-xs text-blue-700">
              Seja transparente sobre custos adicionais como condomínio, IPTU, 
              internet, limpeza, etc. Isso evita surpresas e gera mais confiança.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
