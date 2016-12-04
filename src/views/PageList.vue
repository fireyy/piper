<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="title"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="create_at"
      label="创建时间"
      width="220">
    </el-table-column>
    <el-table-column
      prop="update_at"
      label="更新时间"
      width="220">
    </el-table-column>
    <el-table-column
      inline-template
      label="操作"
      width="180">
      <span>
        <router-link :to="{ name: 'design', params: { id: row.id }}">编辑</router-link>
      </span>
    </el-table-column>
  </el-table>
</template>

<script>
  import api from '../api'

  export default {
    mounted() {
      api.pages.get().then((res)=>{
        this.tableData = res.data
      })
    },
    data() {
      return {
        tableData: []
      }
    }
  }
</script>
