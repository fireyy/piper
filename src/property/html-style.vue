<template>
  <div>
    <component v-for="(item, key) in data.value" :index="key" :title="key | lang" :data="item" :is="item.type" :rules="getRules(item)"></component>
  </div>
</template>

<script>
import components from './input.js'
import { getRules } from '../utils'
export default {
  components,
  props: {
    data: {
      type: Object
    }
  },

  methods: {
    getRules(item){
      return getRules(item)
    }
  },

  data() {
    return {}
  }
}
</script>
