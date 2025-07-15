import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '~/lib/supabase';

interface ImagesContextType {
  uploading: boolean
  uploadImages: (
    images: File[],
    postId: string
  ) => Promise<{ success: boolean; error?: string }>
  deleteImage: (imageId: string) => Promise<boolean>
}

const ImagesContext = createContext<ImagesContextType | undefined>(undefined)

export function ImagesProvider({ children }: { children: ReactNode }) {
  const [uploading, setUploading] = useState(false)

  const uploadImages = useCallback(
    async (
      images: File[],
      postId: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (images.length === 0) return { success: true }

      setUploading(true)
      try {
        let uploadedCount = 0

        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          const fileExt = image.name.split('.').pop()
          const fileName = `${postId}/${Date.now()}-${i}.${fileExt}`

          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(fileName, image)

          if (uploadError) {
            console.error('Error uploading image:', uploadError)
            continue
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from('post-images')
            .getPublicUrl(fileName)

          // Save image record to database
          const { error: dbError } = await supabase.from('post_images').insert({
            post_id: postId,
            image_url: urlData.publicUrl,
            display_order: i,
          })

          if (dbError) {
            console.error('Error saving image record:', dbError)
            // Clean up uploaded file
            await supabase.storage.from('post-images').remove([fileName])
            continue
          }

          uploadedCount++
        }

        if (uploadedCount === 0) {
          return {
            success: false,
            error: 'Nenhuma imagem foi carregada com sucesso',
          }
        }

        if (uploadedCount < images.length) {
          return {
            success: true,
            error: `${uploadedCount} de ${images.length} imagens foram carregadas com sucesso`,
          }
        }

        return { success: true }
      } catch (error) {
        console.error('Error in uploadImages:', error)
        return { success: false, error: 'Erro inesperado no upload de imagens' }
      } finally {
        setUploading(false)
      }
    },
    []
  )

  const deleteImage = useCallback(async (imageId: string): Promise<boolean> => {
    try {
      // Get image record to get the file name
      const { data: imageRecord, error: fetchError } = await supabase
        .from('post_images')
        .select('image_url')
        .eq('id', imageId)
        .single()

      if (fetchError || !imageRecord) {
        console.error('Error fetching image record:', fetchError)
        return false
      }

      // Extract file name from URL
      const url = new URL(imageRecord.image_url)
      const fileName = url.pathname.split('/').pop()

      if (!fileName) return false

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('post-images')
        .remove([fileName])

      if (storageError) {
        console.error('Error deleting from storage:', storageError)
      }

      // Delete record from database
      const { error: dbError } = await supabase
        .from('post_images')
        .delete()
        .eq('id', imageId)

      if (dbError) {
        console.error('Error deleting image record:', dbError)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting image:', error)
      return false
    }
  }, [])

  const value: ImagesContextType = {
    uploading,
    uploadImages,
    deleteImage,
  }

  return (
    <ImagesContext.Provider value={value}>{children}</ImagesContext.Provider>
  )
}

export function useImages() {
  const context = useContext(ImagesContext)
  if (context === undefined) {
    throw new Error('useImages must be used within an ImagesProvider')
  }
  return context
}
