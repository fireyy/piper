<template>
  <div class="module-container">
    <countdown :start="pickerVal[0]" :end="pickerVal[1]">
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

  computed: {
    pickerVal(){
      if(_.isArray(this.data.time.value)){
        this.data.time.value = this.data.time.value.map(item => _.isDate(item) ? item : new Date(item))
      }
      return this.data.time.value
    }
  },

  data() {
    return {
    }
  }
}
</script>
