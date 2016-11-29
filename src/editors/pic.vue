<template>
    <div class="editor-container">
        <div class="editor-pic">
            <ui-alert>建议尺寸:750X150, jpg、png、gif的图片格式</ui-alert>

            <div class="form"
                 v-for="item in data.value"
                 track-by="$index">

                <div class="form-group">
                    <div v-if="item.picUrl" class="img has-del">
                        <div class="middle">
                            <img :src="item.picUrl" alt="">
                            <button @click="item.picUrl = null" class="del"><i class="material-icons">clear</i>
                            </button>
                        </div>
                    </div>

                    <div v-if="!item.picUrl"
                         @click="showSelectPic(item)"
                         class="upload-container">
                        <a href="javascript:">
                            {{errorMsg}} <i class="ui-icon material-icons">add_circle</i>
                        </a>
                    </div>
                </div>
                <div class="form-group">
                    <label>链接</label>

                    <input class="form-control" v-model="item.url" type="text" placeholder="请输入跳转链接">
                </div>

                <div class="hr"></div>
            </div>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less">
    
</style>

<script type="text/ecmascript-6">
    import Vue from 'vue'
    import components from '../components'
    import popover from '../components/popover.vue'

    export default{
        props     : {
            data: {
                type: Object
            }
        },
        components: {
            popover
        },
        created() {
            let diff = this.data.options.max - this.data.value.length

            if (diff > 0) {
                while (diff--) {
                    this.data.value.push({
                        url   : null,
                        picUrl: null
                    })
                }
            }
        },

        methods: {
          showSelectPic() {
            alert("todo")
          }
        },

        data(){
            return {
            }
        }
    }
</script>
