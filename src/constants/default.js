export default {
  title: '网页标题',
  items: [],
  config:{
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
        }
      }
    },
    shareTitle: {
      type: 'inputText',
      title: '分享标题',
      value: '测试文字'
    },
    shareLink: {
      type: 'inputText',
      title: '分享链接',
      value: 'http://'
    },
    shareContent: {
      type: 'inputTextarea',
      title: '分享文案',
      value: '测试文字'
    }
  }
}
