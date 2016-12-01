<template>
<div class="editor-container">
  <div class="editor-text form">
    <el-form label-position="top">
      <el-form-item :label="data.title">
        <el-input type="textarea" v-model="data.value"></el-input>
      </el-form-item>
    </el-form>
  </div>
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
