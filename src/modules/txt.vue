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
import _ from 'lodash'

export default {
  props: ['data'],
  computed: {
    customStyle() {
      let styles = {}
      this.data.style && _.each(this.data.style.value, (item, key) => {
        styles[key] = item.value
      })
      
      return styles
    }
  },
  data() {
    return {}
  }
}
</script>
