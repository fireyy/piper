<template>
<div class="module-box">
  <div class="modules" v-for="moduleItem in modules">
    <div class="title">{{moduleItem.title}}</div>
    <ul class="items">
      <li v-for="item in moduleItem.items" title="按住拖拽" @mousedown="drag(item)" class="item">
        <i :class="'el-icon-'+item.icon"></i> {{item.alias}}
      </li>
    </ul>
  </div>
  <drag-drop></drag-drop>
</div>
</template>
<style lang="less" scoped>
.module-box {
  .title {
    background: #eee;
    font-size: 15px;
    padding: 5px 10px;
    border-bottom: 1px solid #E7E8E7;
  }
  .items {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    .item {
      user-select: none;
      width: 50%;
      height: 85px;
      border-right: 1px solid #E7E8E7;
      border-bottom: 1px solid #E7E8E7;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-flow: column;
      cursor: move;
      font-size: 13px;
      &:nth-child(2n){
        border-right: 0;
      }
      i {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'
import {
  modules
} from '../modules'
import dragDrop from './drag-drop.vue'

export default {
  components: {
    dragDrop
  },

  methods: {
    ...mapActions([
      'editDragModule'
    ]),
    drag(item) {
      this.editDragModule(item)
    }
  },
  data() {
    return {
      modules
    }
  }
}
</script>
