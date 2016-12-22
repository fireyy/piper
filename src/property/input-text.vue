<template>
    <el-form-item :label="label" :prop="'text-'+index" :rules="rules">
      <el-input v-model="data.value"></el-input>
    </el-form-item>
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
    label() {
      return this.data.title || this.title
    },
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
