import {
    ACTIVE_RENDER_ITEM,
    EDIT_RENDER_ITEM,
    ADD_RENDER_ITEM,
    BLUR_RENDER_ITEM,
} from '../mutation-types'
import {modules} from '../../modules'


const state = {
    items   : [],
    title   : '网页标题',
    current : {},
    dragInfo: {},
    dragModule: {}
}

const mutations = {
    [ADD_RENDER_ITEM](state, type, data, index = state.items.length + 1) {
        let module = null

        _.each(modules, (moduleItem) => {
            _.each(moduleItem.items, (item) => {
                if (module) return

                module = item.type === type && item
            })
        })

        let newItem = _.chain(module).pick(['type', 'alias', 'data']).cloneDeep().merge({data}).value()

        newItem._timestamp = newItem._timestamp || Date.now()
        state.items.splice(index, 0, newItem)
        state.current  = newItem
        state.dragInfo = {}
    },

    [EDIT_RENDER_ITEM](state, item) {
        state.current = item
    },

    [ACTIVE_RENDER_ITEM](state, dragInfo) {
        state.dragInfo = dragInfo
    },

    [BLUR_RENDER_ITEM](state) {
        state.current = {}
    }
}

export default {
    state,
    mutations
}
