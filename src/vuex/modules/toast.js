import {
    TOAST
} from '../mutation-types'

const state = {
    item: {}
}

const mutations = {
    [TOAST](state, item) {
        item._time = Date.now()
        state.item = item
    }
}

export default {
    state,
    mutations
}