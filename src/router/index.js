import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Designer from '../views/Designer.vue'

export default new Router({
  routes: [
    { path: '/design/:id', component: Designer },
    { path: '/', redirect: '/design/1' }
  ]
})
