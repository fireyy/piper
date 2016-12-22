<template>
  <el-form-item :label="data.title || '图片'">
    <el-tag
      v-if="data.value"
      :closable="true"
      type="gray"
      :close-transition="false"
      @close="handleRemove"
    >
      <em>{{data.value}}</em>
    </el-tag>
    <el-upload v-if="!data.value" action="/api/files"
    :on-success="handleSuccess"
    :on-error="handleError">
      <el-button icon="upload" size="small" type="primary">点击上传</el-button>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-form-item>
</template>
<style lang="less">
.el-tag {
  em {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
    overflow: hidden;
    font-style: normal;
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
<script>
export default {
  props: {
    data: {
      type: Object
    },
    index: [String, Number]
  },
  methods: {
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      this.data.value = response[0].url
    },
    handleError(err, response, file) {
      console.log(err, response, file);
      this.$message.error(response.message)
    },
    handleRemove() {
      this.data.value = null
    }
  }
}
</script>
