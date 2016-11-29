import Vue from 'vue'
import Vuex from 'vuex'
import base from './modules/base'
import render from './modules/render'
import toast from './modules/toast'
import loadingBar from './modules/loading-bar'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        base,
        render,
        toast,
        loadingBar
    }
})
