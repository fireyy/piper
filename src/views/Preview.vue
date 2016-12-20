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

export default {

  components: {
    PreviewRender
  },

  computed: {
    data() {
      return window.PIPER_DATA || window.parent.DATA
    },
    customStyle() {
      let styles = {}, config = this.data.config
      if(config.style) {
        for(let key in config.style.value){
          styles[key] = config.style.value[key].value
        }
      }
      return styles
    }
  }
}
</script>
