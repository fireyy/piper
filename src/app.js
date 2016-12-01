import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/css/styles.less'
import './skin/default.less'

import store from './vuex/store'
import App from './views/App'

import 'animate.css/animate.css'

Vue.use(Element)

const app = new Vue({
  el: '#app',
  store,
  render: h => h(App)
})

// design mode
document.documentElement.classList.add('design-mode')
