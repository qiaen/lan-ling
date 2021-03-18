// 为了节省首次加载资源的损耗，不会造成页面抖动的务必使用懒加载
// 滚动加载
const scroll = () => import('./scroll')
Vue.component('scroll', scroll)
// 抽屉
const drawer = () => import('./drawer')
Vue.component('drawer', drawer)
// 分割线
import sline from './sline'
Vue.component('sline', sline)
// 折叠搜索项
import filters from './filters'
Vue.component('filters', filters)