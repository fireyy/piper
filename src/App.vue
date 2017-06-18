<template>
  <div id="app">
    <transition class="layout-content" name="fade" mode="out-in">
      <router-view class="view"></router-view>
    </transition>
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

html {
  font-size: 20PX;
}

body {
  font-size: 14px;
  color: #4e5b68;
  background: #F0F1F3;
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

.fade-enter-active, .fade-leave-active {
  transition: all .2s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
.fa-icon {
  width: auto;
  height: 1em;
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
