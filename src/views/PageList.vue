<template>
  <div>
    <div class="page-header">
      <el-row type="flex" class="inner-row" justify="space-between">
        <el-col :span="12">
          <el-form :inline="true">
            <el-form-item>
              <el-input placeholder="活动名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button type="primary" icon="plus" @click="handleCreate">新建</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-content inner-row">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in tableData" :key="index">
          <el-card class="page-card" :body-style="{ padding: '0px' }">
            <div :style="{backgroundImage: 'url(/'+item.id+'/cover.png)'}" class="image" @click="handleEdit(index, item)">
              <div class="hover-settings-container">
                <div class="main-link">
                  <h3 class="designer">
                    <span class="">Open Designer</span>
                  </h3>
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div class="operations">
                  <i class="el-icon-delete" @click="handleDelete(index, item)" title="Delete"></i>
                </div>
              </div>
            </div>
            <div style="padding: 14px;">
              <h4>{{item.title}}</h4>
              <div class="bottom clearfix">
                <time class="time">{{ item.create_at | formatDate }}</time>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<style lang="less">
.page-card {
  margin-bottom: 20px;
  h4 {
    font-weight: normal;
  }
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
    height: 200px;
    display: block;
    background-size: 100% auto;
    cursor: pointer;
    position: relative;
    &:hover .hover-settings-container {
      opacity: 1;
    }
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
  .hover-settings-container {
    z-index: 9;
    background-color: rgba(43, 50, 57, 0.8);
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: -1px;
    border-top-right-radius: 3px;
    border-top-left-radius: 3px;
    -webkit-transition: opacity 100ms ease;
    transition: opacity 100ms ease;
    color: #ccc;
    .main-link {
      width: 100%;
      text-align: center;
      margin-top: 83px;
      pointer-events: none;
      h3.designer {
        display: inline;
        width: 100%;
      }
      .el-icon-arrow-right {
        display: inline-block;
        height: 10px;
      }
    }
    .operations {
      position: absolute;
      top: 13px;
      right: 10px;
    }
  }
}
</style>
<script>
  import api from '../api'

  export default {
    mounted() {
      api.pages.get().then((res)=>{
        this.tableData = res.data
      })
    },
    methods: {
      onSearch() {
        alert("todo")
      },
      handleCreate() {
        this.$router.push('design')
      },
      handleEdit(index, row) {
        this.$router.push({ name: 'design', params: { id: row.id }})
      },
      handleDelete(index, row) {
        this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.page.remove({id: row.id}).then((res)=>{
            this.tableData.splice(index, 1)
          })
        }).catch(()=>{
          //
        })
      }
    },
    data() {
      return {
        tableData: []
      }
    }
  }
</script>
