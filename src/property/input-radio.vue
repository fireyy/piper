<template>
    <el-form-item :label="label">
      <el-radio-group v-model="data.value">
        <el-radio-button v-for="(item, index) in data.props" :label="item.value">{{item.title}}</el-radio-button>
      </el-radio-group>
    </el-form-item>
</template>
<script>
import common from './common'

export default {
  mixins: [common],

  data() {
    return {

    }
  }
}
</script>
