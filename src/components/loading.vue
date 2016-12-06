<template>
  <div class="data-loading" v-loading="show"></div>
</template>

<style lang="less">
  .data-loading {
    position: fixed !important;
    top: 30px;
    left: 50%;
  }
</style>

<script>
export default {
  props: {
    show: {
      type: Boolean
    }
  },

  data() {
    return {}
  }
}
</script>
