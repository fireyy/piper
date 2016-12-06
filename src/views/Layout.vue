<template>
  <div>
    <commonhead></commonhead>
    <div class="layout-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<style>
  .layout-container {
    padding: 20px;
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
