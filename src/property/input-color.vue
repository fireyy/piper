<template>
  <el-form-item :label="data.title || title" class="input-color">
    <input type="color" v-model="data.value">
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
  }
}
</script>

<style lang="less">
.input-color {
  input {
    padding: 0;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(169, 169, 169);
    border-image: initial;
  }
}
</style>
