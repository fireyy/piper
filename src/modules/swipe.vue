 <template>
<div class="module-container">
  <div class="poster-swipe">
    <div class="ph-empty dashed" v-if="isEmpty">
      幻灯片
    </div>

    <div v-if="items.length">
      <swiper auto loop :aspect-ratio="200/640" dots-position="center">
        <swiper-item v-for="(item, index) in items" :key="index">
          <a :href="item.link.value"><img :src="item.image.value"></a>
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
      return this.data.pic.value.every((value) => !value.image.value)
    },

    items() {
      return this.data.pic.value.filter((value) => value.image.value)
    }
  },

  data() {
    return {
      speed: 600
    }
  }
}
</script>
