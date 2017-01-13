<template>
<div class="modules-container">
  <el-tabs type="border-card">
    <el-tab-pane label="组件库">
      <div class="modules" v-for="moduleItem in modules">
        <div class="title">{{moduleItem.title}}</div>
        <ul class="items">
          <li v-for="item in moduleItem.items" title="按住拖拽" @mousedown="drag(item)" class="item">
            <i :class="'el-icon-'+item.icon"></i> {{item.alias}}
          </li>
        </ul>
      </div>
      <drag-drop></drag-drop>
    </el-tab-pane>
    <el-tab-pane label="已添加组件">
      <el-tree :data="items" :default-expand-all="true" node-key="_timestamp" :current-node-key="currentNodeKey" :highlight-current="true" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-tab-pane>
  </el-tabs>
</div>
</template>
<style lang="less">
.modules-container {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs--border-card {
    box-shadow: none;
    border: none;
    .el-tabs__content {
      padding: 1px 0;
    }
  }
  .el-tree {
    border: none;
  }
  .title {
    background: #eff2f7;
    font-size: 15px;
    padding: 5px 10px;
    color: #8492a6;
    border-top: 1px solid #d3dce6;
    border-bottom: 1px solid #d3dce6;
  }
  .items {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    .item {
      color: #8492A6;
      user-select: none;
      width: 50%;
      height: 85px;
      border-right: 1px solid #EFF2F7;
      border-bottom: 1px solid #EFF2F7;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      cursor: move;
      font-size: 13px;
      &:nth-child(2n){
        border-right: 0;
      }
      &:hover {
        color: #475669;
        background: #EFF2F7;
      }
      i {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import {
  modules
} from '../modules'
import dragDrop from './drag-drop.vue'

export default {
  components: {
    dragDrop
  },

  computed: {
    ...mapGetters({
      items: 'renderItems',
      currentModule: 'currentModule'
    }),
    currentNodeKey(){
      return this.currentModule._timestamp ? this.currentModule._timestamp : 0
    }
  },

  methods: {
    ...mapActions([
      'editDragModule',
      'editRenderItem'
    ]),
    drag(item) {
      this.editDragModule(item)
    },
    handleNodeClick(node) {
      this.editRenderItem(node);
    }
  },
  data() {
    return {
      modules,
      defaultProps: {
        children: 'children',
        label: 'alias'
      }
    }
  }
}
</script>
