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
        <el-col :span="6" v-for="(item, index) in tableData">
          <el-card class="page-card" :body-style="{ padding: '0px' }">
            <span :style="{backgroundImage: 'url(/'+item.id+'/cover.png)'}" class="image" @click="handleEdit(index, item)"></span>
            <div style="padding: 14px;">
              <span>{{item.title}}</span>
              <div class="bottom clearfix">
                <time class="time">{{ item.create_at | formatDate }}</time>
                <div class="button">
                  <i class="el-icon-delete" @click="handleDelete(index, item)"></i>
                </div>
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
