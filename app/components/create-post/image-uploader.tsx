import { ImagePlus, Upload, X } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface ImageUploaderProps {
  images: File[]
  onImagesChange: (images: File[]) => void
  maxImages?: number
  className?: string
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  className,
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleNewFiles = useCallback(
    (newFiles: File[]) => {
      const remainingSlots = maxImages - images.length
      const filesToAdd = newFiles.slice(0, remainingSlots)

      if (filesToAdd.length > 0) {
        onImagesChange([...images, ...filesToAdd])
      }
    },
    [images, maxImages, onImagesChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      )

      handleNewFiles(files)
    },
    [handleNewFiles]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      handleNewFiles(files)
      // Reset input
      e.target.value = ''
    },
    [handleNewFiles]
  )

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const canAddMore = images.length < maxImages

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            {
              'border-orange-400 bg-orange-50': isDragOver,
              'border-gray-300 hover:border-gray-400': !isDragOver,
            }
          )}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <ImagePlus className="w-8 h-8 text-gray-400" />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Adicione fotos do espaço
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Arraste e solte suas imagens aqui ou clique para selecionar
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Máximo {maxImages} fotos • PNG, JPG até 5MB cada
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Fotos
            </Button>

            <input
              id="image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Fotos selecionadas ({images.length}/{maxImages})
            </h4>
            {canAddMore && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('image-input')?.click()}
              >
                <ImagePlus className="w-4 h-4 mr-1" />
                Adicionar mais
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Image info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs truncate">{image.name}</p>
                  <p className="text-xs text-gray-300">
                    {(image.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <div>
            <h5 className="text-xs font-medium text-yellow-900">
              Dicas para fotos de qualidade:
            </h5>
            <ul className="text-xs text-yellow-700 mt-1 space-y-0.5">
              <li>• Use boa iluminação natural sempre que possível</li>
              <li>• Mostre diferentes ângulos do quarto e áreas comuns</li>
              <li>• Mantenha o ambiente limpo e organizado</li>
              <li>• Inclua fotos da vista da janela se for atrativa</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
