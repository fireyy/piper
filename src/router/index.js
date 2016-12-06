import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Login from '../views/Login.vue'
import Layout from '../views/Layout.vue'
import Home from '../views/Home.vue'
import PageList from '../views/PageList.vue'
import Designer from '../views/Designer.vue'
import UserList from '../views/Users.vue'

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        { name: 'home', path: '/home', component: Home },
        { name: 'design', path: '/design/:id?', component: Designer },
        { name: 'pages', path: '/pages', component: PageList },
        { name: 'users', path: '/users', component: UserList }
      ]
    },
    { name: 'login', path: '/login', component: Login }
  ]
})
