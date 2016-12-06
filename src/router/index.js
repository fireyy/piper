import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import PageList from '../views/PageList.vue'
import Designer from '../views/Designer.vue'

export default new Router({
  routes: [
    { name: 'design', path: '/design/:id?', component: Designer },
    { name: 'pages', path: '/pages', component: PageList },
    { path: '/', redirect: '/pages' }
  ]
})
