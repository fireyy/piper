module.exports = function (Vue) {
  var http = Vue.http;

  return {

    /**
     * 获取所有 changelog
     * @returns {*}
     */
    getAll(params) {
      return http
        .get('changelogs', {
          params: params
        })
    }
  }
}
