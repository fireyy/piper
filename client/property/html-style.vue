<template>
  <div>
    <component v-for="(item, key) in data.value" :key="key" :index="key" :title="key | lang" :data="item" :is="item.type"></component>
  </div>
</template>

<script>
import components from './input.js'
export default {
  components,
  props: {
    data: {
      type: Object
    }
  },

  data() {
    return {}
  }
}
</script>
