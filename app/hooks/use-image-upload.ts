import { useState } from 'react'
import { supabase } from '~/lib/supabase'

interface UploadedImage {
  file: File
  url: string
  displayOrder: number
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  )

  const uploadImages = async (
    images: File[],
    postId: string
  ): Promise<{ success: boolean; imageUrls?: string[] }> => {
    if (images.length === 0) {
      return { success: true, imageUrls: [] }
    }

    setUploading(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const fileExt = image.name.split('.').pop()
        const fileName = `${postId}/${Date.now()}-${i}.${fileExt}`

        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [image.name]: 0,
        }))

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          throw new Error(`Failed to upload ${image.name}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName)

        const imageUrl = urlData.publicUrl

        // Save to post_images table
        const { error: dbError } = await supabase.from('post_images').insert({
          post_id: postId,
          image_url: imageUrl,
          display_order: i,
        })

        if (dbError) {
          console.error('Error saving image to database:', dbError)
          // Try to cleanup uploaded file
          await supabase.storage.from('post-images').remove([fileName])
          throw new Error(`Failed to save ${image.name} to database`)
        }

        uploadedUrls.push(imageUrl)

        // Update progress
        setUploadProgress((prev) => ({
          ...prev,
          [image.name]: 100,
        }))
      }

      return { success: true, imageUrls: uploadedUrls }
    } catch (error) {
      console.error('Image upload failed:', error)

      // Cleanup any uploaded images for this post
      try {
        await supabase.from('post_images').delete().eq('post_id', postId)

        // Also cleanup storage files (we could keep track of uploaded files to be more precise)
        const { data: files } = await supabase.storage
          .from('post-images')
          .list(postId)

        if (files && files.length > 0) {
          const filesToDelete = files.map((file) => `${postId}/${file.name}`)
          await supabase.storage.from('post-images').remove(filesToDelete)
        }
      } catch (cleanupError) {
        console.error('Error cleaning up after failed upload:', cleanupError)
      }

      return { success: false }
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  return {
    uploading,
    uploadProgress,
    uploadImages,
  }
}
