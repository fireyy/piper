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
  .form {
    padding: 20px;
  }
  .hr {
    height: 1px;
    background: #eee;
    margin-bottom: 15px;
  }

  .has-del {
    position: relative;

    .del {
      cursor: pointer;
      padding: 0;
      color: #FF4949;
      border-radius: 50%;
      display: flex;
      position: absolute;
      top: 0;
      right: 0;
      margin: -10px;
      border: 2px solid #fff;

      i {
        font-size: 20px;
      }
    }
  }
}
</style>
<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
import components from '../property'

export default {
  components,

  computed: {
    ...mapGetters({
      render: 'render',
      items: 'renderItems',
      currentModule: 'currentModule'
    })
  },

  data() {
    return {
      components
    }
  }
}
</script>
