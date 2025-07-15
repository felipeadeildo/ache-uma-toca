import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useAuth } from '~/contexts/auth-context'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Ache uma Toca' },
    { name: 'description', content: 'Ache uma Toca - Insper (não-oficial)' },
  ]
}

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🦊 Ache uma Toca
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A plataforma dos estudantes do Insper para encontrar moradia
        </p>

        {!user && (
          <div className="flex justify-center gap-4">
            <Button className="bg-orange-600 hover:bg-orange-700">
              Começar agora
            </Button>
            <Button variant="outline">Saiba mais</Button>
          </div>
        )}
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Anúncios recentes
          </h2>
          {user && (
            <Button className="bg-orange-600 hover:bg-orange-700">
              + Publicar anúncio
            </Button>
          )}
        </div>

        {/* Mock posts - será substituído por dados reais */}
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    🏠 Quarto disponível em Pinheiros
                  </CardTitle>
                  <CardDescription>
                    Publicado há 2 horas • Por João Silva
                  </CardDescription>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Tenho vaga
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Quarto grande em apartamento próximo ao Insper. Condomínio com
                academia e piscina.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  📍 Pinheiros • 💰 R$ 1.200/mês
                </div>
                <Button variant="outline" size="sm">
                  Ver detalhes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    🔍 Procuro colega de quarto
                  </CardTitle>
                  <CardDescription>
                    Publicado há 5 horas • Por Maria Santos
                  </CardDescription>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Procuro colega
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Estudante de engenharia procura colega para dividir apartamento
                próximo ao campus.
              </p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  📍 Vila Olímpia • 💰 Até R$ 1.500/mês
                </div>
                <Button variant="outline" size="sm">
                  Ver detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
