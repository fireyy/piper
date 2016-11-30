<template>
  <div>
    <component v-for="(item, index) in items" :index="index" :data="item.data" :is="components[item.type]">
    </component>
  </div>
</template>

<style lang="less" rel="stylesheet/less">
body {
  width: 16rem;
  margin: 0 auto;
}
</style>

<script type="text/ecmascript-6">
import Vue from 'vue'
import {
  components,
  modules
} from '../modules'
import '../assets/lib/hotcss'

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

