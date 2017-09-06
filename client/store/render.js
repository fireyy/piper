import _ from "lodash"
import { pick, merge, cloneDeep, flow } from "lodash/fp"
import { getDragInfo } from "~/utils"

import {
  ACTIVE_RENDER_ITEM,
  EDIT_RENDER_ITEM,
  ADD_RENDER_ITEM,
  BLUR_RENDER_ITEM,
  EDIT_DRAG_MODULE,
  EDIT_DRAGING,
  EDIT_RENDER_DATA,
  EDIT_MODULE_DATA,
  RESET_RENDER_STATE
} from './mutation-types'

import defaultConfig from '~/constants/default'

const createDefaultState = (data) => {
  data.items = []
  data.title = '网页标题'
  data.config = _.cloneDeep(defaultConfig)
  data.current = {}
  data.dragInfo = {}
  data.dragModule = {}
  data.draging = false
}

const state = {}
createDefaultState(state)

const normalMutations = {
  addRenderItem: ADD_RENDER_ITEM,
  editRenderItem: EDIT_RENDER_ITEM,
  editDragModule: EDIT_DRAG_MODULE,
  blurRenderItem: BLUR_RENDER_ITEM,
  editDraging: EDIT_DRAGING,
  editRenderData: EDIT_RENDER_DATA,
  editModuleData: EDIT_MODULE_DATA,
  resetRenderState: RESET_RENDER_STATE
};

const makeAction = (type) => (
  ({ commit }, payload) => commit(type, payload)
);

const makeActions = mutations => (
  Object.keys(mutations).reduce((actions, type) => {
      actions[type] = makeAction(normalMutations[type]);
      return actions;
  }, {})
);

const actions = {
  ...makeActions(normalMutations),
  activeRenderItem ({ commit }, event) {
    commit(t.ACTIVE_RENDER_ITEM, getDragInfo(event))
  },
  dropRenderItem ({ state, commit }, event) {
    let module = state.render.dragModule
    let {
      dragTag,
      position
    } = getDragInfo(event)

    if (dragTag) {
      let data = module.data || null

      if (dragTag === 'modules') {
        commit(t.ADD_RENDER_ITEM, {
          type: module.type,
          module: module
        })
      } else {
        let index = +(dragTag.split('-')[1])
        commit(t.ADD_RENDER_ITEM, {
          type: module.type,
          module: module,
          index: position === 'bottom' ? ++index : index,
          parent: position === 'inner' ? index : null
        })
      }
    }

    return dragTag
  }
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

  [EDIT_MODULE_DATA](state, item) {
    let index = state.items.indexOf(item)
    if(index !== -1) state.items.splice(index, 1, item)
  },

  [EDIT_RENDER_DATA](state, render) {
    if(render.items) state.items = render.items
    state.title = render.title
    state.config = Object.assign(_.cloneDeep(defaultConfig), render.config || {})
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
  },

  [RESET_RENDER_STATE](state, store) {
    createDefaultState(state)
  }
}
