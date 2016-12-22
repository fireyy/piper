<template>
<div class="pic-items">
  <div class="pic-item" v-for="(item, index) in data.value" v-bind:key="index">
    <inputText :index="index" :data="item.link" title="链接"></inputText>
    <inputImage :index="index" :data="item.image"></inputImage>
  </div>
</div>
</template>
<style lang="less">
.pic-items {
  counter-reset: picitem;
  .pic-item {
    position: relative;
    &:before {
      counter-increment: picitem;
      content: counter(picitem) ". ";
      font-size: 40px;
      color: #eee;
      background-color: #fff;
      width: 70px;
      text-align: center;
      position: absolute;
      top: 30px;
      left: 0;
    }
  }
}
</style>
<script>
import Vue from 'vue'
import inputText from './input-text.vue'
import inputImage from './input-image.vue'

export default {
  components: {
    inputImage,
    inputText
  },
  props: {
    data: {
      type: Object
    }
  },
  created() {
    let diff = this.data.options.max - this.data.value.length

    if (diff > 0) {
      while (diff--) {
        this.data.value.push(
          {
            'link': {
              value: null,
            },
            'image': {
              value: null
            }
          }
        )
      }
    }
  },

  data() {
    return {
    }
  }
}
</script>
