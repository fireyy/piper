<template>
<div class="module-container" style="text-align: center">
  <button class="piper-btn" :class="customClass">{{data.content.value}}</button>
</div>
</template>
<style lang="less">
@import '~_variable.less';

.piper-btn {
  text-align: center;
  font-size: 30px;
  height: 75px;
  line-height: 75px;
  padding: 0 15px;
  color: @color-default;
  border: 1px solid @color-default;
  border-radius: 5px;
  background: #fff;
  display: inline-block;

  &-primary {
    border-color: @color-primary;
    color: @color-primary;
  }

  &-blank {
    border: transparent;
    background: transparent;
    color: @color-primary;
  }

  &-sm {
    font-size: 30px;
    height: 65px;
    line-height: 65px;
    padding: 0 8px;
  }

  &-xs {
    font-size: 30px;
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
  }
}
</style>
<script>

export default {
  props: ['data'],
  computed: {
    customClass() {
      let classname = []
      let arr = ['size', 'theme']
      arr.forEach((item)=>{
        this.data[item].value && classname.push("piper-btn-" + this.data[item].value)
      })
      return classname
    }
  },
  data() {
    return {}
  }
}
</script>
