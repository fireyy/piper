import Vue from 'vue'
import _ from 'lodash'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import './assets/css/styles.less'
import './skin/default.less'

import App from './views/App'

import 'animate.css/animate.css'

Vue.use(Element)

const app = new Vue({
  ...App
})

app.$mount('#app')

// design mode
document.documentElement.classList.add('design-mode')
