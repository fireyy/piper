import { mapActions } from 'vuex'
export default {
  props: {
    data: {
      type: Object
    },
    title: String,
    index: [String, Number],
    rules: Object
  },
  computed: {
    label() {
      return this.data.title || this.title
    }
  },
  methods: {
    ...mapActions([
      'editModuleData'
    ])
  },
  watch: {
    'data': {
      deep: true,
      handler: function(newVal, oldVal) {
        if(!newVal) return

        console.log(newVal)

        this.editModuleData(newVal)
      }
    }
  }
}
