<template>
  <preview-render :items="data.items" :style="customStyle">
  </preview-render>
</template>

<style lang="less">
@import '~_base.less';

body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}
#preview {
  height: 100%;
}
</style>

<script>
import PreviewRender from '../components/preview-render.vue'
import { createStyles } from '../utils'

export default {

  components: {
    PreviewRender
  },

  computed: {
    data() {
      return window.PIPER_DATA || window.parent.DATA
    },
    customStyle() {
      return createStyles(this.data.config)
    }
  }
}
</script>
