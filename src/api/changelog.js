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
    },
    /**
     * 获取最新的 changelog
     * @returns {*}
     */
    getRecent() {
      return http
        .get('changelogs', {
          params: {
            size: 5,
            page: 1
          }
        })
    }
  }
}
