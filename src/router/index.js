// import layout from '@/views/layout/index.vue'
Vue.use(VueRouter)
import routes from './routes'
export default new VueRouter({
	mode: 'history',
	routes: routes
})