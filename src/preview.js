import Vue from 'vue'
import _ from 'lodash'
import './skin/default.less'
import Preview from './views/Preview'

const preview = new Vue({
  el: '#preview',
  render: h => h(Preview)
})