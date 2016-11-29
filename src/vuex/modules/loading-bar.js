import {
    CHANGE_LOADING_BAR
} from '../mutation-types'

const state = {
    loading: false
}

const mutations = {
    [CHANGE_LOADING_BAR](state, loadingBarState) {
        state.loading = loadingBarState
    }
}

export default {
    state,
    mutations
}