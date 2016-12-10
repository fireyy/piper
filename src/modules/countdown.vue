<template>
  <div class="module-container">
    <countdown :start="data.time.value.start" :end="data.time.value.end">
    </countdown>
  </div>
</template>
<script>
import countdown from '../components/countdown.vue'

export default {
  props: ['data'],

  components: {
    countdown
  },

  data() {
    return {
      status: null
    }
  }
}
</script>
