import Vue from 'vue'
import VueResource from 'vue-resource'
import store from '../store'

Vue.use(VueResource)

Vue.http.options.root = '/api';

// loading bar
Vue.http.interceptors.push((request, next) => {
  let timer = setTimeout(() => {
    store.commit('CHANGE_LOADING_BAR', true)
  }, 500)

  next((res) => {
    clearTimeout(timer)
    store.commit('CHANGE_LOADING_BAR', false)
  });
});

export default {
  page: require('./page')(Vue),
  pages: require('./pages')(Vue)
}
