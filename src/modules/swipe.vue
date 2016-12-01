<template>
<div class="module-container">
  <div class="poster-swipe">
    <div class="ph-empty dashed" v-if="isEmpty">
      幻灯片
    </div>

    <div v-if="items.length">
      <swipe :speed="speed" class="swipe">
        <swipe-item class="item" v-for="item in items">
          <a :href="item.url" class="img">
            <img :src="item.picUrl" alt="">
          </a>
        </swipe-item>
      </swipe>
    </div>
  </div>
</div>
</template>
<style>
  .swipe {
    height: 120px;
  }
</style>
<script>
import _ from 'lodash'
import { Swipe, SwipeItem } from 'vue-swipe'

export default {
  props: ['data'],

  components: {
    'swipe': Swipe,
    'swipe-item': SwipeItem
  },

  computed: {
    isEmpty() {
      return _.every(this.
        data.pic.value, (value) => !value.picUrl)
    },

    items() {
      return _.filter(this.data.pic.value, (value) => value.picUrl)
    }
  },

  data() {
    return {
      speed: 600
    }
  }
}
</script>
