<template>
<div class="module-container">
  <div class="text">
    <div class="ph-empty dashed" :style="customStyle">
      {{data.content.value}}
    </div>
  </div>
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
