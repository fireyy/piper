<template>
  <preview-render :items="items">
  </preview-render>
</template>

<style lang="less" scoped>
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

  beforeCreate() {
    document.title = window.parent.DATA.title
  },

  data: () => {
    return {
      items: window.parent.DATA.items
    }
  }
}
</script>
