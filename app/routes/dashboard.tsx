import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useAuth } from '~/contexts/auth-context'
import type { Route } from './+types/dashboard'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Dashboard - Ache uma Toca' },
    {
      name: 'description',
      content: 'Painel principal da plataforma Ache uma Toca',
    },
  ]
}

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🦊 Ache uma Toca
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {profile?.name || user?.email}
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="text-sm"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Bem-vindo ao Ache uma Toca!</CardTitle>
                <CardDescription>
                  Sua plataforma para encontrar e oferecer moradia estudantil no
                  Insper
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        🏠 Tenho uma vaga
                      </CardTitle>
                      <CardDescription>
                        Publique seu anúncio para encontrar colegas de quarto
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Publicar vaga
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        🔍 Procuro uma vaga
                      </CardTitle>
                      <CardDescription>
                        Navegue pelos anúncios disponíveis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        Ver anúncios
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seus dados</CardTitle>
                <CardDescription>Informações do seu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nome</p>
                    <p className="text-lg">{profile?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-lg">{profile?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Curso</p>
                    <p className="text-lg">
                      {profile?.course || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Semestre
                    </p>
                    <p className="text-lg">
                      {profile?.semester || 'Não informado'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
