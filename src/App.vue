<template>
<div>
  <header>
    <div class="title">foo</div>

    <div>
      <el-button type="primary" icon="check" @click="save">保存</el-button>
    </div>
  </header>

  <div v-if="loaded" class="container">
    <module-box></module-box>

    <render></render>

    <property-editor></property-editor>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import store from './vuex/store'
import render from './components/render.vue'
import moduleBox from './components/module-box.vue'
import propertyEditor from './components/property-editor.vue'
import {
  addRenderItem,
  focusDocumentTitle,
} from './vuex/actions'

export default {
  store,

  components: {
    propertyEditor,
    moduleBox,
    render
  },

  mounted() {

    // TODO 初始化数据
    this.loaded = true
  },

  vuex: {
    getters: {
      renderData: ({
        render
      }) => render
    },
    actions: {
      addRenderItem,
      focusDocumentTitle
    }
  },

  methods: {
    save() {
      let {
        items,
        title
      } = _.clone(this.renderData)

      if (title === '网页标题') {
        this.$message({
          message: '请输入合适的网页标题',
          type: 'warning'
        });
        return this.focusDocumentTitle(true)
      }

      // 删除多余数据
      _.each(items, (value) => {
        delete value._timestamp
      })

      let data = JSON.stringify({
        items,
        title
      })


      alert(data)
      console.log(data)
    },

    close() {
      alert("todo")
    }
  },

  data() {
    return {
      loaded: false,
      loadingProgress: 0
    }
  }
}
</script>


<style lang="less" rel="stylesheet/less">
body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    user-select: none;
}

header {
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
</style>
