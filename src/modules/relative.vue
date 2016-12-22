<template>
<div class="module-container">
  <div class="placeholder" :style="customStyle"></div>
</div>
</template>
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
