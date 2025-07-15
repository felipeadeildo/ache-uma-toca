import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { supabase } from '~/lib/supabase'
import { type Post, type PostFilters, type PostInsert, type PostUpdate, type PostWithAuthor, type PostWithAuthorAndImages } from '~/types/post'

interface PostsContextType {
  // Home page posts
  posts: PostWithAuthorAndImages[]
  loading: boolean
  error: string | null
  filters: PostFilters
  setFilters: (filters: PostFilters) => void
  fetchPosts: () => Promise<void>
  
  // Single post
  currentPost: PostWithAuthorAndImages | null
  postLoading: boolean
  postError: string | null
  fetchPost: (id: string) => Promise<void>
  clearCurrentPost: () => void
  
  // User posts
  userPosts: PostWithAuthor[]
  userPostsLoading: boolean
  userPostsError: string | null
  fetchUserPosts: (userId: string) => Promise<void>
  deletePost: (postId: string) => Promise<boolean>
  
  // Create post
  createPost: (postData: PostInsert) => Promise<{ success: boolean; post?: any; error?: string }>
  
  // Edit post
  editPost: Post | null
  editLoading: boolean
  editError: string | null
  fetchEditPost: (id: string, userId: string) => Promise<void>
  updatePost: (id: string, updateData: PostUpdate) => Promise<boolean>
  clearEditPost: () => void
  
  // Stats
  stats: {
    total: number
    active: number
    expired: number
  }
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: ReactNode }) {
  // Home posts state
  const [posts, setPosts] = useState<PostWithAuthorAndImages[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<PostFilters>({})
  
  // Single post state
  const [currentPost, setCurrentPost] = useState<PostWithAuthorAndImages | null>(null)
  const [postLoading, setPostLoading] = useState(false)
  const [postError, setPostError] = useState<string | null>(null)
  
  // User posts state
  const [userPosts, setUserPosts] = useState<PostWithAuthor[]>([])
  const [userPostsLoading, setUserPostsLoading] = useState(false)
  const [userPostsError, setUserPostsError] = useState<string | null>(null)
  
  // Edit post state
  const [editPost, setEditPost] = useState<Post | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
  })

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('posts')
        .select(
          `
          *,
          profiles!posts_user_id_fkey (
            name,
            email,
            avatar_url
          ),
          post_images (
            id,
            image_url,
            display_order
          )
        `
        )
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.postType && filters.postType !== 'all') {
        query = query.eq('post_type', filters.postType)
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }

      if (filters.priceMin) {
        query = query.gte('price', filters.priceMin)
      }

      if (filters.priceMax) {
        query = query.lte('price', filters.priceMax)
      }

      if (filters.genderPreference) {
        query = query.eq('gender_preference', filters.genderPreference)
      }

      const { data, error } = await query

      if (error) {
        setError('Erro ao carregar posts')
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data as PostWithAuthorAndImages[])
      }
    } catch (err) {
      setError('Erro inesperado ao carregar posts')
      console.error('Error fetching posts:', err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const fetchPost = useCallback(async (id: string) => {
    try {
      setPostLoading(true)
      setPostError(null)

      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          profiles!posts_user_id_fkey (
            name,
            email,
            avatar_url
          ),
          post_images (
            id,
            image_url,
            display_order
          )
        `
        )
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setPostError('Post não encontrado')
        } else {
          setPostError('Erro ao carregar o post')
        }
        return
      }

      // Check if post is not expired
      if (data.expires_at && new Date(data.expires_at) <= new Date()) {
        setPostError('Este post expirou')
        return
      }

      setCurrentPost(data as PostWithAuthorAndImages)
    } catch (err) {
      setPostError('Erro inesperado ao carregar o post')
      console.error('Error fetching post:', err)
    } finally {
      setPostLoading(false)
    }
  }, [])

  const clearCurrentPost = useCallback(() => {
    setCurrentPost(null)
    setPostError(null)
  }, [])

  const fetchUserPosts = useCallback(async (userId: string) => {
    try {
      setUserPostsLoading(true)
      setUserPostsError(null)

      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          profiles!posts_user_id_fkey (
            name,
            email,
            avatar_url
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        setUserPostsError('Erro ao carregar seus posts')
        console.error('Error fetching user posts:', error)
      } else {
        const postsData = data as PostWithAuthor[]
        setUserPosts(postsData)

        // Calculate stats
        const now = new Date()
        const activeCount = postsData.filter(
          (post) => post.expires_at && new Date(post.expires_at) > now
        ).length

        setStats({
          total: postsData.length,
          active: activeCount,
          expired: postsData.length - activeCount,
        })
      }
    } catch (err) {
      setUserPostsError('Erro inesperado ao carregar posts')
      console.error('Error fetching user posts:', err)
    } finally {
      setUserPostsLoading(false)
    }
  }, [])

  const deletePost = useCallback(async (postId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId)
      
      if (!error) {
        // Update local state
        setUserPosts(prev => prev.filter(post => post.id !== postId))
        setPosts(prev => prev.filter(post => post.id !== postId))
        return true
      } else {
        console.error('Error deleting post:', error)
        return false
      }
    } catch (err) {
      console.error('Error deleting post:', err)
      return false
    }
  }, [])

  const createPost = useCallback(async (postData: PostInsert): Promise<{ success: boolean; post?: any; error?: string }> => {
    try {
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert(postData)
        .select()
        .single()

      if (postError) {
        console.error('Error creating post:', postError)
        return { success: false, error: 'Erro ao criar post. Tente novamente.' }
      }

      return { success: true, post }
    } catch (error) {
      console.error('Error creating post:', error)
      return { success: false, error: 'Erro inesperado ao criar post.' }
    }
  }, [])

  const fetchEditPost = useCallback(async (id: string, userId: string) => {
    try {
      setEditLoading(true)
      setEditError(null)

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId) // Ensure user can only edit their own posts
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setEditError('Post não encontrado')
        } else {
          setEditError('Erro ao carregar post para edição')
        }
        console.error('Error fetching post for edit:', error)
      } else {
        setEditPost(data as Post)
      }
    } catch (err) {
      setEditError('Erro inesperado ao carregar post')
      console.error('Error fetching post for edit:', err)
    } finally {
      setEditLoading(false)
    }
  }, [])

  const updatePost = useCallback(async (id: string, updateData: PostUpdate): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Error updating post:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Error updating post:', err)
      return false
    }
  }, [])

  const clearEditPost = useCallback(() => {
    setEditPost(null)
    setEditError(null)
  }, [])

  const value: PostsContextType = {
    // Home posts
    posts,
    loading,
    error,
    filters,
    setFilters,
    fetchPosts,
    
    // Single post
    currentPost,
    postLoading,
    postError,
    fetchPost,
    clearCurrentPost,
    
    // User posts
    userPosts,
    userPostsLoading,
    userPostsError,
    fetchUserPosts,
    deletePost,
    
    // Create post
    createPost,
    
    // Edit post
    editPost,
    editLoading,
    editError,
    fetchEditPost,
    updatePost,
    clearEditPost,
    
    // Stats
    stats,
  }

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error('usePosts must be used within a PostsProvider')
  }
  return context
}