<template>
  <el-card class="login-card">
    <div slot="header" class="clearfix">
      <h1>第三方登录</h1>
    </div>
    <div class="passports">
      <el-tooltip effect="dark" content="使用 Github 登录" placement="top">
        <a href="/auth/github" class="passport">Github</a>
      </el-tooltip>
    </div>
  </el-card>
</template>
<script>
import api from '@/api'

export default {
  layout: 'simple',
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
    &:hover {
      color: #333;
    }
  }
}
</style>
