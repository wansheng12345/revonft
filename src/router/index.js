import Vue from 'vue'
import VueRouter from 'vue-router'
import {
	isPc
} from '../utils'
import store from '../store'

Vue.use(VueRouter)
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

const routes = [{
		path: '/',
		name: 'home',
		//redirect:'/index',
		component: () =>
			import('../views/home/index.vue'),
	}, {
		path: '/homeIndex',
		name: 'homeIndex',
		component: () =>
			import('../views/home/homeIndex.vue'),
	}, {
		path: '/pickMarket',
		name: 'pickMarket',
		component: () =>
			import('../views/pickMarket/index'),
	},{
		path: '/tradingMarket',
		name: 'tradingMarket',
		component: () =>
			import('../views/tradingMarket/index'),
	}, {
		path: '/nftDetail',
		name: 'nftDetail',
		component: () =>
			import('../views/public/nftDetail'),
		meta: {
			keepAlive: false,
		}
	}, {
		path: '/mine',
		name: 'mine',
		component: () =>
			import('../views/mine/index'),
	},{
		path: '/nftHistory',
		name: 'nftHistory',
		component: () =>
			import('../views/public/nftHistory'),
	},
	{
		path: "/personal",
		name: 'personal',
		component: () => import('../views/personal/index.vue')
	},
	{
		path: "/rank",
		name: 'rank',
		component: () => import('../views/personal/ranking.vue')
	},
	{
		path: '/task',
		name: 'task',
		component: () => import('../views/personal/taskDetail.vue')
	},
	{
		path:'/test',
		name:'test',
		component:()=>import('../views/test/index.vue')
	}
]

const routesMobile = [{
		path: "/home-m",
		name: "home-m",
		component: resolve => require(['@/views/mobile/NewHome.vue'], resolve)
	},
	{
		path: '/homeIndex-m',
		name: 'homeIndex-m',
		component: () =>
			import('../views/mobile/homeIndex'),
	},
	{
		path: '/nftHistory-m',
		name: 'nftHistory-m',
		component: () =>
			import('../views/mobile/nftHistory'),
	},
	{
		path: '/nftDetail-m',
		name: 'nftDetail-m',
		component: () =>
			import('../views/mobile/nftDetail'),
	},
	{
		path: '/pickMarket-m',
		name: 'pickMarket-m',
		component: () =>
			import('../views/mobile/pickMarket'),
	},
	{
		path: '/tradingMarket-m',
		name: 'tradingMarket-m',
		component: () =>
			import('../views/mobile/tradingMarket'),
	},
	{
		path: '/mine-m',
		name: 'mine-m',
		component: () =>
			import('@/views/mobile/mine'),
	},
	{
		path: "/personal-m",
		name: 'personal-m',
		component: () => import('@/views/mobile/personal/index.vue')
	},
	{
		path: "/rank-m",
		name: 'rank-m',
		component: () => import('@/views/mobile/personal/ranking.vue')
	},
	{
		path: '/task-m',
		name: 'task-m',
		component: () => import('@/views/mobile/personal/taskDetail.vue')
	}
];

let totalRoutes = routes.concat(routesMobile);


const router = new VueRouter({
	routes: totalRoutes,
	mode: 'hash',
	strict: process.env.NODE_ENV !== 'production',
	//	scrollBehavior(to, from, savedPosition) {
	//		if(savedPosition) {
	//			return savedPosition
	//		} else {
	//			if(from.meta.keepAlive) {
	//				from.meta.savedPosition = document.body.scrollTop || document.documentElement.scrollTop
	//			}
	//			return {
	//				x: 0,
	//				y: to.meta.savedPosition || 0
	//			}
	//		}
	//	}
})
router.beforeEach((to, from, next) => {
	let name = to.name;
	console.log(name, to, isPc())
	if (isPc()) {
		let toPath = name.indexOf('-m') === -1;
		if (toPath) {
			next()
		} else {
			toPath = name.replace('-m', '')
			next('/' + toPath)
		}
	} else {
		console.log(toPath)
		let toPath = name.indexOf('-m') === -1;
		if (toPath) {
			toPath = name + '-m';
			console.log(toPath)
			next('/' + toPath)
		} else {
			next()
		}

	}
	// if (isPc() && name.indexOf('-m') === -1) {
	// 	next();
	// 	return;
	// }
	// if (!isPc() && name.indexOf('-m') !== -1) {
	// 	next();
	// 	return;
	// }
	// next(platformRedirect(to, next));

	// document.getElementsByTagName('title')[0].innerHTML = to.meta.title || 'Publish Nft'

})
router.onError((err) => {
	console.log(err, 'routerErr')
})
// router.afterEach((to) => {})

var platformRedirect = function (to) {
	console.log(to)
	/**
	 * 移动端 PC端兼容实现;
	 * PC端、移动端路由按一定规则对应，比如： PC： index, mobile: index-m
	 * 判断页面尺寸，小于某个尺寸时，根据规则重定向路由，重定向到对应终端:浏览器抱头为移动端或者浏览器宽度小于等于750都视为移动端
	 *
	 */

	let name = to.name;
	let query = to.query;
	let params = to.params;
	let meta = to.meta;

	if (!name) {
		return;
	}
	let newName = null

	if (isPc()) {
		//如果有-m，改成pc地址，如果没有替换不生效
		newName = name.replace('-m', '')
	} else {
		// 如果不带-m则添加，带的话就不操作
		if (name && name.indexOf('-m') === -1) {
			newName = name + '-m'
		} else {
			return
		}
	}

	if (queryRoutes(newName)) {
		return {
			name: newName,
			query: query,
			params: params,
			meta: meta
		};
	} else {
		if (isPc()) {
			return {
				name: 'index'
			};
		} else {
			return {
				name: 'index-m'
			};
		}
	}
}
// 可能存在PC页有，移动端没有的情况，要遍历路由数组确认name值有对应路由则跳转，否则跳到首页
var queryRoutes = function (name) {
	let routesList = router.options.routes;
	return queryRoutesFn(routesList, name);
}
var queryRoutesFn = function (list, name) {
	let flag = false;
	list.map(child => {
		if (child.name == name) {
			flag = true;
		} else {
			if (child.children && queryRoutesFn(child.children, name)) {
				flag = true;
			}
		}
	})
	return flag;
}
// var isPc = function(){
//     let winWidth = document.documentElement.clientWidth
//     return utils.isPC() && winWidth > 750
// }

export default router