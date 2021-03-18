const state = {
	// 是否打开作业登记
	openCheckIn: false,
	// 数据源
	dataSource: {
		mysql: []
	},
	// 当前选中的作业列表信息
	currtTaskRow: ''
}

const actions = {
	// 打开作业登记
	OpenCheckIn({ commit }, value) {
		commit('SET_OPEN_CHECK_IN', value)
	},
	SetDataSource({ commit }, { type, value }) {
		commit('SET_DATA_SOURCE', { type, value })
	},
	// 设定选中的任务
	SetTaskCurrtRow({ commit }, row) {
		commit('SET_TASK_CURRT_ROW', row)
	}
}
const mutations = {
	SET_OPEN_CHECK_IN(state, value) {
		state.openCheckIn = value
	},
	SET_DATA_SOURCE(state, { type, value }) {
		state.dataSource[type] = value
	},
	SET_TASK_CURRT_ROW(state, row) {
		state.currtTaskRow = row || ''
	}
}
export default {
	state,
	actions,
	mutations
}
