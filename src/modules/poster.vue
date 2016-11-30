<template>
    <div class="module-container">
        <div class="poster-single">
            <div class="ph-empty dashed" v-if="!data.pic.value[0].picUrl">
                图片
            </div>

            <div v-if="data.pic.value[0].picUrl">
                <a :href="data.pic.value[0].url"
                   class="img">
                    <img :src="data.pic.value[0].picUrl" alt="">
                </a>

            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['data'],

        data() {
            return {
            }
        }
    }
</script>
