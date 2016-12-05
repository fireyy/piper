<template>
  <div>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="handleCreate">新建</el-button>
      </el-form-item>
    </el-form>
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
          <el-button
              size="small"
              @click="handleEdit($index, row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete($index, row)">删除</el-button>
        </span>
      </el-table-column>
    </el-table>
    <el-popover
      ref="deleteconfirm"
      placement="top"
      width="160"
      v-model="isdelete">
      <p>确定删除吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="isdelete = false">取消</el-button>
        <el-button type="primary" size="mini" @click="isdelete = true">确定</el-button>
      </div>
    </el-popover>
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
      handleCreate() {
        this.$router.push('design')
      },
      handleEdit(index, row) {
        this.$router.push({ name: 'design', params: { id: row.id }})
      },
      handleDelete(index, row) {
        api.page.remove({id: row.id}).then((res)=>{
          this.tableData.splice(index, 1)
        });
      }
    },
    data() {
      return {
        tableData: [],
        isdelete: false
      }
    }
  }
</script>
