<template>
<div v-show="show" :class="{'miss-drop': hitDrop, 'can-drop': dragInfo.dragTag}" class="drag-module">
  <component v-if="!currentModule.data" v-bind:is="currentModule.type">
  </component>
  <component v-if="currentModule.data" v-bind:data="currentModule.data" v-bind:is="currentModule.type">
  </component>
</div>
</template>
<style lang="less">
.drag-module {
    width: 375px;
    display: inline-block;
    position: fixed;
    left: 0;
    top: 0;
    cursor: pointer;
    opacity: 0.8;
    margin: -20px 0 0;
    pointer-events: none;
    transform: scale(0.6);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.50);
    z-index: 999;
    background: #fff;
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import {
  components,
  modules
} from '../modules'

export default {

  components: components,

  computed: {
    ...mapGetters({
      dragInfo: 'dragInfo',
      dragModule: 'dragModule',
      draging: 'draging'
    })
  },
  watch: {
    dragModule: function(newVal) {
      this.show = !(_.isEmpty(newVal))
  
      if (this.show && !this.draging) {
        this.editDraging(true)
        this.hitDrop = false
        this.currentModule = newVal
        this.startDrag()
      }
    }
  },

  methods: {
    ...mapActions([
      'addRenderItem',
      'activeRenderItem',
      'dropRenderItem',
      'blurRenderItem',
      'editDragModule',
      'editDraging'
    ]),
    startDrag() {
      let that = this

      this.blurRenderItem()

      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', function upEvent(event) {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', upEvent)
        that.stopDrag(event)
      })

      onMove()

      function onMove(event = window.event) {
        let el = that.$el

        that.activeRenderItem(event)
        setTimeout(() => {
          el.style.left = `${event.clientX - el.clientWidth / 2}px`
          el.style.top = `${event.clientY - el.clientHeight / 2}px`
        })
      }
    },

    stopDrag(event) {
      setTimeout(() => {
        this.hitDrop = this.dropRenderItem(event)
        this.editDragModule({})
        this.editDraging(false)
      }, 0)
    }
  },

  data() {
    return {
      show: false,
      hitDrop: false,
      currentModule: {}
    }
  }
}
</script>
