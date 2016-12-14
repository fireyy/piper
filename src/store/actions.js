import * as t from './mutation-types'

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
  editRenderData: t.EDIT_RENDER_DATA
};

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
  console.log('module', module)
  let {
    dragTag,
    position
  } = getDragInfo(event)

  if (dragTag) {
    let data = module.data || null

    if (dragTag === 'modules') {
      commit(t.ADD_RENDER_ITEM, {
        type: module.type,
        data: data
      })
    } else {
      let index = +(dragTag.split('-')[1])
      commit(t.ADD_RENDER_ITEM, {
        type: module.type,
        data: data,
        index: position === 'bottom' ? ++index : index
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
    let rect = dragTarget.getBoundingClientRect()
    let halfHeight = rect.height / 2

    return halfHeight > event.y - rect.top ? 'top' : 'bottom'
  }
}

export default {
    ...makeActions(normalMutations),
    activeRenderItem,
    dropRenderItem
};
