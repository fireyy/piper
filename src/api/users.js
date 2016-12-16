module.exports = function (Vue) {
  var resource = Vue.resource('users');
  var http = Vue.http;

  return {
    ...resource
  }
}
