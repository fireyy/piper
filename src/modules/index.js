import _ from "lodash";
import map from "lodash/fp/map";
import flatten from "lodash/fp/flatten";
import compose from "lodash/fp/compose";

export const modules = [
    {
      title: '常规',
      items: [
        {
            alias    : '文本',
            type     : 'txt',
            icon   : 'edit',
            data : {
              style: {
                type   : 'prop',
                title  : '样式',
                value  : [
                  {
                    key: "Margin",
                    value: '0px'
                  },
                  {
                    key: "Padding",
                    value: '0px'
                  }
                ]
              }
            },
            component: require('./txt.vue')
        }
      ]
    },
    {
        title: '图片',
        items: [
            {
                alias    : '图片',
                type     : 'poster',
                icon   : 'picture',
                data : {
                  pic: {
                      type   : 'pic',
                      title  : '图片',
                      value  : [{
                          url   : null,
                          picUrl: 'http://img1.ffan.com/T1xEWTBmET1RCvBVdK'
                      }],
                      options: {
                          max: 1
                      }
                  }
                },
                component: require('./poster.vue')
            },
            // {
            //     alias    : '幻灯片',
            //     type     : 'slider',
            //     icon   : 'picture',
            //     component: require('./slider.vue')
            // }
        ]
    }
]

export let components = _.reduce(
  compose(
    flatten, 
    map('items')
  )(modules), 
  (obj, item) => {
    obj[item.type] = item.component
    return obj
  }, 
  {}
)
