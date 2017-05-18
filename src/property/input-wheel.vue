<template>
    <el-form-item :label="label" :prop="prop">
      <div class="piper-wheels">
        <div class="piper-wheel-item" v-for="(item, index) in sliders" :key="index">
          <span class="piper-wheel-title">{{lang.wheel[index]}}:</span>
          <el-slider
            :value="sliders[index]"
            @input="(val)=>handleInput(val,index)"
            show-input>
          </el-slider>
        </div>
      </div>
    </el-form-item>
</template>
<script>
import common from './common'
import lang from '../constants/lang'

export default {
  mixins: [common],

  computed: {
    sliders: {
      get () {
        return this.data.value.split(" ").map(a=>parseInt(a, 10))
      }
    }
  },

  methods: {
    handleInput (val, index) {
      this.sliders[index] = val;
      this.data.value = this.sliders.join(" ")
    }
  },

  data() {
    return {
      lang: lang
    }
  }
}
</script>
<style lang="less">
.piper-wheels {
  .piper-wheel-item {
    .piper-wheel-title {
      float: left;
    }
    .el-slider__runway {
      margin-left: 50px;
    }
  }
}
</style>
