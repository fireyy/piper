<template>
<div class="editor-container">
  <el-form class="editor-pic" label-position="top">
    <fieldset v-for="(item, index) in data.value" v-bind:key="index">
      <el-form-item label="链接">
        <el-input placeholder="请输入跳转链接" v-model="item.link">
        </el-input>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload :class="{'hasImage': item.url}" action="/api/files" type="drag"
        :thumbnail-mode="true"
        :default-file-list="[item]"
        :on-success="handleSuccess(index)"
        :on-preview="handlePreview(index)"
        :on-remove="handleRemove(index)"
        :on-error="handleError(index)">
          <i class="el-icon-upload"></i>
          <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </fieldset>
  </el-form>
</div>
</template>
<style lang="less">
  .editor-pic {
    .img {
      width: 100%;
      height: 150px;
      display: table;

      .middle {
        text-align: center;
        display: table-cell;
        vertical-align: middle;
      }

      img {
        width: 100%;
        display: inline-block;
      }
    }
    fieldset {
      border: none;
      border-bottom: 1px solid #eee;
    }
    // hack for hide element upload icon
    .hasImage {
      .el-draggeer__cover__btns {
        .btn:first-child {
          display: none;
        }
      }
    }
  }
</style>
<script>
import Vue from 'vue'

export default {
  props: {
    data: {
      type: Object
    }
  },
  created() {
    let diff = this.data.options.max - this.data.value.length

    if (diff > 0) {
      while (diff--) {
        this.data.value.push({
          link: null,
          url: null
        })
      }
    }
  },

  methods: {
    handleSuccess(index) {
      return (response, file, fileList)=>{
        console.log(index, response, file, fileList)
        this.data.value[index].url = response[0].url
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
        this.data.value[index].url = null
      }
    },
    handlePreview(index) {
      return (file)=>{
        console.log(file);
      }
    }
  },

  data() {
    return {
    }
  }
}
</script>
