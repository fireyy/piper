export const modules = [
  {
    title: '常规',
    items: [
      {
        alias: '相对定位',
        type: 'relative',
        icon: 'menu', //from http://element.eleme.io/#/zh-CN/component/icon
        children: [],
        data: {
          style: {
            type: 'htmlStyle',
            title: '样式',
            value: {
              height: {
                type: "inputNumber",
                value: "300px"
              }
            }
          }
        },
        component: require('./relative.vue')
      },
      {
        alias: '文本',
        type: 'txt',
        icon: 'edit',
        data: {
          content: {
            type: 'inputTextarea',
            value: '测试文字'
          },
          style: {
            type: 'htmlStyle',
            title: '样式',
            value: {
              textAlign: {
                type: "inputRadio",
                props: 'align',
                value: 'center'
              },
              font: {
                type: "inputFont",
                value: "normal normal 12px sans-serif"
              },
              color: {
                type: "inputColor",
                value: "#ffffff"
              },
              backgroundColor: {
                type: "inputColor",
                value: "#ff0000"
              },
              padding: {
                type: "inputWheel",
                value: "0 0 0 0"
              },
              margin: {
                type: "inputWheel",
                value: "0 0 0 0"
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
        style: {
          "top"   : "20px",
          "left"  : "20px"
        },
        data: {
          content: {
            type: 'inputText',
            title: '按钮文字',
            rule: {
              type: 'text'
            },
            value: '按钮'
          },
          size: {
            type: 'inputRadio',
            title: '按钮文字',
            props: 'btn-size',
            value: ''
          },
          theme: {
            type: 'inputRadio',
            title: '按钮颜色',
            props: 'btn-theme',
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
            type: 'group',
            title: '图片',
            value: [
              {
                'link': {
                  type: 'inputText',
                  value: null,
                },
                'image': {
                  type: 'inputImage',
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
        alias: '幻灯片',
        type: 'swipe',
        icon: 'picture',
        data: {
          pic: {
            type: 'group',
            title: '幻灯片',
            value: [
              {
                'link': {
                  type: 'inputText',
                  value: null,
                },
                'image': {
                  type: 'inputImage',
                  value: 'http://img1.ffan.com/T14.CTB4LT1RCvBVdK'
                }
              },
              {
                'link': {
                  type: 'inputText',
                  value: null,
                },
                'image': {
                  type: 'inputImage',
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
        type: 'countdown',
        icon: 'time',
        data: {
          time: {
            type: 'inputDate',
            sub: 'datetimerange',
            rule: 'timerange',
            value: []
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
