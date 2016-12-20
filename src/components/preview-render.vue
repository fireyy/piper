<template>
  <div id="preview">
    <component v-for="(item, index) in items" :index="index" :data="item.data" :is="components[item.type]">
    </component>
  </div>
</template>

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

