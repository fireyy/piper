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
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="create_by.name"
          label="操作人"
          width="220">
        </el-table-column>
        <el-table-column
          inline-template
          prop="create_at"
          label="创建时间"
          width="220">
          <div>
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ row.create_at | formatDate }}</span>
          </div>
        </el-table-column>
        <el-table-column
          inline-template
          prop="update_at"
          label="更新时间"
          width="220">
          <div>
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{ row.update_at | formatDate }}</span>
          </div>
        </el-table-column>
        <el-table-column
          inline-template
          label="操作"
          width="180">
          <span>
            <el-button size="small" icon="edit" @click="handleEdit($index, row)">编辑</el-button>
            <el-button size="small" icon="delete" type="danger" @click="handleDelete($index, row)">删除</el-button>
          </span>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

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
