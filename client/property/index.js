import inputs from './input'

export default {
  ...inputs,
  group   : require('./group.vue').default,
  htmlStyle : require('./html-style.vue').default
}
