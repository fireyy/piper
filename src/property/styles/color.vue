<template lang="html">
  <div class="input-color">
    <input type="color" v-model="data.value">
  </div>
</template>

<script>
export default {
  props: ['data']
}
</script>

<style lang="less">
.input-color {
  input {
    padding: 0;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(169, 169, 169);
    border-image: initial;
  }
}
</style>
