module.exports = function (Vue) {
  var resource = Vue.resource('pages');
  var http = Vue.http;

  return {
    ...resource
  }
}
