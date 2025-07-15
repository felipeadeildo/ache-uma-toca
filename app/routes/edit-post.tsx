import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
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
import { useEditPost, useUserPosts } from '~/hooks/use-posts'
import {
  GENDER_PREFERENCE_LABELS,
  POST_TYPE_LABELS,
  type GenderPreference,
  type PostType,
  type PostUpdate,
} from '~/types/post'
import type { Route } from './+types/edit-post'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Editar Post - Ache uma Toca' },
    {
      name: 'description',
      content: 'Edite seu anúncio na plataforma Ache uma Toca',
    },
  ]
}

interface FormData {
  post_type: PostType
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

export default function EditPost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState<FormData | null>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const { post, loading, error, fetchPost, updatePost, clearPost } =
    useEditPost()
  const { deletePost } = useUserPosts()

  useEffect(() => {
    if (id && user?.id) {
      fetchPost(id, user.id)
    }
    return () => clearPost()
  }, [id, user?.id, fetchPost, clearPost])

  useEffect(() => {
    if (post) {
      setFormData({
        post_type: post.post_type,
        title: post.title,
        description: post.description,
        location: post.location,
        price: post.price?.toString() || '',
        available_date: post.available_date || '',
        contact_whatsapp: post.contact_whatsapp || '',
        contact_email: post.contact_email || '',
        contact_telegram: post.contact_telegram || '',
        gender_preference: post.gender_preference || '',
        extra_info: post.extra_info || '',
      })
    }
  }, [post])

  const updateFormData = (field: keyof FormData, value: string) => {
    if (!formData) return
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    if (!formData) return false

    const newErrors: Partial<FormData> = {}

    if (!formData.post_type)
      newErrors.post_type = 'Selecione o tipo de anúncio' as any
    if (!formData.title.trim()) newErrors.title = 'Título é obrigatório'
    if (!formData.description.trim())
      newErrors.description = 'Descrição é obrigatória'
    if (!formData.location.trim())
      newErrors.location = 'Localização é obrigatória'

    if (
      !formData.contact_whatsapp &&
      !formData.contact_email &&
      !formData.contact_telegram
    ) {
      newErrors.contact_whatsapp =
        'Pelo menos uma forma de contato é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !user || !formData || !post) return

    setSaving(true)
    try {
      const updateData: PostUpdate = {
        post_type: formData.post_type,
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
        updated_at: new Date().toISOString(),
      }

      const success = await updatePost(post.id, updateData)

      if (!success) {
        alert('Erro ao atualizar post. Tente novamente.')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Erro ao atualizar post. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (
      !post ||
      !confirm(
        'Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.'
      )
    ) {
      return
    }

    try {
      const success = await deletePost(post.id)

      if (!success) {
        alert('Erro ao excluir post. Tente novamente.')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Erro ao excluir post. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Carregando post...</p>
        </div>
      </div>
    )
  }

  if (error || (!formData && !loading)) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center py-12">
          <p className="text-gray-500">{error || 'Post não encontrado.'}</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!formData || !post) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Anúncio</h1>
            <p className="text-gray-600">
              Atualize as informações do seu anúncio
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir
        </Button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border p-8 space-y-6"
      >
        {/* Post Type */}
        <div className="space-y-2">
          <Label htmlFor="post_type">Tipo de Anúncio *</Label>
          <Select
            value={formData.post_type}
            onValueChange={(value) => updateFormData('post_type', value)}
          >
            <SelectTrigger className={errors.post_type ? 'border-red-500' : ''}>
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

        {/* Title */}
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

        {/* Description */}
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

        {/* Location */}
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

        {/* Price and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Ex: 1500"
              value={formData.price}
              onChange={(e) => updateFormData('price', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available_date">Data de Disponibilidade</Label>
            <Input
              id="available_date"
              type="date"
              value={formData.available_date}
              onChange={(e) => updateFormData('available_date', e.target.value)}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Formas de Contato</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_whatsapp">WhatsApp</Label>
              <Input
                id="contact_whatsapp"
                placeholder="(11) 99999-9999"
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
                placeholder="seu.email@exemplo.com"
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
                placeholder="@seuusuario"
                value={formData.contact_telegram}
                onChange={(e) =>
                  updateFormData('contact_telegram', e.target.value)
                }
              />
            </div>
          </div>

          {errors.contact_whatsapp && (
            <p className="text-sm text-red-600">{errors.contact_whatsapp}</p>
          )}
        </div>

        {/* Gender Preference */}
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
              {Object.entries(GENDER_PREFERENCE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Extra Info */}
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

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  )
}
