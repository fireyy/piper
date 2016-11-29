<template>
    <div v-show="show"
         transition="zoom"
         :class="{'miss-drop': hitDrop, 'can-drop': dragInfo.dragTag}"
         class="drag-module animated">
        <component v-if="!currentModule.data"
                   :is="currentModule.type">
        </component>
        <component v-if="currentModule.data"
                   :data.sync="currentModule.data"
                   :is="currentModule.type">
        </component>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    .drag-module {
        width: 375px;
        display: inline-block;
        position: fixed;
        left: 0;
        top: 0;
        cursor: pointer;
        opacity: 0.8;
        margin: -20px 0 0 0;
        pointer-events: none;
        transform: scale(0.6);
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.50);
        z-index: 99999;
        background: #fff;
    }

    .drag-module.animated {
        &.zoomIn {
            animation-duration: .3s;
        }
        &.zoomOutDown {
            animation-duration: 0s;
        }
        &.miss-drop {
            animation-duration: 0s;
        }
    }
</style>

<script type="text/ecmascript-6">
    import Vue from 'vue'
    import {components, modules} from '../modules'
    import {
            addRenderItem,
            activeRenderItem,
            dropRenderItem,
            blurRenderItem
    } from '../vuex/actions'

    Vue.transition('zoom', {
        enterClass: 'zoomIn',
        leaveClass: 'zoomOutDown'
    })

    export default{
        props: {
            dragModule: {
                type    : Object,
                required: true,
                twoWay  : true
            }
        },

        components: components,

        vuex: {
            getters: {
                dragInfo: ({render}) => render.dragInfo
            },
            actions: {
                addRenderItem,
                activeRenderItem,
                dropRenderItem,
                blurRenderItem
            }
        },

        ready() {
            this.$watch('dragModule', (newVal) => {
                this.show = !(_.isEmpty(newVal))

                if (this.show) {
                    this.hitDrop       = false
                    this.currentModule = newVal
                    this.startDrag()
                }
            })
        },

        methods: {
            startDrag () {
                let that = this

                this.blurRenderItem()

                window.addEventListener('mousemove', onMove)
                window.addEventListener('mouseup', function upEvent(event) {
                    window.removeEventListener('mousemove', onMove)
                    window.removeEventListener('mouseup', upEvent)
                    that.stopDrag(event)
                })

                onMove()
                function onMove(event = window.event) {
                    let el = that.$el

                    that.activeRenderItem(event)
                    setTimeout(() => {
                        el.style.left = `${event.clientX - el.clientWidth / 2}px`
                        el.style.top  = `${event.clientY - el.clientHeight / 2}px`
                    })
                }
            },

            stopDrag (event) {
                setTimeout(() => {
                    this.hitDrop    = this.dropRenderItem(event, this.dragModule)
                    this.dragModule = {}
                })
            }
        },

        data() {
            return {
                show         : false,
                hitDrop      : false,
                currentModule: {}
            }
        }
    }
</script>
