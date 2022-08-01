const state = {
	userInfo: {},
	userLoginInfo: {},
	userToken:''
}
const getters = {
	userToken: (state) => {
		//  if (state.userLoginInfo.jwtToken) {
		//    const loginExpireTime = new window.Date(state.userLoginInfo.loginValidity.replace(/-/g, '/')).getTime()
		//    const nowTime = new window.Date().getTime()
		//    if (nowTime > loginExpireTime) {
		//      // store.commit(types.SET_USER_LOGOUT)
		//      return ''
		//    } else {
		//      return state.userLoginInfo.jwtToken
		//    }
		//  } else {
		//    return state.userLoginInfo.jwtToken
		//  }
		return(state.userToken) || ''
	},
	userInfo: (state) => {
		return state.userInfo
	},
	userId: (state) => {
		return state.userLoginInfo.userId
	},
	userLoginInfo: (state) => {
		return state.userLoginInfo
	}
}
const mutations = {
	SET_USER_INFO(state, userInfo) {
		// console.log(userInfo, 'userInfo111')
		state.userInfo = userInfo
	},
	SET_TOKEN(state, userToken) {
		// console.log(userToken, 'userInfo111 sss')
		state.userToken = userToken
	},
	SET_USER_LOGIN_INFO(state, userLoginInfo) {
		state.userLoginInfo = userLoginInfo
	},
	SET_USER_LOGOUT(state) {
		state.userInfo = {}
		state.userLoginInfo = {}
	}
}

const actions = {
	// user login
}

export default {
	namespaced: false,
	getters,
	state,
	mutations,
	actions
}