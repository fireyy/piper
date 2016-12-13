<template>
  <div id="app">
    <router-view class="view"></router-view>
    <loading :show="loading"></loading>
  </div>
</template>
<style>
* {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.hide {
  display: none !important;
}

.design-mode {

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: #F5F5F5;
    cursor: pointer;
  }

  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
    background-color: #aaa;
  }

}

body {
  font-size: 14px;
  color: #4e5b68;
  background: #EBF1F2;
}

a {
  color: #2196F3;
  text-decoration: none;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}
</style>
<script>
  import loading from './components/loading.vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {
      loading
    },
    computed: {
      ...mapGetters({
        loading: 'loading'
      })
    }
  }
</script>
