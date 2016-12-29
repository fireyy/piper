<template>
<div class="module-container">
  <div class="placeholder relative" :style="customStyle">
    <slot></slot>
  </div>
</div>
</template>
<style>
.relative {
  position: relative;
}
</style>
<script>
import { createStyles } from '../utils'
export default {
  props: ['data'],
  computed: {
    customStyle() {
      return createStyles(this.data)
    }
  },
  data() {
    return {}
  }
}
</script>
