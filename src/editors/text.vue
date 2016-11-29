<template>
    <div class="editor-container">
        <div class="editor-text form">
            <div v-for="(key,value) in data.value" class="form-group">
                <label>{{value.title}}</label>
                <input type="text" v-model="value.value">
            </div>
        </div>
    </div>
</template>

<style lang="less" rel="stylesheet/less" scoped>

</style>

<script type="text/ecmascript-6">
    export default{
        props: {
            data: {
                type: Object
            }
        },

        data(){
            return {}
        }
    }
</script>
