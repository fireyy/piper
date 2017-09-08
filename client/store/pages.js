import api from '@/api'

export const state = () => ({
  pageSize: 10,
  currentPage: 1,
  searchForm: {
    title: '',
    isPublish: -1
  },
  data: [],
  total: 0
})

export const actions = {
  get_list ({ commit, state }) {
    return api.pages.getData({
      size: state.pageSize,
      page: state.currentPage,
      title: state.searchForm.title,
      isPublish: state.searchForm.isPublish
    }).then(res => commit('set_list', {data: res.data})).catch(err => {
      console.log(err)
    })
  },
  remove_item ({ commit, state }, {id, index}) {
    return api.page.removeData(id).then(res => commit('remove_item', index))
  }
}

export const mutations = {
  set_search_form (state, data) {
    state.searchForm = data
  },
  set_page_size (state, pageSize) {
    state.pageSize = pageSize
  },
  set_page (state, page) {
    state.currentPage = page
  },
  remove_item (state, index) {
    state.data.splice(index, 1)
  },
  set_list (state, {data}) {
    state.data = data.data
    state.currentPage = data.page
    state.pageSize = data.size
    state.total = data.total
  }
}
