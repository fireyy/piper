import _ from "lodash"
import { pick, merge, cloneDeep, flow } from "lodash/fp"

import {
  ACTIVE_RENDER_ITEM,
  EDIT_RENDER_ITEM,
  ADD_RENDER_ITEM,
  BLUR_RENDER_ITEM,
  EDIT_DRAG_MODULE,
  EDIT_DRAGING,
  EDIT_RENDER_DATA
} from '../mutation-types'
import {
  modules
} from '../../modules'

import defaultConfig from '../../constants/default'

const state = {
  items: [],
  title: '网页标题',
  config: {},
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
  [ADD_RENDER_ITEM](state, { type, module, index: index = state.items.length + 1, parent: parent = null }) {
    //let module = null

    // _.each(modules, (moduleItem) => {
    //   _.each(moduleItem.items, (item) => {
    //     if (module) return

    //     module = item.type === type && item
    //   })
    // })

    let newItem = flow(
      pick(['type', 'alias', 'data', 'children', 'style']),
      cloneDeep
    )(module)

    // newItem = merge(newItem, { data })

    newItem._timestamp = newItem._timestamp || Date.now()

    if(parent === null) {
      state.items.splice(index, 0, newItem)
    } else {
      state.items[parent].children.push(newItem)
    }

    state.current = newItem
    state.dragInfo = {}
  },

  [EDIT_RENDER_ITEM](state, item) {
    state.current = item
  },

  [EDIT_RENDER_DATA](state, render) {
    if(render.items) state.items = render.items
    state.title = render.title
    state.config = render.config ? render.config : defaultConfig.config
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
