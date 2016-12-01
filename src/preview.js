import Vue from 'vue'
import './skin/default.less'
import Preview from './views/Preview'
import 'vue-swipe/dist/vue-swipe.css'

const preview = new Vue({
  el: '#preview',
  render: h => h(Preview)
})