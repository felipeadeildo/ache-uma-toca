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
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">Localização *</Label>
        <Input
          id="location"
          placeholder="Ex: Vila Olímpia, São Paulo - SP"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className={`text-sm ${errors.location ? 'border-red-500' : ''}`}
        />
        {errors.location && (
          <p className="text-xs text-red-600">{errors.location}</p>
        )}
        <p className="text-xs text-gray-500">
          Informe bairro e cidade
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-medium">Valor Mensal (R$)</Label>
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
              className="pl-10 text-sm"
            />
          </div>
          <p className="text-xs text-gray-500">
            Opcional
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="available_date" className="text-sm font-medium">Data Disponível</Label>
          <Input
            id="available_date"
            type="date"
            value={availableDate}
            onChange={(e) => onAvailableDateChange(e.target.value)}
            className="text-sm"
          />
          <p className="text-xs text-gray-500">
            Quando estará livre
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <div>
            <h4 className="text-xs font-medium text-blue-900 mb-1">
              💡 Dica
            </h4>
            <p className="text-xs text-blue-700">
              Seja transparente sobre custos extras (condomínio, internet, etc.)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
