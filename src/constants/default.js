export default {
  style: {
    type: 'htmlStyle',
    title: '样式',
    value: {
      color: {
        type: "inputColor",
        value: "#c8c58a"
      },
      backgroundColor: {
        type: "inputColor",
        value: "#fffbcb"
      },
      backgroundImage: {
        type: "inputImage",
        value: null
      }
    }
  },
  shareTitle: {
    type: 'inputText',
    value: '测试文字'
  },
  shareLink: {
    type: 'inputText',
    value: 'http://'
  },
  shareContent: {
    type: 'inputTextarea',
    value: '测试文字'
  }
}
