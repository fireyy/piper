module.exports = function (Vue) {
  var resource = Vue.resource('page{/id}');
  var http = Vue.http;

  return {
    ...resource,

    /**
     * 获取 design 数据
     * @param id
     * @returns {*}
     */
    getData(id) {
      return http
        .get('page/'+id)
        .then((res) => res.json().data)
    },

    /**
     * 保存 design
     * @returns {*}
     */
    saveData(data) {
      return http
        .post('pages', JSON.stringify(data))
        .then((res) => res.json().data)
    }
  }
}
