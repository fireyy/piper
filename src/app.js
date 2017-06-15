import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import ProgressBar from '@/components/ProgressBar'

import filters from './filters'

sync(store, router)

Vue.use(Element)

Vue.config.productionTip = false

// ProgressBar
const bar = Vue.prototype.$bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

router.beforeEach((to, from, next) => {
  bar.start()
  next()
})
router.afterEach((to, from) => {
  bar.finish()
})

// add vue filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

const app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

// design mode
document.documentElement.classList.add('design-mode')

export { app, router, store }
