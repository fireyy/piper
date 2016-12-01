<template>
  <div class="editor-container">
    <div class="editor-html-style form">
      <h3>{{data.title}}</h3>
      <el-form label-width="80px">
        <el-form-item v-for="(item, key) in data.value" :label="key">
          <component :index="key" :data="item" :is="item.type"></component>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="less" scoped>
</style>

<script>
import components from './input'
export default {
  components,
  props: ['data'],

  data() {
    return {}
  }
}
</script>
