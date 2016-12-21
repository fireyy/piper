<template>
<div class="editor-container">
  <el-form class="editor-text" :model="formData" label-width="100px">
    <el-form-item :label="data.title || title" :prop="'text-'+index" :rules="rules">
      <el-input type="textarea" v-model="data.value"></el-input>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    },
    title: String,
    index: [String, Number]
  },

  computed: {
    formData() {
      let tmp = {}
      tmp['text-'+this.index] = this.data.value
      return tmp
    }
  },

  data() {
    return {
      rules: {
        required: true, message: '不能为空', trigger: 'blur'
      }
    }
  }
}
</script>
