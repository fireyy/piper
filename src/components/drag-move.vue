<template>
  <div ref="drag" :style="dragStyle" @click="bindMousedown" class="drag-move">
    <slot></slot>
  </div>
</template>
<style lang="less">
  .drag-move {
    position: absolute;
    &.current {
      outline: 2px solid #2196F3;
    }
  }
</style>
<script>
import interact from 'interactjs'
import { offset } from '../utils'

window.interact = interact
export default {
  props: {
    drag: Boolean,
    pStyle: Object,
    allowKeyMove: Boolean,
    restriction: String
  },

  data() {
    return {}
  },

  computed: {
    dragStyle() {
      return {
        ...this.pStyle,
        opacity: 1
      }
    }
  },

  methods: {
    bindMousedown(event) {
      if (event) event.preventDefault()
      this.$emit('mousedown')
      if (event) event.stopPropagation()
    },
    getPosition(event) {
      let style = event.target.style

      return {
        width: style.width,
        height: style.height,
        top: style.top,
        left: style.left
      }
    },

    setPosition(el, type, value) {
      let typeMap = {
        left: ['left', 'data-x'],
        top: ['top', 'data-y']
      }
      let curMap = typeMap[type]

      el.style[curMap[0]] = `${value}px`
      el.setAttribute(curMap[1], value)
    },

    getPositionStyle(target) {
      let style = null

      if (getComputedStyle(target).position === 'fixed') {
        style = target.getBoundingClientRect()
      } else {
        style = offset(target)
      }

      return style
    }
  },

  mounted() {
    let that = this

    let dragInstance = interact(this.$refs.drag)
      .draggable({
        autoScroll: true,
        enabled: !!this.drag,
        restrict: {
          restriction: that.restriction,
          endOnly: true,
          elementRect: {
            top: 0,
            left: 0,
            bottom: 1,
            right: 1
          }
        },

        // call this function on every dragmove event
        onmove: function dragMoveListener(event) {
          let target = event.target
          let style = that.getPositionStyle(target)

          let x = (parseFloat(target.getAttribute('data-x')) || style.left)
          let y = (parseFloat(target.getAttribute('data-y')) || style.top)

          that.setPosition(target, 'left', x += event.dx)
          that.setPosition(target, 'top', y += event.dy)
        },
        onend: function(event) {
          that.$emit('update', that.getPosition(event))
        }
      })
  },
}
</script>
