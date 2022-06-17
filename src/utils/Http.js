// 接口请求统一封装
export default class Http {
	static ask(method, url, data) {
		let m = method.toUpperCase()
		const payload = ['GET'].includes(m) ? 'params' : 'data'
		return axios({
			method,
			url,
			[payload]: data
		}).then(res => {
			if (res) {
				return res.data
			} else {
				Promise.reject(new Error())
			}
		}).catch(err => {
			Promise.reject(err)
		})
	}
}