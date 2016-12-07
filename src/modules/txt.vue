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

export default {
  props: ['data'],
  computed: {
    customStyle() {
      let styles = {}
      if(this.data.style) {
        for(let key in this.data.style.value){
          styles[key] = this.data.style.value[key].value
        }
      }
      return styles
    }
  },
  data() {
    return {}
  }
}
</script>
