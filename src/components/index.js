export default {
    popover        : (resolve) => require(['./popover.vue'], resolve),
    loading        : (resolve) => require(['./loading.vue'], resolve),
    sortBar        : (resolve) => require(['./sort-bar.vue'], resolve),
    boxSelect      : (resolve) => require(['./box-select.vue'], resolve),
    boxSelectOption: (resolve) => require(['./box-select-option.vue'], resolve),
    Carousel       : (resolve) => require(['./vue-m-carousel/Carousel.vue'], resolve),
    CarouselItem   : (resolve) => require(['./vue-m-carousel/CarouselItem.vue'], resolve)
}
