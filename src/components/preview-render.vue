<template>
  <div id="preview">
    <component v-for="(item, index) in items" :index="index" :data="item.data" :is="components[item.type]">
    </component>
  </div>
</template>

<style lang="less">
body {
  width: 100%;
  margin: 0 auto;
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

