import { Home, Plus, Search } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface EmptyStateProps {
  title: string
  description: string
  icon?: 'search' | 'home' | 'plus'
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  title,
  description,
  icon = 'search',
  action,
}: EmptyStateProps) {
  const iconMap = {
    search: Search,
    home: Home,
    plus: Plus,
  }

  const Icon = iconMap[icon]

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="w-16 h-16 text-gray-400 mb-6" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-orange-600 hover:bg-orange-700"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
