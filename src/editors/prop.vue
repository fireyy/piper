<template>
<div class="editor-container">
  <div class="editor-text form">
    <el-form label-width="80px" :model="formData">
      <el-form-item v-for="(value, key) in data.value" :label="value.key">
        <el-input v-model="value.value">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    data: {
      type: Object
    }
  },

  data() {
    return {
      formData: {}
    }
  }
}
</script>
