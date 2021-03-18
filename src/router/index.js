import layout from '@/views/layout/index.vue'
Vue.use(VueRouter)
export default new VueRouter({
	routes: [{
		path: '/',
		name: '首页',
		component: layout,
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
		}, {
			path: '/login',
			name: '登录',
			component: () => import('@views/login/'),
			meta: {
				icon: 'el-icon-s-platform',
				title: 'login'
			}
		}]
	}]
})