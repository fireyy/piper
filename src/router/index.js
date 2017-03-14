import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// import Login from '../views/Login.vue'
// import Layout from '../views/Layout.vue'
// import Home from '../views/Home.vue'
// import PageList from '../views/PageList.vue'
// import Changelog from '../views/Changelog.vue'
// import Designer from '../views/Designer.vue'
// import UserList from '../views/Users.vue'

const Login = () => System.import('../views/Login.vue')
const Layout = () => System.import('../views/Layout.vue')
const Home = () => System.import('../views/Home.vue')
const PageList = () => System.import('../views/PageList.vue')
const Changelog = () => System.import('../views/Changelog.vue')
const Designer = () => System.import('../views/Designer.vue')
const Users = () => System.import('../views/Users.vue')
const Preview = () => System.import('../views/Preview.vue')

export default new Router({
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: { name: 'home' },
      children: [
        { name: 'home', path: '/home', component: Home },
        {
          name: 'design',
          path: '/design/:id?',
          component: Designer
        },
        { name: 'pages', path: '/pages', component: PageList },
        { name: 'changelog', path: '/changelog', component: Changelog },
        { name: 'users', path: '/users', component: Users }
      ]
    },
    { name: 'preview', path: '/preview', component: Preview },
    { name: 'login', path: '/login', component: Login }
  ]
})
