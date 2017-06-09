import * as t from './mutation-types'
import router from '@/router'

const makeAction = (type) => (
    ({ commit }, payload) => commit(type, payload)
);

const makeActions = mutations => (
    Object.keys(mutations).reduce((actions, type) => {
        actions[type] = makeAction(normalMutations[type]);
        return actions;
    }, {})
);

// 可以简单处理的 mutation
const normalMutations = {
  addRenderItem: t.ADD_RENDER_ITEM,
  editRenderItem: t.EDIT_RENDER_ITEM,
  editDragModule: t.EDIT_DRAG_MODULE,
  blurRenderItem: t.BLUR_RENDER_ITEM,
  focusDocumentTitle: t.FOCUS_DOCUMENT_TITLE,
  editDraging: t.EDIT_DRAGING,
  editRenderData: t.EDIT_RENDER_DATA,
  editModuleData: t.EDIT_MODULE_DATA,
  resetRenderState: t.RESET_RENDER_STATE
};

// 跳转登录
const redirectLogin = ({
  state
}) => {
  router.replace({ path: '/login'});
}

const activeRenderItem = ({
  commit
}, event) => {
  commit(t.ACTIVE_RENDER_ITEM, getDragInfo(event))
}
const dropRenderItem = ({
  state,
  commit
}, event) => {
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


/**
 * 获得拖拽元素标签和应该出现的位置
 * @param event
 * @returns {{dragTag: string, position: string}}
 */
function getDragInfo(event) {
  let dragTarget = getDragTarget(event.target)
  let dragTag = dragTarget && dragTarget.getAttribute('drag-tag')
  let position = getDragPosition(event, dragTarget)

  return {
    dragTag,
    position
  }
}

/**
 * 获得拖拽元素的标签名
 * @param target
 * @returns {string}
 */
function getDragTarget(target) {
  let currentNode = target

  while (currentNode) {
    if (currentNode.getAttribute && currentNode.getAttribute('drag-tag')) {
      return currentNode
    }

    currentNode = currentNode.parentNode
  }
}

/**
 * 判断拖拽元素应该出现的位置
 * @param event
 * @param dragTarget
 * @returns {string}
 */
function getDragPosition(event, dragTarget) {
  if (dragTarget) {
    let isDragZone = dragTarget.getAttribute('drag-zone')
    let rect = dragTarget.getBoundingClientRect()
    let halfHeight = rect.height / 2

    if(isDragZone) {
      let position = 'inner', spaceing = 30

      if(event.y - rect.top <= spaceing) {
        position = 'top'
      }

      if (rect.height - (event.y - rect.top) <= spaceing) {
        position = 'bottom'
      }

      return position
    } else {
      return halfHeight > event.y - rect.top ? 'top' : 'bottom'
    }
  }
}

export default {
    ...makeActions(normalMutations),
    activeRenderItem,
    dropRenderItem,
    redirectLogin
};
