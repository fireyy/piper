<template>
  <div ref="drag" :style="dragStyle" @click="bindClick" @mousedown="bindMousedown" class="drag-move">
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
import {
  mapMutations
} from 'vuex'
import interact from 'interactjs'
import { offset } from '../utils'

window.interact = interact
export default {
  props: {
    drag: Boolean,
    resize: Boolean,
    pStyle: Object,
    className: String,
    allowKeyMove: Boolean,
    restriction: String,
    handle: String,
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
    bindClick() {
      this.$emit('click')
    },
    bindMousedown() {
      this.$emit('mousedown')
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
      this.SET_MOVING(true)
    },

    getPositionStyle(target) {
      let style = null

      if (getComputedStyle(target).position === 'fixed') {
        style = target.getBoundingClientRect()
      } else {
        style = offset(target)
      }

      return style
    },

    movePosition(direction, value = 1) {
      let target = this.$refs.drag
      let style = this.getPositionStyle(target)

      switch (direction) {
        case 't':
          this.setPosition(target, 'top', style.top -= 1)
          break;

        case 'r':
          this.setPosition(target, 'left', style.left += 1)
          break;

        case 'b':
          this.setPosition(target, 'top', style.top += 1)
          break;

        case 'l':
          this.setPosition(target, 'left', style.left -= 1)
          break;

        default:
          //
      }
    },

    ...mapMutations([
      'SET_MOVING'
    ]),
  },

  created() {
    let keyMap = {
      38: 't',
      39: 'r',
      40: 'b',
      37: 'l'
    }

    // $(document)
    //   .on('keydown', (event) => {
    //     if (!this.allowKeyMove || !keyMap[event.keyCode] || event.target.tagName === 'INPUT') return

    //     this.movePosition(keyMap[event.keyCode])
    //     this.$emit('update', this.getPosition({
    //       target: this.$refs.drag
    //     }))
    //     event.preventDefault()
    //   })
    //   .on('keyup', () => {
    //     this.SET_MOVING(false)
    //   })
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

          // 没有宽高时, 要设置宽高
          if (that.pStyle && (!that.pStyle.width || !that.pStyle.height)) {
            let childStyle = target.childNodes[0].getBoundingClientRect()

            target.style.width = `${childStyle.width}px`
            target.style.height = `${childStyle.height}px`
          }

          that.setPosition(target, 'left', x += event.dx)
          that.setPosition(target, 'top', y += event.dy)
        },
        // call this function on every dragend event
        onend: function(event) {
          that.$emit('update', that.getPosition(event))
          that.SET_MOVING(false)
        }
      })

    if (that.handle) dragInstance.allowFrom(that.handle)
  },
}
</script>
