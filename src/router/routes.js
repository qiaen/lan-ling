// 注意，name要和组件内的name一致，用于路由缓存识别！！！
// disCache：true配置后，禁用页面缓存
import layout from '@/views/layout/'
export default [{
	path: "/",
	name: "首页",
	component: layout,
	meta: {
		title: "首页",
	},
	children: [{
			path: '403',
			name: '无权限',
			file: '/error/403.vue',
			component: () => import('@views/error/403.vue'),
			meta: {
				title: '403',
				icon: 'el-icon-key'
			}
		},
		{
			path: '*',
			name: '404',
			file: '/error/404.vue',
			component: () => import('@views/error/404.vue'),
			meta: {
				title: '404',
				icon: 'el-icon-key'
			}
		}
	],
}]