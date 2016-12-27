<template>
<div class="group-items">
  <div class="group-item" v-for="(item, index) in data.value" v-bind:key="index">
    <component v-for="(obj, key) in item" :index="key" :title="key | lang" :data="obj" :is="obj.type" :rules="getRules(obj)"></component>
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
  }
}
</style>
<script>
import Vue from 'vue'
import components from './input.js'
import { getRules } from '../utils'

export default {
  components,
  props: {
    data: {
      type: Object
    }
  },
  created() {
    let diff = this.data.options.max - this.data.value.length

    if (diff > 0) {
      while (diff--) {
        this.data.value.push(
          {
            'link': {
              type: 'inputText',
              value: null,
            },
            'image': {
              type: 'inputImage',
              value: null
            }
          }
        )
      }
    }
  },

  methods: {
    getRules(item){
      return getRules(item)
    }
  },

  data() {
    return {
    }
  }
}
</script>
