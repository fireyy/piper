import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import base from './modules/base'
import render from './modules/render'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions,
  modules: {
    base,
    render
  }
})

export default store
