<template>
  <el-card class="login-card">
    <div slot="header" class="clearfix">
      <h1>Welcome</h1>
    </div>
    <div class="passports">
      <el-tooltip effect="dark" content="使用 Github 登录" placement="top">
        <a href="/auth/github" class="passport">Login with <icon name="github" /> Github</a>
      </el-tooltip>
    </div>
  </el-card>
</template>
<script>
import Icon from '@/components/icon.vue'

export default {
  layout: 'simple',
  components: {
    Icon
  },
  data() {
    return {
      loading: false
    };
  }
}
</script>
<style lang="less">
.login-card {
  width: 400px;
  margin: 40px auto 0;
  h1 {
    font-size: 20px;
    font-weight: 400;
  }
  .passport {
    color: #999;
    display: inline-block;
    font-size: 20px;
    svg {
      font-size: 30px;
      vertical-align: baseline;
    }
    &:hover {
      color: #333;
    }
  }
}
</style>
