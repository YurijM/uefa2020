const pkg = require('./package');

module.exports = {
  mode: 'universal',

  server: {
    //port: (process.env.NODE_ENV === 'production' ? 8080 : 3000),
    host: (process.env.NODE_ENV === 'production' ? '185.119.57.155' : 'localhost')
    //port: '5000',
    //host: '192.168.1.64'
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: pkg.description}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#4A148C'},

  /*
  ** Global CSS
  */
  css: [
    { src: '~assets/scss/main.scss', lang: 'scss' }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    {src: '~/plugins/vuetify', ssr: false},
    {src: '~/plugins/socket', ssr: false}
  ],

  /*
  ** Router settings
  */
  router: {
    middleware: ['auth']
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    'cookie-universal-nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    /*['@nuxtjs/vuetify', {
      icons: {
        iconfont: 'fa'
      }
    }]*/
  ],

  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.NODE_ENV === 'production'
      ? 'http://185.119.57.155'
      : 'http://localhost:3000'
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
    }
  },
};
