<template>
    <div class="module-container">
        <div class="poster">
            <div class="ph-empty dashed" v-if="!data.pic.value[0].url">
                图片
            </div>

            <div v-if="data.pic.value[0].url">
                <a :href="data.pic.value[0].link"
                   class="img">
                    <img :src="data.pic.value[0].url" alt="">
                </a>

            </div>
        </div>
    </div>
</template>
<style lang="less">
  .poster {
    text-align: center;

    img {
      width: 100%;
      max-width: 100%;
      height: auto;
    }
  }
</style>
<script>

    export default {
        props: ['data'],

        data() {
            return {
            }
        }
    }
</script>
