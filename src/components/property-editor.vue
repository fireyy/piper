<template>
<div class="properties">
  <div v-show="!currentModule.type && !currentModule.style" class="ph-text text-center">
    <i class="el-icon-information"></i>
    <br>请选择一个模块
  </div>
  <div class="page-config-editor" v-show="render.config === currentModule">
    <h2>页面设置</h2>
    <div class="contents" v-bind:key="key" v-for="(value, key) in render.config">
      <component :index="key" :data="value" :is="value.type">
      </component>
    </div>
  </div>
  <div v-for="(item, index) in items" v-bind:key="item._timestamp" v-show="item === currentModule">
    <h2>{{item.alias}}</h2>
    <div class="contents" v-bind:key="key" v-for="(value, key) in item.data">
      <component :index="key" :data="value" :is="value.type">
      </component>
    </div>
  </div>
</div>
</template>
<style lang="less">
.properties {
  .ph-text {
    font-size: 20px;
    margin-top: 30px;
    color: #ddd;
    i {
      font-size: 60px;
      margin-bottom: 10px;
    }
  }
  h2 {
    margin: 12px 15px;
  }
  .contents {
    h3 {
      padding: 10px 0;
      margin-bottom: 10px;
    }
    .el-form-item {
      padding: 10px 20px 0;
      margin-bottom: 12px;
      border-top: 1px solid #eee;
    }
  }
  .hr {
    height: 1px;
    background: #eee;
    margin-bottom: 15px;
  }

  .has-del {
    position: relative;

    .del {
      cursor: pointer;
      padding: 0;
      color: #FF4949;
      border-radius: 50%;
      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      margin: -10px;
      border: 2px solid #fff;

      i {
        font-size: 20px;
      }
    }
  }
}
</style>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import components from '../property'

export default {
  components,

  computed: {
    ...mapGetters({
      render: 'render',
      items: 'renderItems',
      currentModule: 'currentModule'
    })
  },

  data() {
    return {
      components
    }
  }
}
</script>
