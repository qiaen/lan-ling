import getters from './getters'
import common from './modules/common'
import api from './modules/api'
import layout from './modules/layout'
Vue.use(Vuex)

export default new Vuex.Store({
	getters,
	modules: {
		common,
		layout,
		api
	}
})