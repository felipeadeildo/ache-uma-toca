import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image,
  MapPin,
  MessageCircle,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useAuth } from '~/contexts/auth-context'
import { supabase } from '~/lib/supabase'
import {
  GENDER_PREFERENCE_LABELS,
  POST_TYPE_LABELS,
  type GenderPreference,
  type PostInsert,
  type PostType,
} from '~/types/post'
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

interface FormData {
  post_type: PostType | ''
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
}

const initialFormData: FormData = {
  post_type: '',
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
}

const steps = [
  {
    id: 1,
    title: 'Tipo e Informações Básicas',
    description:
      'Escolha o tipo de anúncio e adicione as informações principais',
    icon: User,
  },
  {
    id: 2,
    title: 'Localização e Preço',
    description: 'Adicione detalhes sobre localização e valores',
    icon: MapPin,
  },
  {
    id: 3,
    title: 'Contatos e Preferências',
    description: 'Configure suas formas de contato e preferências',
    icon: MessageCircle,
  },
  {
    id: 4,
    title: 'Revisão e Publicação',
    description: 'Revise todas as informações antes de publicar',
    icon: Check,
  },
]

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}

    switch (step) {
      case 1:
        if (!formData.post_type)
          newErrors.post_type = 'Selecione o tipo de anúncio' as any
        if (!formData.title.trim()) newErrors.title = 'Título é obrigatório'
        if (!formData.description.trim())
          newErrors.description = 'Descrição é obrigatória'
        break
      case 2:
        if (!formData.location.trim())
          newErrors.location = 'Localização é obrigatória'
        break
      case 3:
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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3) || !user) return

    setLoading(true)
    try {
      const postData: PostInsert = {
        user_id: user.id,
        post_type: formData.post_type as PostType,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: formData.price ? parseFloat(formData.price) : null,
        available_date: formData.available_date || null,
        contact_whatsapp: formData.contact_whatsapp || null,
        contact_email: formData.contact_email || null,
        contact_telegram: formData.contact_telegram || null,
        gender_preference:
          (formData.gender_preference as GenderPreference) || null,
        extra_info: formData.extra_info || null,
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single()

      if (error) {
        console.error('Error creating post:', error)
        alert('Erro ao criar post. Tente novamente.')
      } else {
        navigate('/dashboard')
      }
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
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="post_type">Tipo de Anúncio *</Label>
              <Select
                value={formData.post_type}
                onValueChange={(value) => updateFormData('post_type', value)}
              >
                <SelectTrigger
                  className={errors.post_type ? 'border-red-500' : ''}
                >
                  <SelectValue placeholder="Selecione o tipo de anúncio" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(POST_TYPE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.post_type && (
                <p className="text-sm text-red-600">{errors.post_type}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                placeholder="Ex: Quarto disponível em apartamento próximo ao Insper"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <textarea
                id="description"
                placeholder="Descreva detalhadamente sua oferta ou necessidade..."
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                className={`w-full min-h-[120px] px-3 py-2 border rounded-md text-sm ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location">Localização *</Label>
              <Input
                id="location"
                placeholder="Ex: Vila Olímpia, São Paulo - SP"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Ex: 1500"
                value={formData.price}
                onChange={(e) => updateFormData('price', e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Deixe em branco se não se aplica
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="available_date">Data de Disponibilidade</Label>
              <Input
                id="available_date"
                type="date"
                value={formData.available_date}
                onChange={(e) =>
                  updateFormData('available_date', e.target.value)
                }
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Formas de Contato</h3>
              <p className="text-sm text-gray-600">
                Adicione pelo menos uma forma de contato para que interessados
                possam entrar em contato.
              </p>

              <div className="space-y-2">
                <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                <Input
                  id="contact_whatsapp"
                  placeholder="Ex: (11) 99999-9999"
                  value={formData.contact_whatsapp}
                  onChange={(e) =>
                    updateFormData('contact_whatsapp', e.target.value)
                  }
                  className={errors.contact_whatsapp ? 'border-red-500' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email">E-mail</Label>
                <Input
                  id="contact_email"
                  type="email"
                  placeholder="Ex: seu.email@exemplo.com"
                  value={formData.contact_email}
                  onChange={(e) =>
                    updateFormData('contact_email', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_telegram">Telegram</Label>
                <Input
                  id="contact_telegram"
                  placeholder="Ex: @seuusuario"
                  value={formData.contact_telegram}
                  onChange={(e) =>
                    updateFormData('contact_telegram', e.target.value)
                  }
                />
              </div>

              {errors.contact_whatsapp && (
                <p className="text-sm text-red-600">
                  {errors.contact_whatsapp}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender_preference">Preferência de Gênero</Label>
              <Select
                value={formData.gender_preference}
                onValueChange={(value) =>
                  updateFormData('gender_preference', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma preferência" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GENDER_PREFERENCE_LABELS).map(
                    ([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra_info">Informações Adicionais</Label>
              <textarea
                id="extra_info"
                placeholder="Adicione qualquer informação extra que considere importante..."
                value={formData.extra_info}
                onChange={(e) => updateFormData('extra_info', e.target.value)}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Revisão do Anúncio</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <p className="text-lg">
                    {POST_TYPE_LABELS[formData.post_type as PostType]}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Título</p>
                  <p className="text-lg">{formData.title}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Descrição</p>
                  <p className="text-gray-700">{formData.description}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Localização
                  </p>
                  <p className="text-lg">{formData.location}</p>
                </div>

                {formData.price && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Preço</p>
                    <p className="text-lg">R$ {formData.price}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-500">Contatos</p>
                  <div className="text-sm space-y-1">
                    {formData.contact_whatsapp && (
                      <p>WhatsApp: {formData.contact_whatsapp}</p>
                    )}
                    {formData.contact_email && (
                      <p>E-mail: {formData.contact_email}</p>
                    )}
                    {formData.contact_telegram && (
                      <p>Telegram: {formData.contact_telegram}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800">
                <strong>Importante:</strong> Seu anúncio ficará ativo por 60
                dias. Após esse período, será automaticamente removido da
                plataforma.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Criar Novo Anúncio
          </h1>
          <p className="text-gray-600">Publique seu anúncio em poucos passos</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <div key={step.id} className="flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive
                      ? 'bg-orange-600 text-white'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p
                  className={`text-xs text-center ${
                    isActive ? 'text-orange-600 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-px flex-1 mt-5 ${
                    isCompleted ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {steps[currentStep - 1]?.title}
          </h2>
          <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
        </div>

        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={nextStep}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Publicando...' : 'Publicar Anúncio'}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
