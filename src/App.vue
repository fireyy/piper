<template>
  <div>
    <router-view class="view"></router-view>
    <loading :show="loading"></loading>
  </div>
</template>
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
