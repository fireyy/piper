import {
  FOCUS_DOCUMENT_TITLE,
  CHANGE_LOADING_BAR,
  SET_USER
} from '@/constants/mutation-types'

export const strict = false

export const state = () => ({
  user: null,
  activeDocumentTitle: false,
  loading: false
})

export const getters = {
  base: state => state,
  loading: state => state.loading
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (req.user) {
      commit('SET_USER', req.user)
    }
  },
  focusDocumentTitle ({commit}, active) {
    commit(FOCUS_DOCUMENT_TITLE, active)
  }
}

export const mutations = {
  [SET_USER](state, user) {
    state.user = user
  },
  [FOCUS_DOCUMENT_TITLE](state, active = true) {
    state.activeDocumentTitle = active
  },
  [CHANGE_LOADING_BAR](state, loadingBarState) {
    state.loading = loadingBarState
  }
}
