import router from './index'
import store from '@/store'
// import menus from './menu.js'
import layout from '@/views/layout/'

// 免登陆可进入的页面(白名单)
const whiteList = ['/login', '/401', '/404']
// 全局加载
const loadingFun = (text = '初始化数据加载中...') => {
	return ELEMENT.Loading.service({
		lock: true,
		text
	})
}
let loading = false
// 数否需要获取授权
window.needAuth = true
// 路由前置
router.beforeEach(async (to, from, next) => {
	if (whiteList.includes(to.fullPath)) {
		next()
	} else {
		if (window.needAuth && !loading) {
			loading = loadingFun()
			// 获取登录用户信息，并验证是否登录
			console.log('verify the login information at initialization')
			let menus = []
			await store.dispatch('getUserInfo').then(res => {
				if (res.code == 200) {
					window.needAuth = false
					menus = res.data.menus
					window.userPosition = res.data.position
					window.permission = res.data.permission
				}
			}).catch(() => {
				loading.close()
			})

			if (!window.needAuth) {
				// 用户已经登录过
				await store.dispatch('getAllEnum').then(res => {
					if (res.code !== 200) {
						ELEMENT.Message({ type: 'error', duration: 0, showClose: true, message: `获取全局枚举信息失败！` })
					}
				}).catch(err => {
					ELEMENT.Message({ type: 'error', duration: 0, showClose: true, message: `获取全局枚举信息失败！` })
				})
			} else {
				// 用户还没有登录
				next({ path: '/login', replace: true })
				loading.close()
				loading = false
				return
			}
			// 递归方法
			function depthRoute(menus, routers) {
				menus.forEach(menu => {
					if (menu.child && menu.child.length) {
						depthRoute(menu.child, routers)
					} else {
						routers.push({
							path: menu.path,
							name: menu.name,
							component: () => import(`@/views${menu.file}`),
							meta: {
								...(menu.meta || {}),
								title: menu.name,
								icon: menu.icon
							}
						})
					}
				})
				return routers
			}
			store.dispatch('SetMenus', menus)
			// 递归菜单生成路由
			let routers = depthRoute(menus, [])
			console.log(routers)
			// 写入所有路由菜单
			router.addRoutes([{
				path: '/',
				name: '首页',
				component: layout,
				meta: {
					title: '首页'
				},
				children: [
					...routers,
					{
						path: '/403',
						name: '无权限',
						component: () => import('@views/error/403.vue'),
						meta: {
							title: '403',
							icon: 'el-icon-key'
						}
					}, {
						path: '*',
						name: '404',
						component: () => import('@views/error/404.vue'),
						meta: {
							title: '404',
							icon: 'el-icon-key'
						}
					}
				]
			}])
			next({ ...to, replace: true })
			loading.close()
			loading = false
		} else {
			if (to.meta && to.meta.role) {
				if (to.meta.role.includes(window.userPosition)) {
					next()
				} else {
					next('/403')
				}
			} else {
				next()
			}

		}
	}
})