<template>
  <el-form-item :label="data.title || title" class="input-color">
    <!-- <input type="color" v-model="data.value"> -->
    <el-popover
            ref="popover2"
            class="color-popover"
            trigger="click">
        <color-picker v-model="data.value" @change-color="onChange"></color-picker>
    </el-popover>
    <span :style="{background:data.value}" class="color" v-popover:popover2></span>
  </el-form-item>
</template>

<script>
import { Sketch } from 'vue-color'
export default {
  components: {'color-picker': Sketch},
  props: {
    data: {
      type: Object
    },
    title: String,
    index: [String, Number]
  },
  methods: {
    onChange(val){
      this.data.value = `rgba(${val.rgba.r},${val.rgba.g},${val.rgba.b},${val.rgba.a})`
    }
  }
}
</script>

<style lang="less">
.input-color {
  .color {
    width: 30px;
    height: 30px;
    display: inline-block;
    border-radius: 5px;
  }
}
</style>
