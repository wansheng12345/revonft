const { resolve } = require('path')

module.exports = {
    prod: {
        env: {
            NODE_ENV: '"production"'
        },
        index: resolve(__dirname, '../dist/index.html'),
        assetsRoot: resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: 'http://8.133.177.6:8103/',
        productionSourceMap: true,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        cdnPath: 'http://8.133.177.6:8103/'
    },
    dev: {
        env: {
            NODE_ENV: '"development"'
        },
        assetsRoot: resolve(__dirname, '../dist'),
        host: '0.0.0.0',
        port: 8080,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        cssSourceMap: false,
        cdnPath: 'static/js',
		 proxyTable: {
		      '/api': {
		        target: 'beta.chainwords.net:8992', // 请求服务器根路径
		        changeOrigin: true, // 是否跨域
		        ws: true, // websocket
		        pathRewrite: { // 重写路径: 当检测到请求地址里包含 /v1 时,将此路径进行跨域代理操作
		          '^/api': '/api'
		        }
		      }
		    }
        // cdnPath: 'http://8.133.177.6:8103/'
    }
}
