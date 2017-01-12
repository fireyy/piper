export default {
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' },
    { min: 1, max: 20, message: '长度在 1-20 个字符', trigger: 'blur' }
  ],
  link: [
    { type: 'url', required: true, message: '请输入链接', trigger: 'blur' }
  ],
  time: [
    { required: true, message: '请选择时间', trigger: 'blur' }
  ],
  timerange: [
    { type: 'array', required: true, message: '请选择时间', trigger: 'blur' }
  ]
}
