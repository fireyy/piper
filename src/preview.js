import Vue from 'vue'
import './skin/dpi.less'
import Preview from './views/Preview.vue'

const preview = new Vue({
  el: '#preview',
  render: h => h(Preview)
})
