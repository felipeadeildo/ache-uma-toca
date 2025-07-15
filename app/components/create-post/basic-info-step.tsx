import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

interface BasicInfoStepProps {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  errors: {
    title?: string
    description?: string
  }
}

export function BasicInfoStep({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  errors,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Anúncio *</Label>
        <Input
          id="title"
          placeholder="Ex: Quarto disponível em apartamento próximo ao Insper"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
        <p className="text-xs text-gray-500">
          Seja específico e atrativo para chamar a atenção dos interessados
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição Detalhada *</Label>
        <textarea
          id="description"
          placeholder="Descreva detalhadamente sua oferta: características do espaço, localização, regras da casa, o que está incluso no valor, etc..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={6}
          className={`w-full px-3 py-2 border rounded-md text-sm resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
        <p className="text-xs text-gray-500">
          Quanto mais detalhes, melhor! Mencione proximidade de universidades,
          transporte público, comodidades, etc.
        </p>
      </div>
    </div>
  )
}
