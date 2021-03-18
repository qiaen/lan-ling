import Storage from '@utils/Storage'
const state = {
	// 已打开的tab菜单, [{key:value}]
	menuTabs: [{ path: '/', label: 'Dashboard', icon: 'iconfont icon-dashboard' }],
	// 当前选中的tab
	currentTab: { path: '', label: '' },
	// 所有菜单, {}
	menus: {},
	// 是否展开菜单, 为"true"时折叠
	isCollapse: Storage.get('DSMenuCollapse') === 'true',
	/*
	 * 缓存的keep-alive页面name，不在此列则不缓存
	 * 注意：为了方便管理，这里的name采用的是path，所以组件命名也要用path
	 * [value]
	 **/
	cachedViews: [],
	// 当前需要展开的菜单, [value]
	defaultOpeneds: []
}

const actions = {
	// 修改项目菜单
	SetMenus({ commit }, menus) {
		commit('SET_MENUS', menus)
	},
	// 新增一个tab
	SetMenusTab({ commit }, tab) {
		commit('SET_MENUS_TAB', tab)
	},
	// 设定选中的tab
	SetCurrentTab({ commit }, tab) {
		commit('SET_CURRENT_TAB', tab)
	},
	// 删除一个tab
	RemoveTab({ commit }, tab) {
		// tabs只有一个时不能删除/
		if (tab.path === '/' && state.menuTabs.length <= 1) {
			return Promise.reject('tabs只有一个时不能删除/')
		}
		commit('REMOVE_TAB', tab)
	},
	// 菜单是否折叠
	SetMenuCollapse({ commit }, value) {
		commit('SET_MENU_COLLAPSE', value)
	},
	// 关闭所有，关闭其他tabs
	CloseTabs({ commit }, type) {
		commit('SET_CLOSE_TABS', type)
	}
}
const mutations = {
	SET_MENUS(state, menus) {
		state.menus = menus
	},
	SET_MENUS_TAB(state, tab) {
		let has = state.menuTabs.some(item => {
			return item.path === tab.path
		})
		if (!has) {
			state.menuTabs.push(tab)
		}
	},
	// 路由变动时会执行
	SET_CURRENT_TAB(state, tab) {
		// 在打开的tabs内找当前要选中的tab
		let currt = state.menuTabs.filter(item => {
			return item.path === tab.path
		})
		if (currt.length) {
			// tabs内存在要打开的tab
			state.currentTab = currt[0]
		} else {
			// 不存在则添加新的
			state.menuTabs.push(tab)
			state.currentTab = tab
			// 在要缓存的页面列表添加当前path，这里修改成根据路由meta信息来判定页面是否需要缓存
			state.cachedViews.push(tab.path)
		}
		// 如果菜单未折叠，匹配menus拿到要展开的菜单
		if (state.isCollapse) {
			let menus = state.menus
			for (let item of menus) {
				if (item.child && item.child.length) {
					if (item.child.some(m => m.path === tab.path)) {
						state.defaultOpeneds = [item.path]
						break
					}
				}
			}
		}

	},
	REMOVE_TAB(state, tab) {
		// 在已打开的tabs中删除
		for (let [index, item] of state.menuTabs.entries()) {
			if (item.path === tab.path) {
				state.menuTabs.splice(index, 1)
				if (tab.path === state.currentTab.path) {
					break
				}
			}
		}
		// 在缓存的页面中删除
		let index = state.cachedViews.indexOf(tab.path)
		if (index > -1) { state.cachedViews.splice(index, 1) }
	},
	SET_MENU_COLLAPSE(state, value) {
		state.isCollapse = value
		Storage.set('DSMenuCollapse', value)
	},
	// 关闭所有，关闭其他tabs
	SET_CLOSE_TABS(state, type) {
		if (type === 'all') {
			state.menuTabs = [{ path: '/', label: 'Dashboard', icon: 'iconfont icon-dashboard' }]
			state.cachedViews = []
		}
		if (type === 'others') {
			state.menuTabs = state.menuTabs.filter(item => item.path == state.currentTab.path)
			state.cachedViews = [state.currentTab.path]
		}
	}
}
export default {
	state,
	actions,
	mutations
}