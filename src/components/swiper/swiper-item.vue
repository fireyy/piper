<template>
  <div class="piper-swiper-item"><slot></slot></div>
</template>

<script>
export default {
  mounted () {
    this.$parent.rerender()
  },
  beforeDestroy () {
    const $parent = this.$parent
    this.$nextTick(() => {
      $parent.rerender()
    })
  }
}
</script>
