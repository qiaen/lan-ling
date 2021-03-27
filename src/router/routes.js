// 注意，name要和组件内的name一致，用于路由缓存识别！！！
// disCache：true配置后，禁用页面缓存
export default [{
	path: '/',
	name: '首页',
	component: import('@/views/layout/index.vue'),
	meta: {
		title: '首页'
	},
	children: [{
		path: '',
		name: 'Dashboard',
		component: () => import('@views/daily/index.vue'),
		meta: {
			title: 'dashboard',
			icon: 'iconfont icon-dashboard'
		}
	}]
}, {
	path: '/login',
	name: '登录',
	component: () => import('@views/login/'),
	meta: {
		icon: 'el-icon-s-platform',
		title: 'login'
	}
}]