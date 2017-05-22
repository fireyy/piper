<template>
  <el-form-item :label="label" class="input-color">
    <el-color-picker v-model="data.value" show-alpha></el-color-picker>
  </el-form-item>
</template>

<script>
import common from './common'
export default {
  mixins: [common]
}
</script>
