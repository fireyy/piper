<template>
  <div @click="blurRenderItem" class="render-container">
    <div drag-tag="modules" :class="{active: activeModules}" class="body">
      <input class="page-title animated" :class="{flash:base.activeDocumentTitle}" type="text" ref="documentTitle" v-model="render.title">
      <div class="item" :key="index" v-bind:key="item._timestamp" :class="{'current': currentModule === item}" v-for="(item, index) in items">
        <sort-bar @on-sort="onSort" v-show="currentModule === item" :items="items" :item="item">
          <el-tooltip content="拖拽" placement="top" v-if="items.length > 1">
            <li>
              <i class="el-icon-d-caret" @mousedown="drag(item)"></i>
            </li>
          </el-tooltip>
        </sort-bar>
        <div :drag-tag="'module-'+index" @click.stop.prevent="editRenderItem(item)" :index="index" class="component" :class="[{active: activeModule.dragTag === 'module-' + index}, activeModule.position]">
          <component :data="item.data" :is="components[item.type]">
          </component>
        </div>
      </div>
    </div>
    <module-drag></module-drag>
  </div>
</template>
<style lang="less" scoped>
  .render-container {
    overflow-y: auto;
    .body {
      width: 375px;
      min-height: 667px;
      background: #fff url("../assets/img/phone-head.png") no-repeat;
      padding-top: 64px;
      margin: 20px auto 30px;
      user-select: none;
      box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.30);
      position: relative;
      .page-title {
        color: #fff;
        border: none;
        font-size: 20px;
        text-align: center;
        position: absolute;
        top: 27px;
        left: 73px;
        width: 210px;
        background: transparent;
      }
      &.active {
        outline: 2px solid #2196F3;
      }
      .item {
        cursor: pointer;
        position: relative;
        &.current {
          outline: 2px solid #2196F3;
          z-index: 998;
        }
      }
      .component {
        &.active.top {
          &:before {
            width: 98%;
            height: 20px;
            line-height: 20px;
            margin: 0 auto;
            font-size: 14px;
            text-align: center;
            display: block;
            content: '放在这';
            border: 2px dashed #2196F3;
            background: #E4F3FE;
            padding: 5px 0;
            color: #2196F3;
          }
        }
        &.active.bottom {
          &:after:extend(.component.active.top:before) {
            //
          }
        }
      }
    }
  }

</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import {
  components,
  modules
} from '../modules'
import moduleDrag from './module-drag.vue'
import sortBar from './sort-bar.vue'

export default {
  components: {
    ...components,
    moduleDrag,
    sortBar
  },

  mounted() {
    // 模拟移动端rem大小环境
    setFontSize()
    window.addEventListener("resize", setFontSize)

    function setFontSize() {
      document.documentElement.style.fontSize = `${(document.querySelector('[drag-tag="modules"]').clientWidth) * 20 / 320}px`
    }
  },

  watch: {
    'base.activeDocumentTitle' (newVal) {
      this.$refs.documentTitle.focus()
      this.$refs.documentTitle.addEventListener('webkitAnimationEnd', () => {
        this.base.activeDocumentTitle = false
      })
    }
  },

  computed: mapGetters({
    base: 'base',
    render: 'render',
    items: 'renderItems',
    activeModules: 'activeModules',
    activeModule: 'activeModule',
    currentModule: 'currentModule'
  }),

  methods: {
    ...mapActions([
      'editRenderItem',
      'blurRenderItem',
      'editDragModule'
    ]),
    drag(item) {
      var index = this.items.indexOf(item);
      this.items.splice(index, 1)
      this.editDragModule(item)
    },
    onSort(newIndex, oldIndex) {
      setTimeout(() => {
        this.editRenderItem(this.items[newIndex]);
        //this.$store.commit('EDIT_RENDER_ITEM', this.items[newIndex])
      }, 0)
    }
  },

  data() {
    return {
      modules,
      components
    }
  }
}
</script>
