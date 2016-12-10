export const modules = [{
  title: '常规',
  items: [{
    alias: '文本',
    type: 'txt',
    icon: 'edit',
    data: {
      content: {
        type: 'inputText',
        title: '内容',
        value: '测试文字'
      },
      style: {
        type: 'htmlStyle',
        title: '样式',
        value: {
          color: {
            type: "color",
            value: "#ffffff"
          },
          backgroundColor: {
            type: "color",
            value: "#ff0000"
          },
          padding: {
            type: "string",
            value: "10px"
          }
        }
      }
    },
    component: require('./txt.vue')
  }]
}, {
  title: '图片',
  items: [{
      alias: '图片',
      type: 'poster',
      icon: 'picture',
      data: {
        pic: {
          type: 'pic',
          title: '图片',
          value: [{
            url: null,
            picUrl: 'http://img1.ffan.com/T1xEWTBmET1RCvBVdK'
          }],
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
            value: [{
              url: null,
              picUrl: 'http://img1.ffan.com/T14.CTB4LT1RCvBVdK'
            }, {
              url: null,
              picUrl: 'http://img1.ffan.com/T1xEWTBmET1RCvBVdK'
            }],
            options: {
              max: 6
            }
          }
        },
        component: require('./swipe.vue')
    }
  ]
},
{
  title: '其他',
  items: [{
    alias: '倒计时',
    type: 'timer',
    icon: 'time',
    data: {
      time: {
        type: 'timer',
        title: '倒计时',
        value: {
          start: Date.now(),
          end: Date.now() + 1000 * 60 * 60 * 24 *2
        }
      }
    },
    component: require('./countdown.vue')
  }]
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
