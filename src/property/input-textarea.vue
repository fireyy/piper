<template>
  <el-form-item :label="data.title || title" :prop="index" :rules="rules">
    <el-input type="textarea" v-model="data.value"></el-input>
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

  data() {
    return {

    }
  }
}
</script>
