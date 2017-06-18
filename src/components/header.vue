<template>
<header class="layout-header">
  <el-row class="inner-row">
    <el-col :span="3">
      <h1 class="logo">
        <icon name="piper" scale="1.2"></icon>
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
  import Icon from 'vue-awesome/components/Icon.vue'

  Icon.register({
    piper: {
      width: 100,
      height: 100,
      raw: '<g fill="#fff"><path d="M50 42.1C45.6 42.1 42.1 45.6 42.1 50 42.1 53.8 44.8 57 48.4 57.7L48.4 100C48.9 100 49.5 100 50 100 50.5 100 51.1 100 51.6 100L51.6 57.7C55.2 57 57.9 53.8 57.9 50 57.9 45.6 54.4 42.1 50 42.1Z"/><path d="M100 50C100 22.4 77.6 0 50 0 22.4 0 0 22.4 0 50 0 76 19.8 97.3 45.1 99.8L45.1 99.8 45.1 99.7 45.1 99.7C45 79.4 32.7 63.7 27.6 58.1L27.6 58.1C27.6 58.1 25.5 55.6 26.7 52.6L36 29.1C36 29.1 37.7 24.8 41.5 24.8L50 24.8 58.5 24.8C62.3 24.8 64 29.1 64 29.1L73.3 52.6C74.5 55.6 72.4 58.1 72.4 58.1L72.4 58.1C67.3 63.7 55 79.4 54.9 99.7L54.9 99.8C80.2 97.3 100 76 100 50Z"/></g>'
    }
  })

  export default {
    components: {Icon},
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
