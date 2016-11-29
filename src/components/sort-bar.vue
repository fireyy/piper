<template>
    <ul class="actions"
        transition="expand">
        <slot></slot>
        <li class="hint--top" aria-label="上移" v-if="index !== 0">
            <ui-icon-button
                    @click="move('up',item)"
                    class="btn-sm"
                    color="default"
                    icon="arrow_upward">
            </ui-icon-button>
        </li>
        <li class="hint--top" aria-label="下移" v-if="index !== items.length - 1">
            <ui-icon-button
                    @click="move('down',item)"
                    class="btn-sm"
                    color="default"
                    icon="arrow_downward">
            </ui-icon-button>
        </li>
        <li class="hint--top" aria-label="删除">
            <ui-icon-button
                    @click="del(item)"
                    class="btn-sm"
                    color="default"
                    icon="delete">
            </ui-icon-button>
        </li>
    </ul>
</template>

<style lang="less" rel="stylesheet/less" scoped>
    .actions {
        width: 100%;
        background: rgb(238, 238, 238);
        justify-content: flex-end;
        flex-flow: row wrap;
        z-index: 10000;
        display: flex;

        &:hover {
            overflow: visible;
        }

        li:not(:first-child) {
            margin: 0 0 0 8px;
        }
    }
</style>

<script type="text/ecmascript-6">
    export default {
        props: {
            items: {
                type: Array
            },
            item : {
                type: Object
            }
        },
        data() {
            return {
                renderData: []
            }
        },

        computed: {
            index() {
                return this.items.indexOf(this.item)
            }
        },

        methods: {
            move(type, item){
                let index = this.index

                switch (type) {
                    case 'up':
                        this.order(index - 1, index)
                        break;

                    case 'down':
                        this.order(index + 1, index)
                        break;

                    default:
                        throw new Error('type is not defined')
                }
            },
            del(item) {
                this.items.$remove(item)
            },
            order(newIndex, oldIndex) {
                this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0])
                this.$dispatch('on-sort', newIndex, oldIndex)
            }
        }
    }
</script>
