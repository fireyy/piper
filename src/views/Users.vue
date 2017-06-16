<template>
  <div>
    <div class="page-header">
      <el-row type="flex" class="inner-row" justify="space-between">
        <el-col :span="18">
          <el-form :inline="true">
            <el-form-item>
              <el-input placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="layout-content inner-row">
      <el-row>
        <el-col :span="6" v-for="(o, index) in tableData" :offset="index > 0 ? 2 : 0" :key="index">
          <el-card class="user-card" :body-style="{ padding: '0px' }">
            <img src="" class="image">
            <div style="padding: 14px;">
              <span>{{o.name}}</span>
              <div class="bottom clearfix">
                <time class="time">{{ o.email }}</time>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="less">
.user-card {
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 50px;
    border: none;
    background: #eee;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
}
</style>
<script>
  import api from '../api'

  export default {
    mounted() {
      api.users.getData().then((res)=>{
        this.tableData = res.data
      })
    },
    methods: {
      onSearch() {
        alert("todo")
      },
      handleCreate() {
        alert("todo")
      }
    },
    data() {
      return {
        tableData: []
      }
    }
  }
</script>
