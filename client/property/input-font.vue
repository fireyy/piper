<template>
    <el-form-item :label="label" class="piper-font-control">
      <el-checkbox-group v-model="fs" size="small" @change="handleChange">
        <el-checkbox-button v-for="(item, index) in styles" :key="index" :label="item.value" :name="item.name">{{item.title}}</el-checkbox-button>
      </el-checkbox-group>
      <el-input-number size="small" v-model="fontSize" :min="12" :max="30" @change="handleChange"></el-input-number>
      <el-select size="small" v-model="fontFamily" placeholder="请选择" @change="handleChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
</template>
<script>
import common from './common'
import props from '../constants/props'
export default {
  mixins: [common],

  mounted () {
    let arr = this.data.value.split(' ');
    this.fontFamily = arr.pop();
    this.fontSize = arr.pop().replace('px', '') * 1;
    this.fs = arr;
  },
  methods: {
    createFontCssText () {
      let css = `${this.fontSize}px ${this.fontFamily}`
      this.data.value = (this.fs.length > 0) ? `${this.fs.join(" ")} ${css}` : css;
    },
    handleChange (val) {
      this.createFontCssText();
    }
  },
  data() {
    return {
      fs: [],
      fontSize: 12,
      fontFamily: 'sans-serif',
      styles: [
        {
          name: 'font-weight',
          title: 'B',
          value: 'bold'
        },
        {
          name: 'font-style',
          title: 'I',
          value: 'italic'
        }
      ],
      options: [
        {
          label: 'courier',
          value: 'courier'
        },
        {
          label: 'serif',
          value: 'serif'
        },
        {
          label: 'sans-serif',
          value: 'sans-serif'
        },
        {
          label: 'Arial',
          value: 'Arial'
        },
        {
          label: 'monospace',
          value: 'monospace'
        },
        {
          label: 'cursive',
          value: 'cursive'
        },
        {
          label: 'fantasy',
          value: 'fantasy'
        },
        {
          label: 'system-ui',
          value: 'system-ui'
        }
      ]
    }
  }
}
</script>
<style lang="less">
.piper-font-control {
  .el-checkbox-group {
    display: inline-block;
  }
  .el-input-number {
    width: 100px;
    vertical-align: middle;
  }
  .el-select {
    width: 120px;
  }
}
</style>
