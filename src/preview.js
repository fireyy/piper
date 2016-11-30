import Vue from 'vue'
import _ from 'lodash'
import Preview from './views/Preview'

const preview = new Vue({
  ...Preview
})

preview.$mount('#preview')