 <template>
<div class="module-container">
  <div class="poster-swipe">
    <div class="ph-empty dashed" v-if="isEmpty">
      幻灯片
    </div>

    <div v-if="items.length">
      <swiper auto loop :aspect-ratio="200/640" dots-position="center">
        <swiper-item v-for="(item, index) in items">
          <a :href="item.link"><img :src="item.url"></a>
        </swiper-item>
      </swiper>
    </div>
  </div>
</div>
</template>
<script>
import Swiper from '../components/swiper/index.vue'
import SwiperItem from '../components/swiper/swiper-item.vue'

export default {
  props: ['data'],

  components: {
    'swiper': Swiper,
    'swiper-item': SwiperItem
  },

  computed: {
    isEmpty() {
      return this.data.pic.value.every((value) => !value.url)
    },

    items() {
      return this.data.pic.value.filter((value) => value.url)
    }
  },

  data() {
    return {
      speed: 600
    }
  }
}
</script>
