<template>
<header class="layout-header">
  <el-row class="inner-row">
    <el-col :span="3">
      <h1 class="logo">
        Piper
      </h1>
    </el-col>
    <el-col :span="17">
      <el-menu theme="dark" :default-active="current" mode="horizontal" router @select="handleSelect">
        <el-menu-item v-for="(item, index) in menus" :key="index" :index="item.route.name" :route="item.route">{{item.title}}</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="4" class="text-right">
      <el-dropdown>
        <span class="user-setting">
          fireyy<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item><div @click="handleLogout">注销</div></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</header>
</template>
<style lang="less">
  .layout-header {
    background: #324057;
    .el-menu--dark {
      .el-menu-item {
        height: 65px;
        line-height: 65px;
      }
      .is-active {
        border-bottom: 5px solid #20a0ff;
      }
    }
    .logo {
      color: #fff;
      font-size: 24px;
      font-weight: normal;
      height: 40px;
      line-height: 40px;
      margin: 12px 0 0 0;
      .fa-icon {
        vertical-align: middle;
      }
    }
    .user-setting {
      cursor: pointer;
      color: #eee;
      line-height: 60px;
    }
  }
</style>
<script>
  import api from '@/api'

  export default {
    name: 'header',
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
            "title": "操作日志",
            "route": {
              "name": "changelog"
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
      },
      handleLogout() {
        api.logout().then(res => {
          this.$router.replace({ path: '/login' })
        })
      }
    },
    data() {
      return {
      }
    }
  }
</script>
