import axios from 'axios'
import qs from 'qs'
import store from '../store'
import Mixin from '@/mixins/index.js';
// http request 拦截器
console.log(Mixin)
axios.interceptors.request.use(
	(config) => {
		// alert(3)
		// console.log(config, 'config')
		// 设置请求头中的appid参数
		// config.headers['Content-Type'] = 'application/json;charset=utf-8'
		// config.headers['request_header_user_id'] = 1
		let token = window.sessionStorage.getItem('Token')
		if (token) {
			config.headers.Authorization = "Bearer " + token
		}
		if (config.data instanceof window.FormData) {
			// console.log('{Content-Type: application/x-www-form-urlencoded}')
		} else {
			if (config.method === 'post' || config.method === 'put') {
				config.headers['Content-Type'] = 'application/json;charset=utf-8'
			}
			if (config.method === 'get') {
				config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
				config.data = qs.stringify(config.data)
			}
			if (config.method === 'delete') {
				config.headers['Content-Type'] = 'application/json;charset=utf-8'
			}
		}
		return config
	},
	(err) => {
		return Promise.reject(err)
	}
)

// http response 拦截器
axios.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		if (error.response) {
			switch (error.response.status) {
				case 401:
					sessionStorage.removeItem("Token");
					// 401 清除token信息并跳转到登录页面
					// store.commit(types.SET_USER_LOGOUT)
					// window.vm.$router.push({
					//     path: '/loginEntrance',
					//     query: {
					//         redirect: window.vm.$router.currentRoute.fullPath
					//     }
					// })
					break
				case 403:
					// 403 跳转至登录页面（供应商被冻结）
					break
				case 404:
					// 404 跳转至404页面
					break
				case 406:
					// 406 跳转至登录页面（个人账号被冻结）
					break
				case 409:
					// 入驻成功
					break
				case 500:
					// 500 跳转至维修中页面
					break
				default:
					return Promise.reject(error)
			}
			return Promise.reject(error)
		}
	})
export default axios