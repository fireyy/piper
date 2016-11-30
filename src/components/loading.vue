<template>
<div>
  <div v-loading="show">
  </div>
  <div v-show="!show">
    <slot></slot>
  </div>
</div>
</template>

<style lang="less" scoped>
</style>

<script>
export default {
  props: {
    show: {
      type: Boolean
    }
  },

  created() {},

  watch: {},

  methods: {},

  data() {
    return {}
  }
}
</script>
