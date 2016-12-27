<template>
    <el-form-item :label="label" :prop="index" :rules="rules">
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
    index: [String, Number],
    rules: Object
  },

  computed: {
    label() {
      return this.data.title || this.title
    }
  },

  data() {
    return {
    }
  }
}
</script>
