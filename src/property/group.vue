<template>
<div class="group-items">
  <div class="group-item" v-for="(item, index) in data.value" v-bind:key="index">
    <component v-for="(obj, key) in item" :key="key" :index="key" :title="key | lang" :data="obj" :is="obj.type"></component>
  </div>
  <div class="btn-area text-center">
    <el-button type="primary" icon="plus" @click="handleAdd" v-if="left > 0">加一项</el-button>
  </div>
</div>
</template>
<style lang="less">
.group-items {
  counter-reset: group;
  .group-item {
    position: relative;
    &:before {
      counter-increment: group;
      content: counter(group) ". ";
      font-size: 40px;
      color: #eee;
      background-color: #fff;
      width: 70px;
      text-align: center;
      position: absolute;
      top: 30px;
      left: 0;
    }
    .el-form-item__label {
      text-align: right;
    }
  }
  .btn-area {
    border-top: 1px solid #EFF2F7;
    padding-top: 10px;
  }
}
</style>
<script>
import Vue from 'vue'
import components from './input.js'

export default {
  components,
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    left() {
      return this.data.options.max - this.data.value.length
    }
  },

  methods: {
    handleAdd() {
      let tmp = _.cloneDeep(this.data.value[0])
      _.forEach(tmp, (value, key, obj) => obj[key].value = null)
      this.data.value.push(tmp)
    }
  },

  data() {
    return {
    }
  }
}
</script>
