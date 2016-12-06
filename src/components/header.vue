<template>
<header class="layout-header">
  <el-row :gutter="20">
    <el-col :span="6">
      <h1 class="logo">营销活动制作平台</h1>
    </el-col>
    <el-col :span="14">
      <el-menu theme="dark" :default-active="current" mode="horizontal" router @select="handleSelect">
        <el-menu-item v-for="(item, index) in menus" :index="item.route.name" :route="item.route">{{item.title}}</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4">
      <el-dropdown>
        <span class="user-setting">
          zhuyuan6@wanda.cn<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><router-link to="login">注销</router-link></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</header>
</template>
<style lang="less">
  .layout-header {
    background: #324057;
    .logo {
      text-indent: 100px;
      color: #fff;
      font-size: 18px;
      height: 40px;
      line-height: 40px;
      margin: 10px 0 0 10px;
      background: url(../assets/img/logo.png) no-repeat;
    }
    .user-setting {
      cursor: pointer;
      color: #eee;
      line-height: 60px;
    }
  }
</style>
<script>
  export default {
    computed: {
      current() {
        return this.$route.name
      },
      menus() {
        return [
          {
            "title": "首页",
            "route": {
              "name": "home"
            }
          },
          {
            "title": "活动列表",
            "route": {
              "name": "pages"
            }
          },
          {
            "title": "用户",
            "route": {
              "name": "users"
            }
          }
        ]
      }
    },
    methods: {
      handleSelect() {
        //
      }
    },
    data() {
      return {
      }
    }
  }
</script>
