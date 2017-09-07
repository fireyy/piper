<template>
  <span class="svg-icon" v-html="icon"></span>
</template>
<script>
import feather from 'feather-icons'

export default {
  name: 'icon',
  props: {
    name: String,
    options: Object
  },
  computed: {
    icon () {
      return feather.toSvg(this.name, this.options)
    }
  }
}
</script>
<style>
.svg-icon svg {
  width: auto;
  height: 1em;
  display: inline-block;
  vertical-align: middle;
}
</style>
