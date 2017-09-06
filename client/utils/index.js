var styleKey = {
  "backgroundImage": "url(%s)"
}
var styleArr = ['padding','margin']

export function createStyles(data) {
  let styles = {}
  if(data.style) {
    for(let key in data.style.value){
      let val = data.style.value[key].value
      if(!val) continue;
      if(key in styleKey) {
        val = styleKey[key].replace("%s", val)
      }
      if(styleArr.indexOf(key) !== -1) {
        val = val.split(" ").map(a=>`${a}px`).join(" ")
      }
      styles[key] = val
    }
  }
  return styles
}

/**
 *
 * @param {Element} element
 * @return {Object} {top, right, bottom, left} in pixels
 */

export function position (element) {
  var box = element.getBoundingClientRect()
  var scrollTop = window.scrollY
  var scrollLeft = window.scrollX
  // Has to be copied since ClientRects is immutable
  return {
    top: box.top + scrollTop,
    right: box.right + scrollLeft,
    left: box.left + scrollLeft,
    bottom: box.bottom + scrollTop,
    width: box.width,
    height: box.height
  }
}

/**
 * @param {Element} child the subject element
 * @param {Element} [parent] offset will be calculated relative to this element.
 *   This parameter is optional and will default to the offsetparent of the
 *   `child` element
 * @return {Object} {x, y} in pixels
 */

export function offset (child, parent) {
  // default to comparing with the offsetparent
  parent || (parent = offsetParent(child))
  if (!parent) {
    parent = position(child)
    return {
      left: parent.left,
      top: parent.top
    }
  }

  var offset = position(child)
  var parentOffset = position(parent)
  var css = getComputedStyle(child)

  // Subtract element margins
  offset.top  -= parseFloat(css.marginTop)  || 0
  offset.left -= parseFloat(css.marginLeft) || 0

  // Allow for the offsetparent's border
  offset.top  -= parent.clientTop
  offset.left -= parent.clientLeft

  return {
    left: offset.left - parentOffset.left,
    top: offset.top - parentOffset.top
  }
}

/**
 *
 * @param {Element} element
 * @return {Element} if a positioned parent exists
 */

function offsetParent (element) {
  var parent = element.offsetParent
  while (parent && getComputedStyle(parent).position === "static") {
    parent = parent.offsetParent
  }
  return parent
}


/**
 * 获得拖拽元素标签和应该出现的位置
 * @param event
 * @returns {{dragTag: string, position: string}}
 */
export function getDragInfo(event) {
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
