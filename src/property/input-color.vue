<template>
  <el-form-item :label="data.title || title" class="input-color">
    <!-- <input type="color" v-model="data.value"> -->
    <el-popover
            ref="popover2"
            class="color-popover"
            trigger="click">
        <color-picker v-model="mColor" @change-color="onChange"></color-picker>
    </el-popover>
    <span :style="{background:data.value}" class="color" v-popover:popover2></span>
  </el-form-item>
</template>

<script>
import { Sketch } from 'vue-color'
import tinycolor from 'tinycolor2'
export default {
  components: {'color-picker': Sketch},
  props: {
    data: {
      type: Object
    },
    title: String,
    index: [String, Number]
  },
  computed: {
    mColor(){
      let color = tinycolor(this.data.value)
      return {
        hex: color.toHexString(),
        rgba: color.toRgb(),
        a: color.getAlpha()
      }
    }
  },
  methods: {
    onChange(val){
      let rgba = val.rgba
      this.data.value = `rgba(${[rgba.r, rgba.g, rgba.b, rgba.a].join(',')})`
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
