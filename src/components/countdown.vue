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
    this.timeWatcher = this.$watch(
      function () {
        return this.start + this.end
      },
      function (newVal, oldVal) {
        this.update()
      }
    )
    this.update()
  },

  destroyed() {
    this.timeWatcher()
    this.stop()
  },

  // watch: {
  //   'end': function() {
  //     this.update()
  //   }
  // },

  methods: {
    update() {
      this._start = new Date(+this.start).valueOf()
      this._end = new Date(+this.end).valueOf()
      let keys = [
        'seconds',
        'minutes',
        'hours',
        'days'
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
          days        : Math.floor(countdownTime / 60 / 60 / 24)
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
      state: this.status || '',
      stateMap: {
        ready: '开始',
        underway: '结束',
        end: '结束'
      },
      time: {},
      timeWatcher: null
    }
  }
}
</script>
<style lang="less">
@import '~_variable';

.countdown {
  white-space: nowrap;
  color: @color-primary;
  text-align: center;
  font-size: 20px;

  &.end, &.ready {
    color: @color-muted;

    .num {
      background: @color-muted;
    }
  }

  .state {
    margin-right: 5px;
  }

  .num {
    color: #fff;
    margin-right: 1px;
    padding: 0 4px;
    border-radius: 4px;
    background: @color-primary;
  }

  .days, .hours, .minutes, .seconds, .milliseconds {
    position: relative;
    display: inline-table;
  }

  .days {
    margin-right: 25px;

    &:after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -22px;
      content: '天';
    }
  }

  .hours, .minutes {
    margin-right: 5px;

    &:after {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      content: ':';
    }
  }
}
</style>
