<template>
  <div>
    <commonhead></commonhead>
    <div class="layout-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<style lang="less">
  .layout-container {
    .layout-content {
      padding: 20px;
    }
  }
</style>
<script>
  import header from '../components/header.vue'
  export default {
    components: {
      commonhead: header
    }
  }
</script>
