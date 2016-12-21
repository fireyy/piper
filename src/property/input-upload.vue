<template>
<el-form class="editor-pic" label-width="100px">
  <el-form-item label="图片">
    <el-upload :class="{'hasImage': data.url}" action="/api/files" type="drag"
    :thumbnail-mode="true"
    :default-file-list="[data]"
    :on-success="handleSuccess(index)"
    :on-preview="handlePreview(index)"
    :on-remove="handleRemove(index)"
    :on-error="handleError(index)">
      <i class="el-icon-upload"></i>
      <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-form-item>
</el-form>
</template>
<style lang="less">
.el-upload {
  width: 100%;
  .el-dragger {
    width: 300px;
    height: 150px;
  }
}
.hasImage {
  .el-draggeer__cover__btns {
    .btn:first-child {
      display: none;
    }
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
    handleSuccess(index) {
      return (response, file, fileList)=>{
        console.log(index, response, file, fileList)
        this.data.url = response[0].url
      }
    },
    handleError(index) {
      return (err, response, file)=>{
        console.log(err, response, file);
        this.$message.error(response.message)
      }
    },
    handleRemove(index) {
      return (file, fileList)=>{
        console.log(file, fileList);
        this.data.url = null
      }
    },
    handlePreview(index) {
      return (file)=>{
        console.log(file);
      }
    }
  }
}
</script>
