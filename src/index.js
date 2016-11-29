import Vue from 'vue'
import _ from 'lodash'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/css/styles.less'
import './skin/default.less'

import App from './App'

import 'animate.css/animate.css'
import 'keen-ui/dist/keen-ui.css'
import 'hint.css/hint.css'

Vue.use(Element)
Vue.use(require('vue-sortable'))

const app = new Vue({
  ...App
})

app.$mount('#app')

// design mode
document.documentElement.classList.add('design-mode')
