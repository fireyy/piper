export default {
  formatDate: function(value){
    let options = {}
    return new Date(value).toLocaleString('zh-CN', options)
  }
}
