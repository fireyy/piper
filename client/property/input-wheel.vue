<template>
    <el-form-item :label="label" :prop="prop">
      <div class="piper-wheels">
        <div class="piper-wheel-item" :class="'piper-wheel-item-'+klass[index]" v-for="(item, index) in sliders" :key="index" :data-index="index" draggable="true" @dragstart="dragstartHandler" @drag="dragHandler" @dragend="dragendHandler" :title="lang.wheel[index]">
          <el-popover
            :placement="klass[index]"
            trigger="click">
            <el-input-number size="small" :value="item" @change="val=>handleChange(val, index)"></el-input-number>
            <div class="drag-handler" slot="reference">{{item}}</div>
          </el-popover>
        </div>
      </div>
    </el-form-item>
</template>
<script>
import common from './common'
import lang from '../constants/lang'

export default {
  mixins: [common],

  computed: {
    sliders: {
      get () {
        return this.data.value.split(' ').map(a=>parseInt(a, 10))
      }
    }
  },

  methods: {
    handleChange (val, index) {
      this.handleInput(val, index)
    },
    handleInput (val, index) {
      val = val < 0 ? 0 : val;
      this.sliders[index] = val;
      this.data.value = this.sliders.join(' ')
    },
    dragstartHandler (e) {
      e.dataTransfer.setDragImage(new Image(), 10, 10);
      this.drag = this.getScreenData(e) + this.sliders[e.target.dataset.index]
    },
    dragHandler (e) {
      this.setDragSize(e)
    },
    dragendHandler (e) {
      this.setDragSize(e)
    },
    getScreenData (e) {
      return e[e.target.dataset.index % 2 == 1 ? 'x' : 'y']
    },
    setDragSize (e) {
      if (e.x == 0 || e.y == 0) return ;
      let index = e.target.dataset.index
      let val = index == 1 || index == 2 ? this.getScreenData(e) - this.drag : this.drag - this.getScreenData(e)
      this.handleInput(val, index)
    }
  },

  data() {
    return {
      drag: 0,
      lang: lang,
      klass: ['top', 'right', 'bottom', 'left']
    }
  }
}
</script>
<style lang="less">
.piper-wheels {
  position: relative;
  width: 100px;
  height: 100px;
  .piper-wheel-item {
    position: absolute;
    background-color: #EFF2F7;
    line-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 15;
    &:hover {
      color: #fff;
      background-color: #58B7FF;
      z-index: 18;
    }
    &.piper-wheel-item-top {
      top: 0;
      left: 0;
      right: 0;
      border-radius: 200em 200em 0 0;
      cursor: n-resize;
    }
    &.piper-wheel-item-right {
      width: 20px;
      top: 0;
      bottom: 0;
      right: 0;
      border-radius: 0 200em 200em 0;
      cursor: e-resize;
    }
    &.piper-wheel-item-bottom {
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 0 0 200em 200em;
      cursor: s-resize;
    }
    &.piper-wheel-item-left {
      width: 20px;
      top: 0;
      bottom: 0;
      left: 0;
      border-radius: 200em 0 0 200em;
      cursor: w-resize;
    }
    .drag-handler {
      display: inline-block;
      vertical-align: middle;
    }
    .piper-wheel-title {
      float: left;
    }
    .el-slider__runway {
      margin-left: 50px;
    }
  }
}
</style>
