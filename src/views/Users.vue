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
      <div class="user-cards">
        <div class="user-card" v-for="(o, index) in tableData" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="o.avatar" class="image">
            <div style="padding: 14px;">
              <span>{{o.name}}</span>
              <div class="bottom">
                <time class="time">{{ o.email }}</time>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less">
.user-cards {
  display: flex;
  flex-wrap: wrap;
}
.user-card {
  width: 20%;
  padding: 10px;
  box-sizing: border-box;
  color: #999;
  .time {
    font-size: 13px;
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
    height: 100%;
    border: none;
    background: #eee;
    display: block;
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
