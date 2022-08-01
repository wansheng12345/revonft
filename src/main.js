import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import './assets/style/theme/index.css'
import './assets/style/main.css'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
import Web3 from 'web3'
import VueClipboard from 'vue-clipboard2'
Vue.prototype.Web3 = Web3
// 引入echarts
import * as echarts from 'echarts'
import wcSwiper from 'wc-swiper'
import 'wc-swiper/style.css'
import VueI18n from 'vue-i18n';
import Mixin from './mixins/index.js';
import connectMetamask from "./components/message/connect-metamask.vue";
import VueCropper from 'vue-cropper'
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole()
// Vue.use(vConsole)
Vue.mixin(Mixin);
Vue.use(VueI18n);
Vue.use(VueCropper);
let DEFAULT_LANG = 'en';
let localeLanguage = window.sessionStorage.getItem('Language');
const locales = {
	//   'zh': require('@/assets/lang/zh.js'),
	'en': require('@/assets/lang/en.js'),
	'ja': require('@/assets/lang/ja.js'),
	'ko': require('@/assets/lang/ko.js'),
	'cn': require('@/assets/lang/cn.js'),
}
if (localeLanguage) {
	DEFAULT_LANG = localeLanguage;
}
const i18n = new VueI18n({
	locale: DEFAULT_LANG,
	messages: locales
});
Vue.use(wcSwiper);
// 更改原型Echarts名称
Vue.prototype.$echarts = echarts
let selectedAddress;
if (window.ethereum) {
	selectedAddress = window.ethereum.selectedAddress;
}
Vue.prototype.checkAccountToken = function () {
	if (window.ethereum && window.ethereum.selectedAddress) {
		return true;
	} else {
		return false;
	}
};
Vue.prototype.getAccountToken = function () {
	if (window.ethereum && window.ethereum.selectedAddress) {
		return window.ethereum.selectedAddress;
	} else {
		return null;
	}
};

//获取Session Storage ,查看是否过期
Vue.prototype.getStorageToken=()=>{
	let token;
	let TimeOut = sessionStorage.getItem("TimeOut");
	let nowData=new Date().getTime();
	//查看是否过期，过期返回空，
	//小于24小时
	if(nowData-TimeOut<86400000&&TimeOut){
		token=sessionStorage.getItem("Token")
	}else{
		sessionStorage.removeItem("Token");
		sessionStorage.removeItem("TimeOut");
		token=''
	}
	return token;
}
let address = sessionStorage.getItem('setAddress') || selectedAddress;
store.commit("setAddress", address);
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.component('connectMetamask', connectMetamask)
Vue.config.productionTip = false
window.vm = new Vue({
	el: '#app',
	i18n,
	router,
	store,
	render: h => h(App)
})

router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);

})