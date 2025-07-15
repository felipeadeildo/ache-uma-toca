import { ImageUploader } from './image-uploader'

interface ImagesUploadStepProps {
  images: File[]
  onImagesChange: (images: File[]) => void
}

export function ImagesUploadStep({
  images,
  onImagesChange,
}: ImagesUploadStepProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center space-y-2">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          📸 Mostre o seu espaço
        </h3>
        <p className="text-sm text-gray-600">
          Fotos atraem 3x mais interessados. Adicione até 5 imagens.
        </p>
      </div>

      <ImageUploader
        images={images}
        onImagesChange={onImagesChange}
        maxImages={5}
      />

      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
          <div>
            <h4 className="text-xs font-medium text-green-900 mb-1">
              ✨ Dicas para fotos
            </h4>
            <ul className="text-xs text-green-700 space-y-0.5">
              <li>• Use boa iluminação</li>
              <li>• Mostre o quarto e áreas comuns</li>
              <li>• Evite muita bagunça</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
