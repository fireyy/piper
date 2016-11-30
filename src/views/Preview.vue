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
import store from '../vuex/store'
import PreviewRender from '../components/preview-render.vue'
import {
  addRenderItem,
} from '../vuex/actions'

export default {
  store,

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
