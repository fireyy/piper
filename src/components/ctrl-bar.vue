<template>
<ul class="ctrl-actions">
  <slot></slot>
  <el-tooltip content="上移" placement="top" v-if="index !== 0 && !hideSort">
    <li>
      <i class="el-icon-arrow-up" @click="move('up',item)"></i>
    </li>
  </el-tooltip>
  <el-tooltip content="下移" placement="top" v-if="index !== items.length - 1 && !hideSort">
    <li>
      <i class="el-icon-arrow-down" @click="move('down',item)"></i>
    </li>
  </el-tooltip>
  <el-tooltip content="删除" placement="top">
    <li>
      <i class="el-icon-delete" @click="del(item)"></i>
    </li>
  </el-tooltip>
</ul>
</template>
<style lang="less">
.ctrl-actions {
    background: #2196F3;
    z-index: 1000;
    padding: 5px;
    position: absolute;
    right: 0;
    top: 0;
    li {
        display: inline-block;
        color: #fff;
        margin: 0 8px;
    }
    &:hover {
        overflow: visible;
    }
}
</style>
<script>
export default {
  props: {
    items: {
      type: Array
    },
    item: {
      type: Object
    },
    hideSort: Boolean
  },
  data() {
    return {
      renderData: []
    }
  },

  computed: {
    index() {
      return this.items.indexOf(this.item)
    }
  },

  methods: {
    move(type, item) {
      let index = this.index

      switch (type) {
        case 'up':
          this.order(index - 1, index)
          break;

        case 'down':
          this.order(index + 1, index)
          break;

        default:
          throw new Error('type is not defined')
      }
    },
    del(item) {
      var index = this.items.indexOf(item)
      this.items.splice(index, 1)
    },
    order(newIndex, oldIndex) {
      this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0])
      this.$emit('on-sort', newIndex, oldIndex)
    }
  }
}
</script>
