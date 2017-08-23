<template>
  <div>
    <div class="page-header">
      <el-row type="flex" class="inner-row" justify="space-between">
        <el-col :span="18">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item prop="title">
              <el-input style="width: 300px;" v-model="searchForm.title" placeholder="活动名称"></el-input>
            </el-form-item>
            <el-form-item prop="isPublish">
              <el-radio-group v-model="searchForm.isPublish">
                <el-radio-button :label="-1">全部</el-radio-button>
                <el-radio-button :label="0">制作中</el-radio-button>
                <el-radio-button :label="1">已发布</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="submitForm">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button type="primary" icon="plus" @click="handleCreate">新建</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="layout-content inner-row">
      <div class="page-cards">
        <div class="page-card" v-for="(item, index) in tableData" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <div :style="{ backgroundImage: 'url('+item.cover+')' }" class="image" @click="handleEdit(index, item)">
              <div class="hover-settings-container">
                <div class="main-link">
                  <h3 class="designer">
                    <span class="">Open Designer</span>
                  </h3>
                  <i class="el-icon-arrow-right"></i>
                </div>
                <div class="operations">
                  <i class="el-icon-delete" @click.stop="handleDelete(index, item)" title="Delete"></i>
                </div>
              </div>
              <div class="page-meta">
                <h4>{{item.title}}</h4>
                <div class="bottom">
                  <span class="create_by">{{item.user.name}}</span>
                  <time class="time">{{ item.create_at | formatDate }}</time>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <el-pagination
        class="piper-page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<style lang="less">
.page-cards {
  display: flex;
  flex-wrap: wrap;
}
.page-card {
  width: 20%;
  padding: 10px;
  box-sizing: border-box;
  color: #fff;
  h4 {
    font-weight: normal;
  }
  .time {
    font-size: 13px;
  }

  .bottom {
    margin-top: 5px;
    line-height: 12px;
    overflow: hidden;
  }

  .create_by {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 200px;
    display: block;
    background-repeat: no-repeat;
    background-size: 100% auto;
    cursor: pointer;
    position: relative;
    &:hover .hover-settings-container {
      opacity: 1;
    }
    .page-meta {
      background: rgba(0,0,0,0.3);
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px;
    }
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
.piper-page {
  text-align: right;
}
</style>
<script>
  import api from '../api'

  export default {
    mounted() {
      this.pageChange()
    },
    methods: {
      pageChange(){
        let query = {
          size: this.pageSize,
          page: this.currentPage,
          title: this.searchForm.title,
          isPublish: this.searchForm.isPublish
        };
        api.pages.getData(query).then((res)=>{
          this.tableData = res.data.data
          this.pageSize = res.data.size
          this.currentPage = res.data.page
          this.total = res.data.total
        })
      },
      submitForm() {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.pageChange()
          }
        });
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
          api.page.removeData(row.id).then((res)=>{
            this.tableData.splice(index, 1)
          })
        }).catch(()=>{
          //
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.pageChange()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.pageChange()
      }
    },
    data() {
      return {
        tableData: [],
        searchForm: {
          title: '',
          isPublish: -1
        },
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  }
</script>
