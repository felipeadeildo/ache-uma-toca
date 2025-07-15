import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { useAuth } from '~/contexts/auth-context'

export function meta() {
  return [
    { title: 'Cadastro - Ache uma Toca' },
    {
      name: 'description',
      content: 'Crie sua conta na plataforma Ache uma Toca',
    },
  ]
}

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    course: '',
    semester: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const { signUp, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validar email institucional
    if (!formData.email.match(/@(al\.)?insper\.edu\.br$/)) {
      setError('Email deve ser do domínio @insper.edu.br ou @al.insper.edu.br')
      setLoading(false)
      return
    }

    const { error } = await signUp(formData.email, {
      name: formData.name,
      course: formData.course || undefined,
      semester: formData.semester ? parseInt(formData.semester) : undefined,
    })

    if (error) {
      setError(error.message)
    } else {
      setEmailSent(true)
    }

    setLoading(false)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-blue-600 text-4xl mb-4">📧</div>
              <h2 className="text-xl font-semibold mb-2">
                Verifique seu email
              </h2>
              <p className="text-gray-600 mb-4">
                Enviamos um link mágico para <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Clique no link do email para confirmar sua conta e fazer login
                automaticamente.
              </p>
              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
              >
                Enviar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🦊 Ache uma Toca</CardTitle>
          <CardDescription>
            Crie sua conta com email institucional
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email institucional</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="seu.email@insper.edu.br"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Curso (opcional)</Label>
              <Input
                id="course"
                name="course"
                type="text"
                placeholder="Ex: Engenharia, Administração, Economia..."
                value={formData.course}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semestre atual (opcional)</Label>
              <Input
                id="semester"
                name="semester"
                type="number"
                placeholder="Ex: 3"
                min="1"
                max="12"
                value={formData.semester}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={loading}
            >
              {loading ? 'Enviando link...' : 'Criar conta'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem conta?{' '}
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
