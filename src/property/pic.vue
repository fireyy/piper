<template>
<div class="editor-container">
  <div v-for="(item, index) in data.value" v-bind:key="index">
    <inputText :index="index" :data="item" title="链接"></inputText>
    <inputUpload :index="index" :data="item"></inputUpload>
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
import inputText from './input-text.vue'
import inputUpload from './input-upload.vue'

export default {
  components: {
    inputUpload,
    inputText
  },
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
