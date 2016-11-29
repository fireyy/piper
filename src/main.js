import Vue from 'vue'
import _ from 'lodash'
import 'normalize.css/normalize.css'
import './assets/css/styles.less'
import './assets/css/tanstions.less'
import './skin/default.less'

import App from './App'

import 'animate.css/animate.css'
import 'keen-ui/dist/keen-ui.css'
import 'hint.css/hint.css'

Vue.use(require('keen-ui'))
Vue.use(require('vue-sortable'))

new Vue({
    el        : 'body',
    components: {App}
})

// design mode
document.documentElement.classList.add('design-mode')