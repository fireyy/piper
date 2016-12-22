<template>
    <el-form-item :label="label">
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
    }
  },

  data() {
    return {
    }
  }
}
</script>
