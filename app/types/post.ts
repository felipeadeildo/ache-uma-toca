import {
  type Enums,
  type Tables,
  type TablesInsert,
  type TablesUpdate,
} from './supabase'

// Tipos base do Supabase
export type Post = Tables<'posts'>
export type PostInsert = TablesInsert<'posts'>
export type PostUpdate = TablesUpdate<'posts'>

export type PostImage = Tables<'post_images'>
export type PostImageInsert = TablesInsert<'post_images'>

export type Profile = Tables<'profiles'>

// Enums
export type PostType = Enums<'post_type'>
export type GenderPreference = Enums<'gender_preference'>

// Tipos compostos para componentes
export type PostWithAuthor = Post & {
  profiles: {
    name: string
    email: string
    avatar_url: string | null
  }
}

export type PostWithImages = Post & {
  post_images: PostImage[]
}

export type PostWithAuthorAndImages = Post & {
  profiles: {
    name: string
    email: string
    avatar_url: string | null
  }
  post_images: PostImage[]
}

// Tipos para filtros
export interface PostFilters {
  postType?: PostType | 'all'
  location?: string
  priceMin?: number
  priceMax?: number
  genderPreference?: GenderPreference
  search?: string
}

// Constantes para UI
export const POST_TYPE_LABELS: Record<PostType, string> = {
  tenho_vaga: 'Tenho vaga',
  procuro_vaga: 'Procuro vaga',
  procuro_colega: 'Procuro colega',
  dica_geral: 'Dica geral',
}

export const POST_TYPE_COLORS: Record<PostType, string> = {
  tenho_vaga: 'bg-green-100 text-green-800',
  procuro_vaga: 'bg-blue-100 text-blue-800',
  procuro_colega: 'bg-purple-100 text-purple-800',
  dica_geral: 'bg-yellow-100 text-yellow-800',
}

export const GENDER_PREFERENCE_LABELS: Record<GenderPreference, string> = {
  qualquer: 'Qualquer',
  masculino: 'Masculino',
  feminino: 'Feminino',
  nao_binario: 'Não binário',
}
