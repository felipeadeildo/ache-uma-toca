import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image,
  MapPin,
  MessageCircle,
  Upload,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { BasicInfoStep } from '~/components/create-post/basic-info-step'
import { ContactPreferencesStep } from '~/components/create-post/contact-preferences-step'
import { ImagesUploadStep } from '~/components/create-post/images-upload-step'
import { LocationPriceStep } from '~/components/create-post/location-price-step'
import { ReviewStep } from '~/components/create-post/review-step'
import {
  StepIndicator,
  type Step,
} from '~/components/create-post/step-indicator'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { useAuth } from '~/contexts/auth-context'
import { useCreatePostForm } from '~/hooks/use-create-post-form'
import { useImageUpload } from '~/hooks/use-image-upload'
import { supabase } from '~/lib/supabase'
import type { PostInsert } from '~/types/post'
import type { Route } from './+types/create-post'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Criar Post - Ache uma Toca' },
    {
      name: 'description',
      content: 'Crie seu anúncio na plataforma Ache uma Toca',
    },
  ]
}

const steps: Step[] = [
  {
    id: 1,
    title: 'Informações',
    icon: User,
  },
  {
    id: 2,
    title: 'Localização',
    icon: MapPin,
  },
  {
    id: 3,
    title: 'Fotos',
    icon: Image,
  },
  {
    id: 4,
    title: 'Contato',
    icon: MessageCircle,
  },
  {
    id: 5,
    title: 'Revisão',
    icon: Check,
  },
]

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const { formData, errors, updateField, validateStep, resetForm } =
    useCreatePostForm()
  const { uploading, uploadImages } = useImageUpload()

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4) || !user) return

    setLoading(true)
    try {
      // Create the post first
      const postData: PostInsert = {
        user_id: user.id,
        post_type: 'tenho_vaga',
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: formData.price ? parseFloat(formData.price) : null,
        available_date: formData.available_date || null,
        contact_whatsapp: formData.contact_whatsapp || null,
        contact_email: formData.contact_email || null,
        contact_telegram: formData.contact_telegram || null,
        gender_preference: formData.gender_preference || null,
        extra_info: formData.extra_info || null,
      }

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single()

      if (postError) {
        console.error('Error creating post:', postError)
        alert('Erro ao criar post. Tente novamente.')
        return
      }

      // Upload images if any
      if (formData.images.length > 0) {
        const { success } = await uploadImages(formData.images, post.id)
        if (!success) {
          // If image upload fails, we could either:
          // 1. Delete the post and show error
          // 2. Keep the post but show warning about images
          // Let's keep the post and show a warning
          alert(
            'Post criado com sucesso, mas algumas imagens não puderam ser carregadas.'
          )
        }
      }

      // Success
      navigate('/dashboard')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Erro ao criar post. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            title={formData.title}
            description={formData.description}
            onTitleChange={(value) => updateField('title', value)}
            onDescriptionChange={(value) => updateField('description', value)}
            errors={{ title: errors.title, description: errors.description }}
          />
        )

      case 2:
        return (
          <LocationPriceStep
            location={formData.location}
            price={formData.price}
            availableDate={formData.available_date}
            onLocationChange={(value) => updateField('location', value)}
            onPriceChange={(value) => updateField('price', value)}
            onAvailableDateChange={(value) =>
              updateField('available_date', value)
            }
            errors={{ location: errors.location }}
          />
        )

      case 3:
        return (
          <ImagesUploadStep
            images={formData.images}
            onImagesChange={(images) => updateField('images', images)}
          />
        )

      case 4:
        return (
          <ContactPreferencesStep
            contactWhatsapp={formData.contact_whatsapp}
            contactEmail={formData.contact_email}
            contactTelegram={formData.contact_telegram}
            genderPreference={formData.gender_preference}
            extraInfo={formData.extra_info}
            onContactWhatsappChange={(value) =>
              updateField('contact_whatsapp', value)
            }
            onContactEmailChange={(value) =>
              updateField('contact_email', value)
            }
            onContactTelegramChange={(value) =>
              updateField('contact_telegram', value)
            }
            onGenderPreferenceChange={(value) =>
              updateField('gender_preference', value)
            }
            onExtraInfoChange={(value) => updateField('extra_info', value)}
            errors={{ contact_whatsapp: errors.contact_whatsapp }}
          />
        )

      case 5:
        return (
          <ReviewStep
            title={formData.title}
            description={formData.description}
            location={formData.location}
            price={formData.price}
            availableDate={formData.available_date}
            contactWhatsapp={formData.contact_whatsapp}
            contactEmail={formData.contact_email}
            contactTelegram={formData.contact_telegram}
            genderPreference={formData.gender_preference}
            extraInfo={formData.extra_info}
            images={formData.images}
          />
        )

      default:
        return null
    }
  }

  const isSubmitStep = currentStep === steps.length
  const isProcessing = loading || uploading

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <h1 className="text-lg sm:text-xl text-center font-bold text-gray-900 mb-3 sm:mb-4">
        Criar Novo Anúncio
      </h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      <Card className="mb-4 py-3">
        <CardTitle className="text-base text-center sm:text-lg">
          {steps[currentStep - 1]?.title}
        </CardTitle>
        <CardContent className="pb-2">{renderStepContent()}</CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isProcessing}
          size="lg"
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div className="text-xs sm:text-sm text-gray-500 order-1 sm:order-2">
          Passo {currentStep} de {steps.length}
        </div>

        {!isSubmitStep ? (
          <Button
            onClick={nextStep}
            disabled={isProcessing}
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto order-3"
          >
            Próximo
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isProcessing}
            size="lg"
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto order-3"
          >
            {isProcessing ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                {uploading ? 'Enviando fotos...' : 'Publicando...'}
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Publicar Anúncio
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
