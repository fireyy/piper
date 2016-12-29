<template>
<div class="properties">
  <div v-show="!currentModule.type && !currentModule.style" class="ph-text text-center">
    <i class="el-icon-information"></i>
    <br>请选择一个模块
  </div>
  <div class="page-config-editor" v-if="render.config === currentModule">
    <h2>页面设置</h2>
    <el-form label-width="100px">
      <component v-bind:key="key" v-for="(value, key) in render.config" :title="key | lang" :index="key" :data="value" :is="value.type">
      </component>
    </el-form>
  </div>
  <div v-bind:key="currentModule._timestamp" v-if="currentModule.type">
    <h2>{{currentModule.alias}}</h2>
    <el-form label-width="100px" :model="moduleForm[currentModule._timestamp+'']">
      <component v-bind:key="key" v-for="(value, key) in currentModule.data" :index="key" :data="value" :is="value.type" :prop="key" :rules="getRules()">
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
import { getRules } from '../utils'
import _ from 'lodash'

export default {
  components,

  computed: {
    ...mapGetters({
      render: 'render',
      items: 'renderItems',
      currentModule: 'currentModule'
    }),
    moduleForm() {
      let moduleForm = {};
      this.items.forEach(function(item){
        let key = item._timestamp + ''
        if(!moduleForm[key]) moduleForm[key] = {}
        for(const it in item.data) {
          if(_.isString(item.data[it].value)) {
            moduleForm[key][it] = item.data[it].value
          }else if(_.isArray(item.data[it].value)) {
            item.data[it].value.forEach(function(em, i){
              for(const te in item.data[it].value[i]) {
                moduleForm[key][te+i] = item.data[it].value[i][te].value
              }
            })
          }else if(_.isObject(item.data[it].value)) {
            for(const ite in item.data[it].value){
              moduleForm[key][ite] = item.data[it].value[ite].value
            }
          }else{
            //catch error
          }
        }
      })
      return moduleForm
    }
  },

  methods: {
    getRules(item){
      return getRules(item)
    }
  },

  data() {
    return {
      components
    }
  }
}
</script>
