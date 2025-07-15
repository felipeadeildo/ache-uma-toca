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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Mostre o seu espaço
        </h3>
        <p className="text-gray-600">
          Fotos de qualidade aumentam significativamente as chances de atrair interessados.
          Adicione até 5 imagens para mostrar o melhor do seu anúncio.
        </p>
      </div>

      <ImageUploader
        images={images}
        onImagesChange={onImagesChange}
        maxImages={5}
      />

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
          <div>
            <h4 className="text-sm font-medium text-green-900 mb-1">
              Por que adicionar fotos?
            </h4>
            <ul className="text-xs text-green-700 space-y-1">
              <li>• Anúncios com fotos recebem 3x mais visualizações</li>
              <li>• Geram mais confiança e interesse dos estudantes</li>
              <li>• Reduzem o tempo de negociação</li>
              <li>• Evitam visitas desnecessárias</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
