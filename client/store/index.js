import {
  FOCUS_DOCUMENT_TITLE,
  CHANGE_LOADING_BAR
} from './mutation-types'

const state = {
  activeDocumentTitle: false,
  loading: false
}

const getters = {
  base: state => state,
  loading: state => state.loading
}

// 跳转登录
const redirectLogin = ({
  state
}) => {
  // TODO: 跳转到登录页面
  // router.replace({ path: '/login'});
}

export const actions = {
  focusDocumentTitle ({commit}, active) {
    commit(FOCUS_DOCUMENT_TITLE, active)
  },
  redirectLogin
}

const mutations = {
  [FOCUS_DOCUMENT_TITLE](state, active = true) {
    state.activeDocumentTitle = active
  },
  [CHANGE_LOADING_BAR](state, loadingBarState) {
    state.loading = loadingBarState
  }
}
