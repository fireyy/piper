<template>
  <ul class="actions">
    <slot></slot>
    <li class="hint--top" aria-label="上移" v-if="index !== 0">
      <i class="el-icon-arrow-up" @click="move('up',item)"></i>
    </li>
    <li class="hint--top" aria-label="下移" v-if="index !== items.length - 1">
      <i class="el-icon-arrow-down" @click="move('down',item)"></i>
    </li>
    <li class="hint--top" aria-label="删除">
      <i class="el-icon-delete" @click="del(item)"></i>
    </li>
  </ul>
</template>
<style lang="less" rel="stylesheet/less" scoped>
  .actions {
    background: #2196F3;
    z-index: 10000;
    padding: 5px;
    position: absolute;
    right: 0;
    top: 0;
    li {
      color: #fff;
    }
    &:hover {
      overflow: visible;
    }
    li:not(:first-child) {
      margin: 0 0 0 8px;
    }
  }

</style>
<script type="text/ecmascript-6">
    export default {
        props: {
            items: {
                type: Array
            },
            item : {
                type: Object
            }
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
            move(type, item){
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
