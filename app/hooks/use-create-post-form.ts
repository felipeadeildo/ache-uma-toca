import { useState } from 'react'
import type { GenderPreference } from '~/types/post'

export interface CreatePostFormData {
  title: string
  description: string
  location: string
  price: string
  available_date: string
  contact_whatsapp: string
  contact_email: string
  contact_telegram: string
  gender_preference: GenderPreference | ''
  extra_info: string
  images: File[]
}

const initialFormData: CreatePostFormData = {
  title: '',
  description: '',
  location: '',
  price: '',
  available_date: '',
  contact_whatsapp: '',
  contact_email: '',
  contact_telegram: '',
  gender_preference: '',
  extra_info: '',
  images: [],
}

export function useCreatePostForm() {
  const [formData, setFormData] = useState<CreatePostFormData>(initialFormData)
  const [errors, setErrors] = useState<Partial<CreatePostFormData>>({})

  const updateField = (field: keyof CreatePostFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<CreatePostFormData> = {}

    switch (step) {
      case 1: // Basic Info
        if (!formData.title.trim()) {
          newErrors.title = 'Título é obrigatório'
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Descrição é obrigatória'
        }
        break

      case 2: // Location and Price
        if (!formData.location.trim()) {
          newErrors.location = 'Localização é obrigatória'
        }
        break

      case 3: // Images (optional step)
        // No validation needed for images
        break

      case 4: // Contact and Preferences
        if (
          !formData.contact_whatsapp &&
          !formData.contact_email &&
          !formData.contact_telegram
        ) {
          newErrors.contact_whatsapp =
            'Pelo menos uma forma de contato é obrigatória'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setErrors({})
  }

  return {
    formData,
    errors,
    updateField,
    validateStep,
    resetForm,
  }
}
