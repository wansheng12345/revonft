import axios from './axiosConfig'
import qs from 'qs'
import Vue from 'vue'

/**
 * axiosPost
 * @param {url} url 请求地址.
 * @param {params} params 参数.
 * @param {timeout} timeout 超时.
 * @return {axiosPost}
 */
// let token = window.sessionStorage.getItem('Token')
export function axiosPost(url, params, timeout) {
	if(timeout) {
		axios.defaults.timeout = timeout
	} else {
		axios.defaults.timeout = 10000
	}
	return new Promise((resolve, reject) => {
		axios.post(url, params)
			.then((response) => {
				return resolve(response.data)
			}, (err) => {
				// isNotice 是否返回报错弹框，默认为是
				Vue.prototype.$message.error(err.response.data.message)
				reject(err)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

/**
 * axiosGet
 * @param {url} url 请求地址.
 * @param {params} params 参数.
 * @param {timeout} timeout 超时.
 * @return {axiosGet}
 */
export function axiosGet(url, params, timeout) {
	if(timeout) {
		axios.defaults.timeout = timeout
	} else {
		axios.defaults.timeout = 10000
	}
	return new Promise((resolve, reject) => {
		// 有可能params是占位符，当为''时，时占位符   get请求需要在baseUrl后面拼接请求体，post请求不需要
		if(params !== null && params !== '') {
			url = url + '?' + qs.stringify(params, {
				arrayFormat: 'repeat'
			})
		}
		// console.log('get url = ' + url)
		axios.get(url)
			.then((response) => {
				return resolve(response.data)
			}, (err) => {
				Vue.prototype.$message.error(err.response.data.message)
				reject(err)
			})
			.catch((error) => {
				reject(error)
				// showNotice('网络出现异常！')
			})
	})
}

/**
 * axiosPut
 * @param {url} url 请求地址.
 * @param {params} params 参数.
 * @param {timeout} timeout 超时.
 * @return {axiosPut}
 */
export function axiosPut(url, params, timeout) {
	if(timeout) {
		axios.defaults.timeout = timeout
	} else {
		axios.defaults.timeout = 10000
	}
	return new Promise((resolve, reject) => {
		axios.put(url, params)
			.then((response) => {
				return resolve(response.data)
			}, (err) => {
				Vue.prototype.$message.error(err.response.data.message)
				reject(err)
			})
			.catch((error) => {
				reject(error)
			})
	})
}

/**
 * axiosDelete
 * @param {url} url 请求地址.
 * @param {params} params 参数.
 * @param {timeout} timeout 超时.
 * @return {axiosDelete}
 */
export function axiosDelete(url, params, timeout) {
	if(timeout) {
		axios.defaults.timeout = timeout
	} else {
		axios.defaults.timeout = 10000
	}
	return new Promise((resolve, reject) => {
		// 有可能params是占位符，当为''时，时占位符
		// if (params !== null && params !== '') {
		// url = url + '?' + qs.stringify(params)
		// }
		// console.log('axiosDelete url = ' + url)
		axios.delete(url, {
				data: params
			})
			.then((response) => {
				return resolve(response.data)
			}, (err) => {
				Vue.prototype.$message.error(err.response.data.message)
				reject(err)
			})
			.catch((error) => {
				reject(error)
			})
	})
}