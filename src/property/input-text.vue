<template>
<div class="editor-container">
  <el-form class="editor-text" label-width="80px">
    <el-form-item :label="data.title">
      <el-input v-model="data.value"></el-input>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },

  data() {
    return {

    }
  }
}
</script>
