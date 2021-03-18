import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false
// axios请求相关前置，拦截，超时等预处理 
import './configs/axios'
// 路由权限，菜单等 
import './router/permission'
// 全局公用组件 
import './components/'
// 样式文件 
import './assets/css/base.less'
// 自定义指令
import './directive'

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')