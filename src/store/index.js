import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', false, /\.js$/)

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	// set './app.js' => 'app'
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
	const value = modulesFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})

const store = new Vuex.Store({
	modules,
	state: {
		ethereumAddress: true,
		address: '',
		ShowDownMenu: 0,
	},
	mutations: {
		SetShowDownMenu(store, data) {
			store.ShowDownMenu = data
		},
		setEthereumAddress(store, data) {
			store.ethereumAddress = data;
		},
		setAddress(store, data) {
			if (data != store.address && data && data != undefined && data != 'undefined') {
				store.address = data  ;
				sessionStorage.setItem("setAddress", data);
			}
		}
	},
	getters: {
		ethereumAddress: (state) => {
			return state.ethereumAddress
		},
		address: (state) => {
			if (window.ethereum) {
				let address = state.address || window.ethereum.selectedAddress || null;
				if (address == undefined) return address = null
				return address
			} else {
				let address = state.address || null;
				if (address == undefined) return address = null
				return address
			}
		}
	}
})

export default store