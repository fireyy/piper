<template>
    <ui-progress-circular :show="show"
                          style="left:50%;transform: translate(-50%,0);"
                          color="primary">
    </ui-progress-circular>
    <div v-show="!show">
        <slot></slot>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>
</style>

<script>
    import uiProgressCircular from 'keen-ui/lib/UiProgressCircular'

    export default {
        props: {
            show: {
                type: Boolean
            }
        },

        created() {
        },

        components: {uiProgressCircular},

        watch: {},

        methods: {},

        data() {
            return {}
        }
    }
</script>
