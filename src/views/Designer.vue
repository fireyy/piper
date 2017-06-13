<template>
<div v-loading.body.fullscreen="loading" element-loading-text="拼命加载中">
  <header class="page-header designer-header">
    <el-row class="inner-row" type="flex" justify="space-between">
      <el-col :span="9" class="title">
        {{ renderData.title }}
      </el-col>
      <el-col :span="9" class="text-right">
        <el-button type="danger" icon="arrow-left" @click="back">返回</el-button>
        <el-button type="warning" icon="document" @click="preview">预览</el-button>
        <el-button type="primary" icon="check" @click="save">保存</el-button>
        <el-button v-if="id" type="success" icon="upload" @click="publish">保存并发布</el-button>
      </el-col>
    </el-row>
  </header>

  <div class="container inner-row">
    <module-container></module-container>

    <render></render>

    <property></property>
  </div>
  <el-dialog size="full" custom-class="preview-dialog" title="预览" v-model="previewVisible">
    <div class="preview-frame">
      <div class="page-title"></div>
      <iframe src="/#preview" frameborder="0"></iframe>
    </div>
  </el-dialog>
  <el-dialog size="tiny" title="二维码" v-model="qrcode.visible">
    <Qrcode :val="qrcode.url" :size="qrcode.size"></Qrcode>
  </el-dialog>
</div>
</template>

<script>
import api from '../api'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import render from '../components/render.vue'
import moduleContainer from '../components/module-container.vue'
import property from '../components/property.vue'
import Qrcode from '../components/qrcode.vue'

export default {
  components: {
    property,
    moduleContainer,
    render,
    Qrcode
  },

  mounted() {
    this.addDataWatcher()
    window.addEventListener("beforeunload", this.beforeunload);
    // 初始化数据
    this.fetchData()
  },

  beforeDestroy() {
    this.changed = -1;
    this.removeDataWatcher();
    window.removeEventListener("beforeunload", this.beforeunload);
  },

  beforeRouteLeave (to, from, next) {
    // 判断是否有数据变更
    if(this.changed < 0) {
      this.$confirm('你即将离开当前页面，未保存的数据将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 离开当前页面
        next();
      }).catch(() => {
        // 留在当前页面
        next(false);
      });
    }else{
      next()
    }
  },
  watch: {
    '$route': 'fetchData'
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
      'editRenderData',
      'resetRenderState'
    ]),
    addDataWatcher() {
      this.watchItems = this.$watch('renderData.items', function(val){
        console.log("watch items", val)
        this.changed--
        this.removeDataWatcher();
      }, {
        deep: true
      })
      this.watchTitle = this.$watch('renderData.title', function(val){
        console.log("watch title", val)
        this.changed--
        this.removeDataWatcher();
      })
    },
    removeDataWatcher() {
      if(this.changed < 0){
        //unwatch
        this.watchItems && this.watchItems();
        this.watchTitle && this.watchTitle();
      }
    },
    getData() {
      let {
        items,
        config,
        title
      } = _.clone(this.renderData)

      // 删除多余数据
      // _.each(items, (value) => {
      //   delete value._timestamp
      // })

      let data = {
        items,
        config,
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
        api.page.updateData(this.id, data).then((res)=>{
          this.$message({
            message: res.data.message,
            type: 'success'
          })
        })
      }else{
        api.page.saveData(data).then((res)=>{
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.$router.replace({name: 'design', params: {id: res.data.item.id}})
        })
      }
    },

    back() {
      this.$router.go(-1)
    },

    publish() {
      let data = this.getData()

      api.publish(this.id, data).then((res)=>{
        if(res.data.errors && res.data.errors.length > 0){
          // 打包失败
        }else{
          this.$message.success('发布成功')
          this.qrcode.visible = true
          this.qrcode.url = res.data[0].url
        }
      })
    },

    preview() {
      window.DATA = this.getData()
      this.previewVisible = true;
    },

    beforeunload(e) {
      if(this.changed >= 0) return;

      var confirmationMessage = "可能有数据未保存";
      e.returnValue = confirmationMessage;
      return confirmationMessage
    },

    fetchData() {
      if(this.id){
        api.page.getData(this.id).then((res)=>{
          let data = res.data
          this.editRenderData(data)
        });
      }else{
        this.resetRenderState()
      }
    }
  },

  data() {
    return {
      previewVisible: false,
      changed: 2,
      watchItems: null,
      watchTitle: null,
      qrcode: {
        size: 300,
        visible: false,
        url: null
      }
    }
  }
}
</script>


<style lang="less">
body,
html {
  height: 100%;
  user-select: none;
}

.designer-header {
  padding: 10px 30px;
  margin-bottom: 20px;

  .title {
    font-size: 24px;
    line-height: 36px;
    color: #9B9B9B;
  }
}

.container {
  display: flex;
  max-height: 100%;
  min-height: 100%;
  overflow: auto;
  background: #fff;
  border: 1px solid #d3dce6;

  .modules-container {
    flex: 0 0 230px;
    border-right: 1px solid #d3dce6;
  }

  .render-container {
    min-width: 470px;
    flex: 1;
    background: #F9FAFC;
  }

  .properties {
    flex: 0 0 450px;
    position: relative;
    border-left: 1px solid #d3dce6;
    overflow: auto;
  }

  .modules-container,
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
