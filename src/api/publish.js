module.exports = function (Vue) {
  var resource = Vue.resource('publish{/id}');
  var http = Vue.http;

  return {
    ...resource
  }
}
