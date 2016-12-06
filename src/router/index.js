import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/Layout.vue'
import PageList from '../views/PageList.vue'
import Designer from '../views/Designer.vue'
import UserList from '../views/Users.vue'

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { name: 'design', path: '/design/:id?', component: Designer },
        { name: 'pages', path: '/pages', component: PageList },
        { name: 'users', path: '/users', component: UserList }
      ]
    },
    { path: '/login' }
  ]
})
