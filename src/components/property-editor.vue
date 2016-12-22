<template>
<div class="properties">
  <div v-show="!currentModule.type && !currentModule.style" class="ph-text text-center">
    <i class="el-icon-information"></i>
    <br>请选择一个模块
  </div>
  <div class="page-config-editor" v-show="render.config === currentModule">
    <h2>页面设置</h2>
    <el-form label-width="100px">
      <component v-bind:key="key" v-for="(value, key) in render.config" :title="key | lang" :index="key" :data="value" :is="value.type">
      </component>
    </el-form>
  </div>
  <div v-for="(item, index) in items" v-bind:key="item._timestamp" v-show="item === currentModule">
    <h2>{{item.alias}}</h2>
    <el-form label-width="100px">
      <component v-bind:key="key" v-for="(value, key) in item.data" :index="key" :data="value" :is="value.type">
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
    margin: 12px 15px;
  }
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
