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
          <el-col :span="6" class="text-center" v-for="o in 4" :key="o">
            <div class="section">
              {{o}}
              <div class="name">制作中</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
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
}
</style>
