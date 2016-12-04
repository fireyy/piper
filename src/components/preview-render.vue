<template>
  <div>
    <component v-for="(item, index) in items" :index="index" :data="item.data" :is="components[item.type]">
    </component>
  </div>
</template>

<style lang="less">
body {
  width: 16rem;
  margin: 0 auto;
}
</style>

<script>
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

