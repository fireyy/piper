<template>
  <div>
    <div class="page-header">
      <el-row type="flex" class="inner-row" justify="space-between">
        <el-col :span="12">
          <el-form :inline="true">
            <el-form-item>
              <el-input placeholder="记录"></el-input>
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
          prop="page_id"
          label="页面ID">
        </el-table-column>
        <el-table-column
          inline-template
          prop="action"
          label="操作"
          width="220">
          <el-tag :type="actionStyle[row.action]" close-transition>{{lang['action'+row.action]}}</el-tag>
        </el-table-column>
        <el-table-column
          prop="create_by.name"
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
    </div>
  </div>
</template>

<script>
  import api from '../api'
  import lang from '../constants'
  import filters from '../filters'

  export default {
    mounted() {
      api.changelog.getAll().then((res)=>{
        this.tableData = res.data
      })
    },
    methods: {
      onSearch() {
        alert("todo")
      },
      formatDate(row) {
        return filters.formatDate(row.create_at)
      }
    },
    data() {
      return {
        lang: lang,
        tableData: [],
        actionStyle: {
          1: 'primary',
          2: 'success',
          3: 'danger'
        }
      }
    }
  }
</script>
