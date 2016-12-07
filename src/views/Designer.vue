<template>
<div>
  <header class="designer-header">
    <div class="title">
      {{ renderData.title }}
    </div>
    <div>
       <el-button type="danger" icon="arrow-left" @click="back">返回</el-button>
      <el-button type="primary" icon="document" @click="preview">预览</el-button>
      <el-button type="success" :loading="loading" icon="check" @click="save">保存</el-button>
    </div>
  </header>

  <div v-loading.body="loading" class="container">
    <module-box></module-box>

    <render></render>

    <property-editor></property-editor>
  </div>
  <el-dialog size="full" custom-class="preview-dialog" title="预览" v-model="previewVisible">
    <div class="preview-frame">
      <div class="page-title"></div>
      <iframe src="/preview.html" frameborder="0"></iframe>
    </div>
  </el-dialog>
</div>
</template>

<script>
import api from '../api'
import '../skin/default.less'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import render from '../components/render.vue'
import moduleBox from '../components/module-box.vue'
import propertyEditor from '../components/property-editor.vue'

export default {
  components: {
    propertyEditor,
    moduleBox,
    render
  },

  mounted() {
    window.addEventListener("beforeunload", this.beforeunload);
    // 初始化数据
    if(this.id){
      api.page.get({id: this.id}).then((res)=>{
        let data = res.data
        this.editRenderData(data)
      });
    }else{
      this.editRenderData({
        title: '网页标题',
        items: []
      })
    }
  },

  beforeDestroy() {
    window.removeEventListener("beforeunload", this.beforeunload);
  },

  beforeRouteLeave (to, from, next) {
    // @TODO 判断是否有数据变更
    this.$confirm('你即将离开当前页面，未保存的数据将会丢失, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 离开当前页面
      next();
    }).catch(() => {
      // 留在当前页面
    });
  },

  computed: {
    ...mapGetters({
      loading: 'loading',
      renderData: 'render'
    }),
    id() {
      return this.$route.params.id || ''
    }
  },
  methods: {
    ...mapActions([
      'focusDocumentTitle',
      'editRenderData'
    ]),
    getData() {
      let {
        items,
        title
      } = _.clone(this.renderData)

      // 删除多余数据
      _.each(items, (value) => {
        delete value._timestamp
      })

      let data = {
        items,
        title
      }

      return data
    },
    save() {
      let data = this.getData()

      if (data.title === '网页标题') {
        this.$message({
          message: '请输入合适的网页标题',
          type: 'warning'
        });
        return this.focusDocumentTitle(true)
      }

      //保存数据
      if(this.id){
        api.page.update({id: this.id}, data).then((res)=>{
          this.$message({
            message: res.data.message,
            type: 'success'
          });
        });
      }else{
        api.page.saveData(data).then((res)=>{
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.$router.replace({name: 'design', params: {id: res.data.item.insertId}})
        }).catch((res)=>{
          this.$message.error(res.data.message);
        });
      }
    },

    back() {
      this.$router.push({name: 'pages'})
    },

    preview() {
      window.DATA = this.getData()
      this.previewVisible = true;
    },
    beforeunload(e) {
      var confirmationMessage = "可能有数据未保存";

      e.returnValue = confirmationMessage;
      return confirmationMessage
    }
  },

  data() {
    return {
      previewVisible: false
    }
  }
}
</script>


<style lang="less">
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  user-select: none;
}

.designer-header {
  width: 100%;
  height: 55px;
  line-height: 55px;
  color: #fff;
  background: #ffffff;
  padding: 0 30px;
  position: absolute;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #E7E8E7;

  .title {
    font-size: 24px;
    color: #9B9B9B;
  }

  button {
    margin-top: 6px;
  }
}

.container {
  display: flex;
  max-height: 100%;
  min-height: 100%;
  padding-top: 55px;
  overflow: auto;

  .module-box {
    flex: 0 0 230px;
    border-right: 1px solid #E7E8E7;

    li {
      margin: 30px;
    }
  }

  .render-container {
    min-width: 470px;
    flex: 1;
    background: #F7F7F7;
  }

  .properties {
    flex: 0 0 450px;
    position: relative;
    border-left: 1px solid #E7E8E7;
    overflow: auto;
  }

  .module-box,
  .render-container {
    user-select: none;
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;

    a,
    img {
      user-select: none;
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
    }
  }
}
.preview-dialog {
  .preview-frame {
    width: 375px;
    min-height: 667px;
    background: #fff url("../assets/img/phone-head.png") no-repeat;
    padding-top: 64px;
    margin: 20px auto 30px;
    user-select: none;
    box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.30);
    position: relative;
    .page-title {
      color: #fff;
      border: none;
      font-size: 20px;
      text-align: center;
      position: absolute;
      top: 27px;
      left: 73px;
      width: 210px;
      background: transparent;
    }
    iframe {
      width: 100%;
      height: 667px;
    }
  }
}
</style>
