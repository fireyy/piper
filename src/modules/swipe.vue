 <template>
<div class="module-container">
  <div class="poster-swipe">
    <div class="ph-empty dashed" v-if="isEmpty">
      幻灯片
    </div>

    <div v-if="items.length">
      <swiper auto loop :aspect-ratio="200/640">
        <swiper-item v-for="(item, index) in items">
          <a :href="item.url"><img :src="item.picUrl"></a>
        </swiper-item>
      </swiper>
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
import Swiper from './swiper/index.vue'
import SwiperItem from './swiper/swiper-item.vue'

export default {
  props: ['data'],

  components: {
    'swiper': Swiper,
    'swiper-item': SwiperItem
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
