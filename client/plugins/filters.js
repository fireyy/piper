import Vue from 'vue'
import lang from '../constants/lang'

const filters = {
  formatDate(value) {
    let options = {}
    return new Date(value).toLocaleString('zh-CN', options)
  },
  lang(value) {
    return lang[value] || value
  }
}

export default filters

Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
