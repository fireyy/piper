const path = require('path')

module.exports = {
  srcDir: 'client/',
  /*
  ** Router config
  */
  router: {
    middleware: [
      'check-auth'
    ]
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Piper',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'A drag-and-drop mobile website builder base on Vue.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/main.css'
  ],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build
  */
  build: {
    vendor: [
      'axios',
      'element-ui',
      'interactjs',
      'lodash',
      'qr.js',
      'feather-icons'
    ],
    extend (config, { dev, isClient }) {
      config.resolve.alias['_variable.less'] = path.join(__dirname, './assets/skin/_variable.less'),
      config.resolve.alias['_base.less'] = path.join(__dirname, './assets/skin/_base.less')
    }
  },
  plugins: [
    '@/plugins/filters.js',
    '@/plugins/element-ui.js',
    '@/plugins/axios-defaults'
  ]
}
