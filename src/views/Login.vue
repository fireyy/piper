<template>
  <el-card class="login-card">
    <div slot="header" class="clearfix">
      <h1>第三方登录</h1>
    </div>
    <p><a href="/auth/github"><icon name="github" scale="4" label="Github"></icon></a></p>
    <el-form :model="loginForm" :rules="rules" label-width="60px" ref="loginForm" class="loginForm" style="display: none;">
      <el-form-item label="邮件" prop="email">
        <el-input type="text" v-model="loginForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="handleSubmit" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import api from '../api'
import 'vue-awesome/icons/github'
import Icon from 'vue-awesome/components/Icon'

export default {
  components: {
    Icon
  },
  data() {
    return {
      loading: false,
      loginForm: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    handleSubmit(ev) {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          setTimeout(()=>{
            this.$router.replace('pages');
          }, 500)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
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
  a {
    color: #999;
    &:hover {
      color: #333;
    }
  }
}
</style>
