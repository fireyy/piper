<template>
  <div class="layout-app">
    <commonhead></commonhead>
    <router-view class="layout-container"></router-view>
  </div>
</template>
<style lang="less">
  .inner-row {
    max-width: 1170px;
    margin: 0 auto;
  }
  .layout-container {
    .layout-content {
      padding: 20px 0;
    }
  }
  .page-header {
    background: #FDFDFD;
    border-bottom: 1px solid rgba(43, 50, 57, 0.15);
    padding: 15px 0;
    .el-form-item {
      margin-bottom: 0;
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
