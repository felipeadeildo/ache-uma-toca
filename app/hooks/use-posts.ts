import { usePosts } from '~/contexts/posts-context'

export function useHomePosts() {
  const { posts, loading, error, filters, setFilters, fetchPosts } = usePosts()
  
  return {
    posts,
    loading,
    error,
    filters,
    setFilters,
    fetchPosts,
  }
}

export function usePost() {
  const { currentPost, postLoading, postError, fetchPost, clearCurrentPost } = usePosts()
  
  return {
    post: currentPost,
    loading: postLoading,
    error: postError,
    fetchPost,
    clearPost: clearCurrentPost,
  }
}

export function useUserPosts() {
  const { userPosts, userPostsLoading, userPostsError, fetchUserPosts, deletePost, stats } = usePosts()
  
  return {
    posts: userPosts,
    loading: userPostsLoading,
    error: userPostsError,
    fetchUserPosts,
    deletePost,
    stats,
  }
}

export function useCreatePost() {
  const { createPost } = usePosts()
  
  return {
    createPost,
  }
}

export function useEditPost() {
  const { editPost, editLoading, editError, fetchEditPost, updatePost, clearEditPost } = usePosts()
  
  return {
    post: editPost,
    loading: editLoading,
    error: editError,
    fetchPost: fetchEditPost,
    updatePost,
    clearPost: clearEditPost,
  }
}