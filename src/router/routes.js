// 注意，name要和组件内的name一致，用于路由缓存识别！！！
// disCache：true配置后，禁用页面缓存
import layout from '@/views/layout/index.vue'
export default [{
	path: '/',
	name: '首页',
	component: layout,
	meta: {
		title: '首页'
	},
	/* 有一个问题： 为什么/不能不指定，指定了以后无法更改？不能被缓存 */
	children: [{
		path: '/',
		name: 'Dashboard',
		component: () => import('@views/dashboard/index.vue'),
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