import {
    ADD_RENDER_ITEM,
    ACTIVE_RENDER_ITEM,
    EDIT_RENDER_ITEM,
    BLUR_RENDER_ITEM,
    FOCUS_DOCUMENT_TITLE
} from './mutation-types'

export const addRenderItem    = markAction(ADD_RENDER_ITEM)
export const editRenderItem   = markAction(EDIT_RENDER_ITEM)
export const blurRenderItem   = markAction(BLUR_RENDER_ITEM)
export const focusDocumentTitle   = markAction(FOCUS_DOCUMENT_TITLE)
export const activeRenderItem = ({dispatch}, event) => {
    dispatch(ACTIVE_RENDER_ITEM, getDragInfo(event))
}
export const dropRenderItem   = ({dispatch}, event, module) => {
    let {dragTag, position} = getDragInfo(event)

    if (dragTag) {
        let data = module.data || null

        if (dragTag === 'modules') {
            dispatch(ADD_RENDER_ITEM, module.type, data)
        } else {
            let index = +(dragTag.split('-')[1])
            dispatch(ADD_RENDER_ITEM, module.type, data, position === 'bottom' ? ++index : index)
        }
    }

    return dragTag
}

/**
 * 通用的dispatch
 * @param type
 * @returns {function(): *}
 */
function markAction(type) {
    //return ({dispatch}, ...args) => dispatch(type, ...args)
    return ({dispatch}, ...args) => {
      if(type == "EDIT_RENDER_ITEM") console.log("EDIT_RENDER_ITEM");
      if(type == "BLUR_RENDER_ITEM") console.log("BLUR_RENDER_ITEM");
      return dispatch(type, ...args)
    }
}


/**
 * 获得拖拽元素标签和应该出现的位置
 * @param event
 * @returns {{dragTag: string, position: string}}
 */
function getDragInfo(event) {
    let dragTarget = getDragTarget(event.target)
    let dragTag    = dragTarget && dragTarget.getAttribute('drag-tag')
    let position   = getDragPosition(event, dragTarget)

    return {
        dragTag, position
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
        let rect       = dragTarget.getBoundingClientRect()
        let halfHeight = rect.height / 2

        return halfHeight > event.y - rect.top ? 'top' : 'bottom'
    }
}
