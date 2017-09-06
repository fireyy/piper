<template>
  <div id="preview">
    <component v-for="(item, index) in items" :key="index" :index="index" :data="item.data" :is="components[item.type]">
      <component class="children" v-if="item.children && item.children.length > 0" v-for="(child, childIndex) in item.children" :key="childIndex" :index="childIndex" :data="child.data" :is="components[child.type]" :style="child.style"></component>
    </component>
  </div>
</template>
<style lang="less">
.children {
  position: absolute;
}
</style>
<script>
import Vue from 'vue'
import {
  components,
  modules
} from '../modules'

export default {
  props: ['items'],

  components,

  ready() {

  },

  data: () => {
    return {
      modules,
      components
    }
  }
}
</script>

