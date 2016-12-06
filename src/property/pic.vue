<template>
<div class="editor-container">
  <div class="editor-pic">
    <div class="form" v-for="(item, index) in data.value" v-bind:key="index">
      <el-form label-position="top">
        <el-form-item label="链接">
          <el-input placeholder="请输入跳转链接" v-model="item.url">
          </el-input>
        </el-form-item>
        <el-form-item label="图片">
          <div v-if="item.picUrl" class="img has-del">
            <div class="middle">
              <img :src="item.picUrl" alt="">
              <button @click="item.picUrl = null" class="del"><i class="el-icon-circle-close"></i></button>
            </div>
          </div>
          <el-upload v-if="!item.picUrl" action="/upload" type="drag"
          :on-success="handleSuccess"
          :on-error="handleError">
            <i class="el-icon-upload"></i>
            <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div class="hr"></div>
    </div>
  </div>
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
          url: null,
          picUrl: null
        })
      }
    }
  },

  methods: {
    handleSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      if(response.status=="200"){
        alert("http://img1.ffan.com/"+response.data.name)
      }
    },
    handleError(err, response, file) {
      console.log(err, response, file);
    }
  },

  data() {
    return {
    }
  }
}
</script>
