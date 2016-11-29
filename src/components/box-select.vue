<template>
    <div class="box-select">
        <slot></slot>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    .box-select {
        display: flex;
        flex-flow: row wrap;

        .item {
            width: 100%;
            cursor: pointer;
            white-space: nowrap;
            margin-bottom: 8px;
            border: 1px solid #ddd;
            padding: 8px 12px 8px 8px;
            position: relative;

            &.active {
                border: 2px solid #2196F3;

                &:after {
                    position: absolute;
                    right: 0;
                    bottom: -2px;
                    font-size: 18px;
                    content: '◢';
                    color: #2196F3;
                }

                &:before {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    content: '√';
                    color: #fff;
                    z-index: 2;
                    font-weight: bold;
                    font-size: 12px;
                    font-family: cursive;
                }
            }
        }
    }
</style>

<script>
    export default {
        props: {
            value: {
                type   : Array,
                default: () => []
            }
        },

        created() {
        },

        components: {},

        watch: {},

        events: {
            'boxSelect:init'(item) {
                this.items.push(item)

                if (_.find(this.value, item)) {
                    this.$set(`items[${this.items.indexOf(item)}]._selected`, true)
                }
            },

            'boxSelect:select'(item, selected) {
                this.$set(`items[${this.items.indexOf(item)}]._selected`, selected)
                this.update()
            },
        },

        methods: {
            update () {
                this.value = _.filter(this.items, '_selected')
            }
        },

        data() {
            return {
                items: []
            }
        }
    }
</script>
