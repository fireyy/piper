<template>
  <el-form-item :label="label">
    <!--<el-tag
      v-if="data.value"
      :closable="true"
      type="gray"
      :close-transition="false"
      @close="handleRemove"
    >
      <em>{{data.value}}</em>
    </el-tag>-->
    <el-upload action="/api/files"
    :class="{'disable-upload': data.value}"
    :file-list="fileList"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    :on-error="handleError">
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-dialog v-model="dialogVisible" size="tiny">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-form-item>
</template>
<style lang="less">
.disable-upload {
  .el-upload--picture-card {
    display: none;
  }
}
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
import common from './common'

export default {
  mixins: [common],
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    fileList () {
      return this.data.value ? [{
        name: '',
        url: this.data.value
      }] : []
    }
  },
  methods: {
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      this.data.value = (response[0].url.indexOf('http') === -1) ? 'http://' + response[0].url : response[0].url;
    },
    handleError(err, response, file) {
      console.log(err, response, file);
      this.$message.error(response.message)
    },
    handleRemove() {
      this.data.value = null
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>
