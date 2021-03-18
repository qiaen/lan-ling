const getters = {
	// 已打开的tabs
	menuTabs: state => state.layout.menuTabs,
	// 所有的菜单
	menus: state => state.layout.menus,
	// 当前选中的tab
	currentTab: state => state.layout.currentTab,
	// 是否展开菜单
	isCollapse: state => state.layout.isCollapse,
	// 缓存的keep-alive页面的name，注意是页面内的name，不在此列则不缓存
	cachedViews: state => state.layout.cachedViews,
	// 当前需要展开的菜单
	defaultOpeneds: state => state.layout.defaultOpeneds,
	// 用户信息
	userInfo: state => state.api.userInfo,
	// 用户权限菜单
	userMenu: state => state.api.userMenu,
	// 所有服务器枚举
	serviceEnum: state => state.api.serviceEnum,
	// 打开任务登记页面
	openCheckIn: state => state.common.openCheckIn,
	// 数据源下拉相关
	dataSource: state => state.common.dataSource,
	// 当前选中的作业列表信息
	currtTaskRow: state => state.common.currtTaskRow
}

export default getters
