<template>
<div class="module-container">
  <button class="btn"></button>
</div>
</template>
<style lang="less">
.btn {
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
    customStyle() {
      let styles = {}
      if(this.data.style) {
        for(let key in this.data.style.value){
          styles[key] = this.data.style.value[key].value
        }
      }
      return styles
    }
  },
  data() {
    return {}
  }
}
</script>
