<template>
<div>
  <el-form-item :label="label" :prop="index">
    <el-date-picker
      v-model="data.value"
      :type="pickerType"
      :editable="false"
      :clearable="false"
      placeholder="选择日期时间">
    </el-date-picker>
  </el-form-item>
</div>
</template>
<script>
import _ from 'lodash'
import common from './common'

export default {
  mixins: [common],

  computed: {
    pickerType(){
      return this.data.sub || 'datetime'
    }
  },

  data() {
    return {
    }
  }
}
</script>
