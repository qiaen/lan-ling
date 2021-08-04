const path = require('path')

const base = {
	isProd: process.env.NODE_ENV === 'production',
	// 项目页面title
	name: '兰陵王 - 后台管理系统',
	// 目标接口域名
	target: 'https://lanling.diumx.com'
}
module.exports = {
	devServer: {
		host: process.env.HOST,
		port: process.env.PORT && Number(process.env.PORT),
		open: false,
		overlay: {
			warnings: false,
			errors: true
		},
		proxy: {
			// 项目接口
			'/api': {
				target: base.target,
				changeOrigin: true, //是否跨域
				pathRewrite: {
					'^/api': '/api' //重写接口
				},
				cookieDomainRewrite: ''
			}
		}
	},
	assetsDir:'assets',
	chainWebpack(config) {
		config.set('name', base.name)
		config.plugins.delete('prefetch')
		config.when(!base.isProd, config => config.devtool('cheap-source-map'))
		config.when(base.isProd, config => {
			config.optimization.splitChunks({
				chunks: 'all'
			})
		})
	},
	configureWebpack: {
		externals: {
			'vue': 'Vue',
			'Vuex': 'Vuex',
			'vue-router': 'VueRouter',
			'Axios': 'axios'
		},
		resolve: {
			alias: {
				'@$': path.resolve('src'),
				'@assets': path.resolve('src/assets'),
				'@img': path.resolve('src/assets/img'),
				'@views': path.resolve('src/views'),
				'@components': path.resolve('src/components'),
				'@api': path.resolve('src/api'),
				'@configs': path.resolve('src/configs'),
				'@utils': path.resolve('src/utils')
			}
		}
	},
	publicPath: '/',
	lintOnSave: !base.isProd,
	productionSourceMap: false,
	pwa: {
		name: base.name,
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
		}
	},
}