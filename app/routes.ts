import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'

export default [
  layout('layouts/main.tsx', [
    index('routes/home.tsx'),

    layout('layouts/protected.tsx', [
      route('dashboard', 'routes/dashboard.tsx'),
    ]),
  ]),

  route('login', 'routes/auth/login.tsx'),
  route('signup', 'routes/auth/signup.tsx'),
] satisfies RouteConfig
