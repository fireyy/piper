<template>
<div class="editor-container">
  <div class="editor-pic">
    <div class="form" v-for="(item, index) in data.value" v-bind:key="index">
      <el-form label-position="top" :model="formData">
        <el-form-item label="链接">
          <el-input placeholder="请输入跳转链接" v-model="item.url">
          </el-input>
        </el-form-item>
        <el-form-item label="图片">
          <div v-if="item.picUrl" class="img has-del">
            <div class="middle">
              <img :src="item.picUrl" alt="">
              <button @click="item.picUrl = null" class="del"><i class="el-icon-circle-close"></i>
                          </button>
            </div>
          </div>
          <el-upload v-if="!item.picUrl" action="//jsonplaceholder.typicode.com/posts/" type="drag" :multiple="true" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError">
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
<script type="text/ecmascript-6">
import Vue from 'vue'
import components from '../components'
import popover from '../components/popover.vue'

export default {
  props: {
    data: {
      type: Object
    }
  },
  components: {
    popover
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
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  },

  data() {
    return {
      formData: {}
    };
  }
}
</script>
