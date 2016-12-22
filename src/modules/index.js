export const modules = [
  {
    title: '常规',
    items: [
      {
        alias: '布局',
        type: 'relative',
        icon: 'menu', //from http://element.eleme.io/#/zh-CN/component/icon
        data: {},
        component: require('./relative.vue')
      },
      {
        alias: '文本',
        type: 'txt',
        icon: 'edit', //from http://element.eleme.io/#/zh-CN/component/icon
        data: {
          content: {
            type: 'inputTextarea',
            title: '内容',
            value: '测试文字'
          },
          style: {
            type: 'htmlStyle',
            title: '样式',
            value: {
              color: {
                type: "inputColor",
                value: "#ffffff"
              },
              backgroundColor: {
                type: "inputColor",
                value: "#ff0000"
              },
              padding: {
                type: "inputText",
                value: "10px"
              }
            }
          }
        },
        component: require('./txt.vue')
      },
      {
        alias: '按钮',
        type: 'btn',
        icon: 'minus',
        data: {
          content: {
            type: 'inputText',
            title: '按钮文字',
            value: '按钮'
          },
          size: {
            type: 'inputRadio',
            title: '按钮文字',
            props: [
              {
                title: "默认",
                value: ''
              },
              {
                title: "小",
                value: 'sm'
              },
              {
                title: "超小",
                value: 'xs'
              }
            ],
            value: ''
          },
          theme: {
            type: 'inputRadio',
            title: '按钮颜色',
            props: [
              {
                title: "默认",
                value: ''
              },
              {
                title: "主要",
                value: 'primary'
              }
            ],
            value: ''
          }
        },
        component: require('./btn.vue')
      }
    ]
  },
  {
    title: '图片',
    items: [
      {
        alias: '图片',
        type: 'poster',
        icon: 'picture',
        data: {
          pic: {
            type: 'pic',
            title: '图片',
            value: [
              {
                'link': {
                  value: null,
                },
                'image': {
                  value: 'http://img1.ffan.com/T1xEWTBmET1RCvBVdK'
                }
              }
            ],
            options: {
              max: 1
            }
          }
        },
        component: require('./poster.vue')
      },
      {
        alias    : '幻灯片',
        type     : 'swipe',
        icon   : 'picture',
        data: {
          pic: {
            type: 'pic',
            title: '幻灯片',
            value: [
              {
                'link': {
                  value: null,
                },
                'image': {
                  value: 'http://img1.ffan.com/T14.CTB4LT1RCvBVdK'
                }
              },
              {
                'link': {
                  value: null,
                },
                'image': {
                  value: 'http://img1.ffan.com/T1xEWTBmET1RCvBVdK'
                }
              }
            ],
            options: {
              max: 4
            }
          }
        },
        component: require('./swipe.vue')
      }
    ]
  },
  {
    title: '其他',
    items: [
      {
        alias: '倒计时',
        type: 'timer',
        icon: 'time',
        data: {
          time: {
            type: 'timer',
            title: '倒计时',
            value: {
              startTime: Date.now(),
              endTime: Date.now() + 1000 * 60 * 60 * 24 *2
            }
          }
        },
        component: require('./countdown.vue')
      }
    ]
  }
]

export let components = {};
modules.forEach(function(obj){
  if(obj.items && obj.items.length > 0) {
    obj.items.forEach(function(item){
      components[item.type] = item.component
    })
  }
});
