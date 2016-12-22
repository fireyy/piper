<template>
    <el-form-item :label="data.title">
      <el-radio-group v-model="data.value">
        <el-radio-button v-for="(item, index) in data.props" :label="item.value">{{item.title}}</el-radio-button>
      </el-radio-group>
    </el-form-item>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },

  data() {
    return {

    }
  }
}
</script>
