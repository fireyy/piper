<template>
  <div class="module-container">
    <countdown :start="data.time.value.startTime" :end="data.time.value.endTime">
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
