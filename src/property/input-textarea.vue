<template>
    <el-form-item :label="data.title || title">
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
    index: [String, Number]
  },

  data() {
    return {

    }
  }
}
</script>
