import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  layout('layouts/main.tsx', [
    index('routes/home.tsx'),
    route('post/:id', 'routes/post.tsx'),

    layout('layouts/protected.tsx', [
      route('dashboard', 'routes/dashboard.tsx'),
      route('dashboard/create-post', 'routes/create-post.tsx'),
      route('dashboard/posts/:id/edit', 'routes/edit-post.tsx'),
    ]),
  ]),

  route('login', 'routes/auth/login.tsx'),
  route('signup', 'routes/auth/signup.tsx'),
] satisfies RouteConfig
