<template>
    <div class="properties">
        <div v-show="!currentModule.type"
             class="ph-text text-center">
            未选中任何模块
        </div>

        <div v-for="item in items"
             track-by="_timestamp"
             v-show="item === currentModule">
            <h2>{{item.alias}}</h2>

            <div class="contents"
                 track-by="$index"
                 v-for="(key,value) in item.data">
                <component
                        :index="$index"
                        :data.sync="value"
                        :is="value.type">
                </component>
            </div>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    .properties {
        .ph-text {
            font-size: 20px;
            margin-top: 30px;
            color: #ddd;
        }

        h2 {
            margin: 12px 15px;
        }

        .contents {
            padding-bottom: 10px;
            margin-bottom: 20px;

            &:not(:last-child) {
                border-bottom: 2px dashed #eee;
            }
        }
    }
</style>

<script type="text/ecmascript-6">
    import components from '../editors'

    export default{
        components,

        vuex: {
            getters: {
                items        : ({render}) => render.items,
                currentModule: ({render}) => render.current
            }
        },

        data: () => {
            return {
                components
            }
        }
    }
</script>
