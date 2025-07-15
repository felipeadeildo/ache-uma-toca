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
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Título do Anúncio *</Label>
        <Input
          id="title"
          placeholder="Ex: Quarto próximo ao Insper"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`text-sm ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
        <p className="text-xs text-gray-500">
          Seja específico e atrativo
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Descrição Detalhada *</Label>
        <textarea
          id="description"
          placeholder="Descreva seu espaço: características, localização, regras, o que está incluso..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md text-sm resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
        />
        {errors.description && (
          <p className="text-xs text-red-600">{errors.description}</p>
        )}
        <p className="text-xs text-gray-500">
          Mencione proximidade, transporte, comodidades
        </p>
      </div>
    </div>
  )
}
