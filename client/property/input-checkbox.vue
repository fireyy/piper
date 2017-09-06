<template>
    <el-form-item :label="label">
      <el-checkbox-group v-model="data.value" size="small">
        <el-checkbox-button v-for="(item, index) in props" :key="index" :label="item.value">{{item.title}}</el-checkbox-button>
      </el-checkbox-group>
    </el-form-item>
</template>
<script>
import common from './common'
import props from '../constants/props'
export default {
  mixins: [common],

  computed: {
    props(){
      return this.data.props ? props[this.data.props] : []
    }
  },
  data() {
    return {
    }
  }
}
</script>
