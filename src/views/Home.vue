<template>
  <div>
    <div class="page-header">
      <el-row type="flex" class="inner-row" justify="space-between">
        <el-col :span="6">
          <h3>完成进度</h3>
        </el-col>
        <el-col :span="18">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="60"></el-progress>
        </el-col>
      </el-row>
    </div>
    <div class="layout-content inner-row">
      <div class="dashboard layout-box">
        <el-row class="inner-row" type="flex" justify="space-around">
          <el-col :span="6" class="text-center">
            <div class="section">
              {{count.working}}
              <div class="name">制作中</div>
            </div>
          </el-col>
          <el-col :span="6" class="text-center">
            <div class="section">
              {{count.published}}
              <div class="name">已发布</div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>最近修改</span>
              </div>
              <ul class="recent-changelogs">
                <li v-for="(item, index) in recentChangeLog" :key="index" class="text item">
                  {{ item.create_by.name }} 于 {{ item.create_at | formatDate }} {{'action' + item.action | lang}} 了 <router-link :to="{ name: 'design', params: { id: item.page_id }}">{{ item.title }}</router-link>
                </li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    mounted() {
      this.getPagesCount()
      this.getRecentChangeLog()
    },
    methods: {
      getPagesCount(){
        api.count().then((res)=>{
          this.count = res.data
        })
      },
      getRecentChangeLog(){
        api.changelog.getRecent().then((res)=>{
          this.recentChangeLog = res.data.data
        })
      }
    },
    data () {
      return {
        count: {
          working: 0,
          published: 0
        },
        recentChangeLog: []
      }
    }
  }
</script>
<style lang="less">
.dashboard {
  .section {
    height: 200px;
    width: 200px;
    position: relative;
    border: 1px solid #eaeefb;
    font-size: 40px;
    color: #1f2d3d;
    text-align: center;
    line-height: 162px;
    padding-bottom: 36px;
    box-sizing: border-box;
    display: inline-block;
    margin-right: 17px;
    border-radius: 4px;
    .name {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-top: 1px solid #eaeefb;
      font-size: 14px;
      color: #8492a6;
      line-height: 35px;
      text-align: center;
      text-indent: 10px;
    }
  }
  .el-card {
    box-shadow: none;
  }
  .recent-changelogs {
    margin-left: 20px;
  }
}
</style>
