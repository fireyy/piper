<template>
  <div class="properties">
    <div v-show="!currentModule.type" class="ph-text text-center">
      未选中任何模块
    </div>
    <div v-for="(item, index) in items" v-bind:key="item._timestamp" v-show="item === currentModule">
      <h2>{{item.alias}}</h2>
      <div class="contents" v-bind:key="key" v-for="(value, key) in item.data">
        <component :index="key" :data="value" :is="value.type">
        </component>
      </div>
    </div>
  </div>
</template>
<style lang="less">
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
<script>
    import components from '../editors'

    export default{
        components,

        vuex: {
            getters: {
                items        : ({render}) => render.items,
                currentModule: ({render}) => render.current
            }
        },

        data() {
            return {
                components
            }
        }
    }
</script>
