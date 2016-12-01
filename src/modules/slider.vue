<template>
<div class="module-container">
  <div class="poster-many">
    <div class="ph-empty dashed" v-if="isEmpty">
      幻灯片
    </div>

    <div v-if="items.length">
      <carousel :indicators="true">
        <carousel-item v-for="item in items" track-by="picUrl" class="item">
          <a :href="item.url" class="img">
            <img :src="item.picUrl" alt="">
          </a>
        </carousel-item>
      </carousel>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import components from '../components'

export default {
  props: ['data'],

  components: {
    Carousel: components.Carousel,
    CarouselItem: components.CarouselItem
  },

  created() {
    if (_.isEmpty(this.vdata)) {
      this.vdata = {
        pic: {
          type: 'pic',
          title: '幻灯片',
          value: [{
            url: null,
            picUrl: 'http://img1.ffan.com/T14.CTB4LT1RCvBVdK'
          }, {
            url: null,
            picUrl: 'http://img1.ffan.com/T1xEWTBmET1RCvBVdK'
          }],
          options: {
            max: 6
          }
        }
      }
    }
  },

  computed: {
    isEmpty() {
      return _.every(this.vdata.pic.value, (value) => !value.picUrl)
    },

    items() {
      return _.filter(this.vdata.pic.value, (value) => value.picUrl)
    }
  },

  data() {
    return {
      vdata: this.data
    }
  }
}
</script>
