import { Filter, Search, X } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  GENDER_PREFERENCE_LABELS,
  POST_TYPE_LABELS,
  type GenderPreference,
  type PostFilters,
  type PostType,
} from '~/types/post'

interface PostFilterProps {
  filters: PostFilters
  onFiltersChange: (filters: PostFilters) => void
  totalResults?: number
  showFilters: boolean
  onToggleFilters: () => void
}

export function PostFilter({
  filters,
  onFiltersChange,
  totalResults,
  showFilters,
  onToggleFilters,
}: PostFilterProps) {
  const handleFilterChange = (key: keyof PostFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      filters[key as keyof PostFilters] !== undefined &&
      filters[key as keyof PostFilters] !== '' &&
      filters[key as keyof PostFilters] !== 'all'
  )

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar anúncios..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className="shrink-0"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Results count */}
      {totalResults !== undefined && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {totalResults}{' '}
            {totalResults === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-orange-600 hover:text-orange-700"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar filtros
            </Button>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros avançados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Post Type Filter */}
              <div className="space-y-2">
                <Label htmlFor="post-type">Tipo de anúncio</Label>
                <Select
                  value={filters.postType || 'all'}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'postType',
                      value === 'all' ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {Object.entries(POST_TYPE_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  placeholder="Ex: Pinheiros, Vila Olímpia..."
                  value={filters.location || ''}
                  onChange={(e) =>
                    handleFilterChange('location', e.target.value)
                  }
                />
              </div>

              {/* Gender Preference Filter */}
              <div className="space-y-2">
                <Label htmlFor="gender">Preferência de gênero</Label>
                <Select
                  value={filters.genderPreference || 'qualquer'}
                  onValueChange={(value) =>
                    handleFilterChange(
                      'genderPreference',
                      value === 'qualquer' ? undefined : value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Qualquer" />
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

              {/* Price Range */}
              <div className="space-y-2">
                <Label htmlFor="price-min">Preço mínimo</Label>
                <Input
                  id="price-min"
                  type="number"
                  placeholder="R$ 0"
                  value={filters.priceMin || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'priceMin',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price-max">Preço máximo</Label>
                <Input
                  id="price-max"
                  type="number"
                  placeholder="R$ 10.000"
                  value={filters.priceMax || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'priceMax',
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
