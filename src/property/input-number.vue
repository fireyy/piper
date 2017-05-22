<template>
    <el-form-item :label="label" :prop="prop">
      <el-slider
        v-model="value"
        :max="max"
        show-input>
      </el-slider>
    </el-form-item>
</template>
<script>
import common from './common'

export default {
  mixins: [common],

  computed: {
    value: {
      get () {
        return this.data.value.replace('px', '') * 1
      },
      set (val) {
        this.data.value = val + 'px'
      }
    }
  },

  data() {
    return {
      max: 500
    }
  }
}
</script>
