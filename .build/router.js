import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _bb6a46bc = () => import('../client/pages/users.vue' /* webpackChunkName: "pages/users" */).then(m => m.default || m)
const _7a85ff44 = () => import('../client/pages/pages.vue' /* webpackChunkName: "pages/pages" */).then(m => m.default || m)
const _20799096 = () => import('../client/pages/home.vue' /* webpackChunkName: "pages/home" */).then(m => m.default || m)
const _d20ceda4 = () => import('../client/pages/changelog.vue' /* webpackChunkName: "pages/changelog" */).then(m => m.default || m)
const _2688a583 = () => import('../client/pages/login.vue' /* webpackChunkName: "pages/login" */).then(m => m.default || m)
const _4a9459e2 = () => import('../client/pages/preview.vue' /* webpackChunkName: "pages/preview" */).then(m => m.default || m)
const _2e30e93f = () => import('../client/pages/design/_id.vue' /* webpackChunkName: "pages/design/_id" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/users",
			component: _bb6a46bc,
			name: "users"
		},
		{
			path: "/pages",
			component: _7a85ff44,
			name: "pages"
		},
		{
			path: "/home",
			component: _20799096,
			name: "home"
		},
		{
			path: "/changelog",
			component: _d20ceda4,
			name: "changelog"
		},
		{
			path: "/login",
			component: _2688a583,
			name: "login"
		},
		{
			path: "/preview",
			component: _4a9459e2,
			name: "preview"
		},
		{
			path: "/design/:id?",
			component: _2e30e93f,
			name: "design-id"
		}
    ],
    fallback: false
  })
}
