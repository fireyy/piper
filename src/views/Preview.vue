<template>
  <preview-render :items="data.items">
  </preview-render>
</template>

<style lang="less">
body,
html {
    margin: 0;
    padding: 0;
}
</style>

<script>
import PreviewRender from '../components/preview-render.vue'

export default {

  components: {
    PreviewRender
  },

  computed: {
    data() {
      return window.PIPER_DATA || window.parent.DATA
    }
  }
}
</script>
