<template>
  <div class="layout-app">
    <commonhead></commonhead>
    <transition class="layout-content" name="fade" mode="out-in">
      <router-view class="layout-container"></router-view>
    </transition>
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
    .layout-box {
      background-color: #FDFDFD;
      padding: 25px 25px 50px;
      border-radius: 3px;
      border: 1px solid rgba(43, 50, 57, 0.15);
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
