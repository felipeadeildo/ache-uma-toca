import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { useState } from 'react'
import type { PostWithAuthorAndImages } from '~/types/post'

interface PostImageGalleryProps {
  images: PostWithAuthorAndImages['post_images']
  title: string
}

export function PostImageGallery({ images, title }: PostImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const sortedImages = images.sort((a, b) => a.display_order - b.display_order)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + sortedImages.length) % sortedImages.length
    )
  }

  return (
    <>
      {/* Main Image */}
      <div className="relative">
        <div className="aspect-[4/3] lg:aspect-[3/2] w-full rounded-xl overflow-hidden bg-gray-100">
          <img
            src={sortedImages[currentImageIndex]?.image_url}
            alt={`${title} - Imagem ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Controls Overlay */}
          <div className="absolute inset-0">
            {/* Navigation Buttons */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2 shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Top Controls */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
              {/* Image Counter */}
              {sortedImages.length > 1 && (
                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {sortedImages.length}
                </div>
              )}

              {/* Expand Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg text-gray-600 hover:bg-white transition-all"
              >
                <Expand className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {sortedImages.length > 1 && (
          <div className="mt-3">
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex
                      ? 'border-orange-500 ring-2 ring-orange-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-full">
            <img
              src={sortedImages[currentImageIndex]?.image_url}
              alt={`${title} - Imagem em tela cheia`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
