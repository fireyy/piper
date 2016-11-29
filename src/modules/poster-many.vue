<template>
    <div class="module-container">
        <div class="poster-many">
            <div class="ph-empty dashed" v-if="isEmpty">
                轮播海报
            </div>

            <div v-if="items.length">
                <carousel :indicators="true">
                    <carousel-item v-for="item in items"
                                   track-by="picUrl"
                                   class="item">
                        <a :href="item.url"
                           class="img">
                            <img :src="item.picUrl" alt="">
                        </a>
                    </carousel-item>
                </carousel>
            </div>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
</style>

<script type="text/ecmascript-6">
    import components from '../components'

    export default {
        props: ['data'],

        components: {
            Carousel    : components.Carousel,
            CarouselItem: components.CarouselItem
        },

        created() {
            if (_.isEmpty(this.data)) {
                this.data = {
                    pic: {
                        type   : 'pic',
                        title  : '轮播海报',
                        value  : [
                          {
                              url   : null,
                              picUrl: 'http://img1.ffan.com/T14.CTB4LT1RCvBVdK'
                          },
                          {
                              url   : null,
                              picUrl: 'http://img1.ffan.com/T1xEWTBmET1RCvBVdK'
                          }
                        ],
                        options: {
                            max: 6
                        }
                    }
                }
            }
        },

        computed: {
            isEmpty() {
                return _.every(this.data.pic.value, (value) => !value.picUrl)
            },

            items() {
                return _.filter(this.data.pic.value, (value) => value.picUrl)
            }
        },

        data() {
            return {}
        }
    }
</script>
