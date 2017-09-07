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
  background-repeat: no-repeat;
  background-position: center top;
  background-origin: content-box;
  background-size: 100% auto;
}
</style>

<script>
import api from '@/api'
import { createStyles } from '@/utils'
import PreviewRender from '@/components/preview.vue'

export default {
  layout: 'simple',
  components: {
    PreviewRender
  },

  data () {
    return {
      data: {}
    }
  },

  head () {
    return {
      title: this.data.title,
      htmlAttrs: {
        'data-rem': '375',
        'lang': 'zh-CN'
      },
      meta: [
        { hid: 'viewport', name: 'viewport', content: 'initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        { hid: 'description', name: 'description', content: this.data.title }
      ]
    }
  },

  asyncData ({ req, params, error }) {
    if (params.id) {
      return api.page.getData(params.id).then(res => {
        return {
          data: res.data
        }
      }).catch(err => {
        // console.error('error', err)
        error({ statusCode: 500, message: 'Internal Server Error' })
      })
    } else {
      error({ statusCode: 404, message: 'Post not found' })
    }
  },

  computed: {
    customStyle() {
      return this.data.config ? createStyles(this.data.config) : null
    }
  }
}
</script>