export default function ({ isServer, store, req, route, redirect }) {
  // If nuxt generate, pass this middleware
  if (isServer && !req) return
  const user = isServer ? req.user : store.state.user
  if (!user && ['login', 'view-id'].indexOf(route.name) === -1) {
    redirect('/login', { page: route.fullPath })
  }
}
