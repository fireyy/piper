import {
  ACTIVE_RENDER_ITEM,
  EDIT_RENDER_ITEM,
  ADD_RENDER_ITEM,
  BLUR_RENDER_ITEM,
  EDIT_DRAG_MODULE,
  EDIT_DRAGING
} from '../mutation-types'
import {
  modules
} from '../../modules'

const state = {
  items: [],
  title: '网页标题',
  current: {},
  dragInfo: {},
  dragModule: {},
  draging: false
}

const getters = {
  activeModules: state => state.dragInfo.dragTag === 'modules',
  activeModule: state => state.dragInfo,
  currentModule: state => state.current,
  dragInfo: state => state.dragInfo,
  draging: state => state.draging,
  dragModule: state => state.dragModule,
  render: state => state,
  renderItems: state => state.items
}

const mutations = {
  [ADD_RENDER_ITEM](state, { type, data, index: index = state.items.length + 1 }) {
    console.log("index", index);
    let module = null

    _.each(modules, (moduleItem) => {
      _.each(moduleItem.items, (item) => {
        if (module) return

        module = item.type === type && item
      })
    })

    let newItem = _.chain(module).pick(['type', 'alias', 'data']).cloneDeep().merge({
      data
    }).value()

    newItem._timestamp = newItem._timestamp || Date.now()
    console.log("1", state.items);
    state.items.splice(index, 0, newItem)
    state.current = newItem
    state.dragInfo = {}
    console.log("2", state.items);
  },

  [EDIT_RENDER_ITEM](state, item) {
    state.current = item
  },
  
  [EDIT_DRAG_MODULE](state, dragModule) {
    state.dragModule = dragModule
  },
  
  [EDIT_DRAGING](state, draging) {
    state.draging = draging
  },

  [ACTIVE_RENDER_ITEM](state, dragInfo) {
    state.dragInfo = dragInfo
  },

  [BLUR_RENDER_ITEM](state) {
    state.current = {}
  }
}

export default {
  state,
  getters,
  mutations
}
