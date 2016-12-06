import {
  FOCUS_DOCUMENT_TITLE,
  CHANGE_LOADING_BAR
} from '../mutation-types'

const state = {
  activeDocumentTitle: false,
  loading: false
}

const getters = {
  base: state => state,
  loading: state => state.loading
}

const mutations = {
  [FOCUS_DOCUMENT_TITLE](state, active = true) {
    state.activeDocumentTitle = active
  },
  [CHANGE_LOADING_BAR](state, loadingBarState) {
    state.loading = loadingBarState
  }
}

export default {
  state,
  getters,
  mutations
}
