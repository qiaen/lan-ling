let insertJSList = []
Vue.prototype.insertJs = item => {
	return new Promise((resolve, reject) => {
		if (item) {
			// 判断是否已经成功插入过此js
			if (insertJSList.includes(item)) {
				resolve()
			} else {
				let js = document.createElement('script')
				js.src = item
				document.querySelector('head').appendChild(js)
				js.onload = function() {
					insertJSList.push(item)
					resolve()
				}
				js.onerror = function() {
					reject(new Error(`写入文件失败：${item}`))
				}
			}
		} else {
			reject(new Error('缺少js文件路径'))
		}
	})
}
/* 
 * 自定义指令 开始 
 **/
Vue.directive('focus', {
	inserted: function(el) {
		el.focus()
		let child = el.querySelector('input')
		if (child) {
			child.focus()
		}
	}
})
// 全局权限指定，根据业务情况调整
Vue.directive('permission', (el, bind) => {
	// 权限列表
	let permission = window.permission
	if (permission) {
		let hide = false
		// 查找权限逻辑
		if (!permission.includes(bind.value)) {
			hide = true
		}
		if (hide) { el.style.display = 'none' }
	} else {
		el.style.display = 'none'
	}
})