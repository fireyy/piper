export const modules = [
    {
        title: '图片',
        items: [
            {
                alias    : '图片',
                type     : 'poster-single',
                icon   : 'image',
                component: (resolve) => require(['./poster-single.vue'], resolve)
            },
            {
                alias    : '幻灯片',
                type     : 'poster-many',
                icon   : 'collections',
                component: (resolve) => require(['./poster-many.vue'], resolve)
            }
        ]
    }
]

export let components = _.reduce(_.chain(modules).map('items').flatten().value(), (obj, item) => {
    obj[item.type] = item.component
    return obj
}, {})

