<template>
<div class="properties">
  <div v-show="!currentModule.type && !currentModule.style" class="ph-text text-center">
    <i class="el-icon-information"></i>
    <br>请选择一个模块
  </div>
  <div class="page-config-editor" v-if="render.config === currentModule">
    <h2>页面设置</h2>
    <el-form label-width="100px" label-position="left">
      <component v-bind:key="key" v-for="(value, key) in render.config" :title="key | lang" :index="key" :data="value" :is="value.type">
      </component>
    </el-form>
  </div>
  <div v-bind:key="currentModule._timestamp" v-if="currentModule.type">
    <h2>{{currentModule.alias}}</h2>
    <el-form label-width="100px" label-position="left">
      <component v-bind:key="key" v-for="(value, key) in currentModule.data" :title="key | lang" :index="key" :data="value" :is="value.type" :prop="key">
      </component>
    </el-form>
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
    padding: 10px 15px;
    background: #eff2f7;
    font-size: 14px;
    font-weight: normal;
    color: #8492a6;
    border-bottom: 1px solid #d3dce6;
  }
  h3 {
    padding: 10px 0;
    margin-bottom: 10px;
  }
  .el-form-item {
    padding: 10px 20px 0;
    margin-bottom: 12px;
    border-top: 1px solid #EFF2F7;
    &:first-child {
      // border-top: none;
    }
    .el-date-editor {
      width: 100%;
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
import _ from 'lodash'

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
