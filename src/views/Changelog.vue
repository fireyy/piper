<template>
  <div>
    <div class="page-header">
      <el-row type="flex" class="inner-row" justify="space-between">
        <el-col :span="18">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item prop="title">
              <el-input style="width: 300px;" v-model="searchForm.title" placeholder="活动名称"></el-input>
            </el-form-item>
            <el-form-item prop="action">
              <el-select v-model="searchForm.action" placeholder="请选择">
                <el-option label="全部" :value="0"></el-option>
                <el-option v-for="n in 4" :key="n" :label="'action'+n | lang" :value="n"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="search" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="layout-content inner-row">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="page.title"
          label="活动名称">
        </el-table-column>
        <el-table-column
          inline-template
          prop="action"
          label="操作"
          width="220">
          <el-tag :type="actionStyle[row.action]" close-transition>{{'action'+row.action | lang}}</el-tag>
        </el-table-column>
        <el-table-column
          prop="user.name"
          label="操作人"
          width="220">
        </el-table-column>
        <el-table-column
          prop="create_at"
          :formatter="formatDate"
          label="操作时间"
          width="220">
        </el-table-column>
      </el-table>
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
.piper-page {
  padding: 10px;
  text-align: right;
}
</style>
<script>
  import api from '../api'
  import filters from '../filters'

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
          action: this.searchForm.action
        };
        api.changelog.getAll(query).then((res)=>{
          this.tableData = res.data.data
          this.pageSize = res.data.size
          this.currentPage = res.data.page
          this.total = res.data.total
        })
      },
      onSearch() {
        this.$refs['searchForm'].validate((valid) => {
          if (valid) {
            this.pageChange()
          }
        });
      },
      formatDate(row) {
        return filters.formatDate(row.create_at)
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
        actionStyle: {
          1: 'primary',
          2: 'success',
          3: 'danger'
        },
        searchForm: {
          title: '',
          action: 0
        },
        currentPage: 1,
        pageSize: 10,
        total: 10
      }
    }
  }
</script>
