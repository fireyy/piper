import lang from '../constants/lang'

export default {
  formatDate(value) {
    let options = {}
    return new Date(value).toLocaleString('zh-CN', options)
  },
  lang(value) {
    return lang[value] || value
  }
}
