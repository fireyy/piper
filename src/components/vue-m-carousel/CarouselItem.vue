<template>
<div class="carousel-item" :style="style">
  <slot></slot>
</div>
</template>
<script>
export default {
  events: {
    width(width) {
      this.style.width = width + 'px';
    }
  },
  data() {
    return {
      style: {
        width: document.documentElement.offsetWidth + 'px'
      }
    }
  },
  created() {
    this.$dispatch('addItem', this)
  },
  beforeDestroy() {
    this.$dispatch('delItem', this)
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.carousel {
    &-item {
        height: 100%;
        width: 90px;
        box-sizing: border-box;
    }
}
</style>
