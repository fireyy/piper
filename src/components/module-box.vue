<template>
  <div class="module-box">
    <div class="modules" v-for="moduleItem in modules">
      <div class="title">{{moduleItem.title}}</div>
      <ul class="items">
        <li @mousedown="drag(item)" aria-label="按住拖拽" class="item hint--top" v-for="item in moduleItem.items">
          <i :class="'el-icon-'+item.icon"></i> {{item.alias}}
        </li>
      </ul>
    </div>
    <module-drag :drag-module="dragModule" v-on:changeDragModule="changeDragModule">
    </module-drag>
  </div>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  .module-box {
    .title {
      background: #eee;
      font-size: 15px;
      margin-bottom: 5px;
      padding: 12px 10px;
      border-bottom: 1px solid #E7E8E7;
    }
    .items {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      padding: 0 14px;
      .item {
        user-select: none;
        min-width: 95px;
        height: 85px;
        border: 1px solid #E7E8E7;
        margin: 5px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-flow: column;
        cursor: move;
        font-size: 13px;
        i {
          margin-bottom: 10px;
        }
      }
    }
  }

</style>
<script type="text/ecmascript-6">
    import {modules} from '../modules'
    import moduleDrag from './module-drag.vue'

    export default{
        components: {
            moduleDrag
        },

        methods : {
            changeDragModule(dragModule) {
                this.dragModule = dragModule
            },
            drag(item) {
                this.dragModule = item
                console.log(item)
            }
        },
        computed: {},
        data() {
            return {
                modules,
                dragModule: {}
            }
        }
    }
</script>
