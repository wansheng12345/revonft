module.exports = {
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].title = 'Revolution'
        return args
      })
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true
        return args
      })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: []
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') { // 生产环境不输出日志
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  publicPath: "./",
  outputDir: "dist",
  lintOnSave: false,
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          //  require("postcss-px2rem")({
          //   remUnit: 192///设计图宽度/10
          //  })
        ]
      }
    }
  }

}