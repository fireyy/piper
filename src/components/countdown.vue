<template>
  <div>
    <div v-if="time.days" class="countdown" :class="[state]">
      <span class="state">
                <span v-if="state !== 'end'">距离{{stateMap[state]}}: </span>
      <span v-if="state === 'end'">活动已{{stateMap[state]}}:</span>
      </span>
      <div class="days">
        <span v-for="(item, index) in time.days" :key="index" class="num">{{item}}</span>
      </div>
      <div class="hours">
        <span v-for="(item, index) in time.hours" :key="index" class="num">{{item}}</span>
      </div>
      <div class="minutes">
        <span v-for="(item, index) in time.minutes" :key="index" class="num">{{item}}</span>
      </div>
      <div class="seconds">
        <span v-for="(item, index) in time.seconds" :key="index" class="num">{{item}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    start: {
      default: () => new Date()
    },
    end: {
      required: true
    },
    status: ''
  },

  created() {
    this.update()
  },

  destroyed() {
    this.stop()
  },

  watch: {
    'end': function() {
      this.update()
    }
  },

  computed: {
    state() {
      return this.status || ''
    },
    isStart() {
      // return this.time.days && this.time.days.length > 0
      return true
    }
  },

  methods: {
    update() {
      this._start = new Date(+this.start).valueOf()
      this._end = new Date(+this.end).valueOf()
      let keys = [
        'seconds',
        'minutes',
        'hours',
        'days',
        'weeks',
        'months',
        'years'
      ]

      this.stop()
      this.interval = setInterval(() => {
        let now = Date.now()
        let state = this.state = this.getState()
        let countdownTime = null

        switch (state) {
          case 'ready':
            countdownTime = this._start - now
            break;

          case 'underway':
            countdownTime = this._end - now
            break;

          default:
            //
        }

        // let duration = moment.duration(countdownTime)

        countdownTime = countdownTime / 1000

        let duration = {
          seconds     : Math.floor(countdownTime % 60),
          minutes     : Math.floor(countdownTime / 60) % 60,
          hours       : Math.floor(countdownTime / 60 / 60) % 24,
          days        : Math.floor(countdownTime / 60 / 60 / 24) % 7,
          weeks       : Math.floor(countdownTime / 60 / 60 / 24 / 7),
          months      : Math.floor(countdownTime / 60 / 60 / 24 / 30.4368),
          years       : Math.abs(new Date(+this.end).getFullYear() - new Date().getFullYear())
        };

        keys.forEach((key) => {
          let value = `${duration[key]}`.substr(0, 2)
          value = +value < 10 ? `0${value}` : `${value}`

          this.$set(this.time, `${key}`, value.split(''))
        })

        if (state === 'end') this.stop()
      }, 1000)
    },

    getState() {
      let now = Date.now()
      let start = this._start
      let end = this._end
      let result = null

      if (now < start) {
        result = 'ready'
      } else if (now > start && now < end) {
        result = 'underway'
      } else {
        result = 'end'
      }

      return result
    },
    stop() {
      clearInterval(this.interval)
    }
  },

  data() {
    return {
      stateMap: {
        ready: '开始',
        underway: '结束',
        end: '结束'
      },
      time: {}
    }
  }
}
</script>
