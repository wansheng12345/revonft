// Rtv721 
import * as web3 from "web3";
import store from '@/store'
import request from "@/services/request";
import {
	AddressUrl
} from '@/config/ContractAddress'
var Web3 = require('web3');
var Web3Utils = require("web3-utils");
var contractABI = require('../assets/js/abi.json');
//网络配置
const development = false; //是否是开发环境
let chainId = development ? Web3Utils.fromDecimal('18678') : Web3Utils.fromDecimal('7777');
let chainName = development ? 'dev testnet' : "REVO testnet";
let rpcUrls = development ? 'https://www.revonft.com/chain/dev/' : "https://www.revonft.com/chain/";
//tet_env
var web3Ref = new Web3(new Web3.providers.HttpProvider(AddressUrl.ContractUrl));
export var ContractAddress = '0x537D9D6B5eA1ae930428FBc4d31fA3AAbec86F7f'
var contract = new web3Ref.eth.Contract(contractABI, ContractAddress);

function isAddress() {
	ethereum.request({
		method: 'eth_chainId'
	}).then(res => {
		// let ethereumAddress=Web3Utils.toDecimal(res);
		if (res != chainId) {
			// sessionStorage.removeItem('Token')
			if (window.innerWidth > 500) {
				store.commit('setEthereumAddress', 'pc')
			} else {
				store.commit('setEthereumAddress', 'mobile')
			}
		} else {
			store.commit('setEthereumAddress', true)
		}
	})
}

function addNetwork(callback) {
	window.ethereum.request({
		method: 'wallet_addEthereumChain', // Metamask的api名称
		params: [{
			chainId,
			chainName, // 添加到钱包后显示的网络名称
			rpcUrls: [rpcUrls],
		}]
	}).then(res => {
		callback(res)
		console.log(res, '添加成功')
	}).catch(err => {
		console.log(err, '添加失败')
	})
}

function init(callback) {
	//判断用户是否安装MetaMask钱包插件
	if (typeof window.ethereum === "undefined") {
		//没安装MetaMask钱包进行弹框提示
		alert("Looks like you need a Dapp browser to get started. Consider installing MetaMask!");
		// alert("Consider installing MetaMask!");
		if (callback) {
			callback(0);
		}
	} else {
		isAddress()
		// ethereum.autoRefreshOnNetworkChange = false; //切换网络时自动重载
		//监听MetaMask的事件
		let that = this;
		ethereum.on('accountsChanged',
			function (accounts) {
				store.commit("setAddress", accounts[0]);
				sessionStorage.setItem("setAddress", accounts[0]);
				sessionStorage.setItem("iSsignature", false);
				sessionStorage.removeItem("Token");
				location.reload()
			});
		//网络连接监听
		ethereum.on('chainChanged',
			function (chainId) {
				isAddress();
				// location.reload()
			})
		//如果用户安装了MetaMask，你可以要求他们授权应用登录并获取其账号
		
		
		// ethereum.enable().then(function (accounts) {
		// 	if (callback) {

		// 		callback(1);
		// 	}

		// }).catch(function (reason) {
		// 	//如果用户拒绝了登录请求
		// 	if (reason === "User rejected provider access") {
		// 		// 用户拒绝登录后执行语句；
		// 		console.log("User rejected provider access");
		// 		if (callback) {
		// 			callback(-1);
		// 		}
		// 	} else {
		// 		// 本不该执行到这里，但是真到这里了，说明发生了意外
		// 		/*alert("There was an issue signing you in.");*/
		// 		console.log("There was an issue signing you in.");
		// 		if (callback) {
		// 			callback(-2);
		// 		}
		// 	}
		// });


	}
}
// /**
//  * 投资
//  * */
// function join(account, addr, val, callback) {
// 	//要支付的ETH，十六进制
// 	let value = "0x0";
// 	//智能合约的参数也需要进行转换
// 	//web3Ref.utils.padLeft左侧补0补齐到指定长度的字符串
// 	//参数数字转换
// 	val = web3Ref.utils.toHex(val).substring(2);
// 	val = web3Ref.utils.padLeft(val, 64);
// 	//参数地址转换
// 	addr = web3Ref.utils.padLeft(addr, 64).substring(2)
// 	//智能合约方法，获取方式看下面
// 	let fun = "0x095ea7b3";
// 	let data = fun + addr + val;
// 	sendTransfer(account, data, value, callback, errorCallBack);
// }
// /**
//  * 发送交易
//  * @param {Object} account 用户地址
//  * @param {Object} data 数据
//  * @param {Object} value 转账金额
//  * @param {Object} callback 返回hash
//  * @param {Object} errorCallBack 返回的错误
//  */
// function sendTransfer(data, price, callback, errorCallBack) {
// 	console.log("data",data)
// 	// estimateGas获取交易的 gas 用量
// 	// let value = price;
// 	let value = "1";
//
// 	console.log("value", value)
// 	var mintObj = contract.methods.mintToSelf(data).encodeABI();
//
// 	console.log("mintToSelf",mintObj);
// 	let params = [{
// 		// gasPrice: gasPrice,
// 		// gasLimit: gaslimit,
// 		from: window.ethereum.selectedAddress,
// 		nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
// 		to: ContractAddress,
// 		chainId: "0x3",
// 		data: mintObj,
// 		value: Web3Utils.toHex(Web3Utils.toWei(value, "ether")),
// 	},
// 	];
//
// 	console.log("params", params)
//
// 	//ethereum.sendAsync方法发送以太币、调用智能合约：
// 	return new Promise((resolve, reject) => {
// 		ethereum.request({
// 			method: 'eth_sendTransaction',
// 			params: params,
// 		}).then(function (result) {
// 			console.log('result', result)
// 			return resolve(result)
// 			// For example, this method will return a transaction hash on success.
// 		}).catch(function (reason) {
//
// 			console.log('catch', reason)
// 			reject(reason)
// 			// Like a typical promise, returns a reason on rejection.
// 		})
// 	})
// 	//监听MetaMask的事件
// 	ethereum.on('accountsChanged',
// 		function (accounts) {
// 			console.log("accountsChanged", accounts[0]);
// 		})
// }

function getChainId() {
	return web3Ref.eth.getChainId()
}

function getTransactionCount() {
	return web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")
}
/**
 * 发送交易
 * @param {Object} dataObj 交易Data
 * @param {Object} value 交易金额
 * @param {Object} callback 返回hash
 * @param {Object} errorCallBack 返回的错误
 */
function callTransfer(dataObj, value, successCallback, errorCallBack) {
	Promise.all([getChainId(), getTransactionCount()]).then(res => {
		if (value == '') value = '1';
		let params = [{
			from: window.ethereum.selectedAddress,
			nonce: Web3Utils.toHex(res[1]),
			// nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
			to: ContractAddress,
			chainId: res[0],
			data: dataObj,
			value: Web3Utils.toHex(Web3Utils.toWei(value, "ether")),
		}];
		//ethereum.sendAsync方法发送以太币、调用智能合约：
		return new Promise((resolve, reject) => {
			ethereum.request({
				method: 'eth_sendTransaction',
				params: params,
			}).then(function (result) {
				if (successCallback)
					successCallback(result)
				return resolve(result)
				// For example, this method will return a transaction hash on success.
			}).catch(function (reason) {
				if (errorCallBack)
					errorCallBack(reason)
				if (reject)
					reject(reason)
				// Like a typical promise, returns a reason on rejection.
			})
		})
	})
	// web3Ref.eth.getChainId().then(res => {
	//     if (value == "")
	//         value = "1";
	//         console.log(test(),'999')
	//     let params = [{
	//         from: window.ethereum.selectedAddress,
	//         nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
	//         // nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
	//         to: ContractAddress,
	//         chainId: res,
	//         data: dataObj,
	//         value: Web3Utils.toHex(Web3Utils.toWei(value, "ether")),
	//     }];
	//     console.log("callTransfer", params)
	//     //ethereum.sendAsync方法发送以太币、调用智能合约：
	// return new Promise((resolve, reject) => {
	//     ethereum.request({
	//         method: 'eth_sendTransaction',
	//         params: params,
	//     }).then(function (result) {
	//         console.log('callTransfer.success', result)
	//         if (successCallback)
	//             successCallback(result)
	//         return resolve(result)
	//         // For example, this method will return a transaction hash on success.
	//     }).catch(function (reason) {
	//         console.log('callTransfer.catch', reason)
	//         if (errorCallBack)
	//             errorCallBack(reason)
	//         if (reject)
	//             reject(reason)
	//         // Like a typical promise, returns a reason on rejection.
	//     })
	// })
	// })

	//监听MetaMask的事件
	ethereum.on('accountsChanged',
		function (accounts) {
			console.log("accountsChanged", accounts[0]);
		})
}
//获取签名
function Sign(message, address, success, errorCallBack) {
	let msg = Buffer.from(message, 'utf8').toString('hex');
	window.ethereum.request({
		method: 'personal_sign',
		params: [msg, address],
	}).then(res => {
		success(res)
	}).catch(err => {
		errorCallBack(err)
	})
}
/**
 * 调用mintToSelf方法
 * */
function mintToSelf(tokenURI, id, callback, errorCallBack) {
	console.log("tokenURI", tokenURI);
	console.log("id", id);
	var resObj = contract.methods.mintToSelf(tokenURI, id).encodeABI();
	console.log("mintToSelf", resObj);
	let $this = this;
	/*setTimeout(function(){
		$this.callTransfer(resObj,amount, function (result) {
			if (callback)
				callback(result);
		}, function (reson) {
			if (errorCallBack)
				errorCallBack(reson);
		})
	},6*1000);*/
	let amount = "0.01";
	this.callTransfer(resObj, amount, function (result) {
		if (callback) {
			callback(result);
			location.reload();
		}
	}, function (reson) {
		console.log(reson, errorCallBack)
		if (errorCallBack)
			errorCallBack(reson);
	})
}
/**
 * 授权接口
 *  @param {Object} to 当前身份的
 *  @param {Object} tokenid nft的tokenid
 * */
function approve(tokenid, successCallback, errorCallBack) {

	console.log("approve", tokenid);
	var value = "0";
	var obj = contract.methods.approve(ContractAddress, tokenid).encodeABI();
	console.log("approve.obj", obj);

	this.callTransfer(obj, value, function (result) {
		if (successCallback)
			successCallback(result);
	}, function (reson) {

		if (errorCallBack)
			errorCallBack(reson);
	});

}
//解绑
function unBind(tokenID, callback, errorCallBack) {
	var uBalance = contract.methods.unBind(tokenID).encodeABI();
	let value = "0";
	this.callTransfer(uBalance, value, function (result) {
		if (callback)
			callback(result);
	}, function (reson) {
		if (errorCallBack)
			errorCallBack(reson);
	});

}

//获取价格
function getPrice(callback) {
	contract.methods.nextPrice().call().then(result => {
		callback(result);
	});
}
/**
 * 挂单
 *  @param {Object} tid:tokenId
 *  @param {Object} hPrice 价格(单位wei)
 *  @param {Object} scuuessCallback  成功时候回调
 *  @param {Object} errorCallBack  失败时候回调
 */
function sell(tid, hPrice, scuuessCallback, errorCallBack) {
	hPrice = Web3Utils.toWei(hPrice);
	console.log("sell.tid+price", hPrice);
	var sellObj = contract.methods.sell(tid, hPrice).encodeABI();
	console.log("sell.sellObj", sellObj);

	var value = "0"
	this.callTransfer(sellObj, value, function (result) {

		console.log("sell.success1", result);
		if (scuuessCallback)
			scuuessCallback(result);
	}, function (reson) {
		console.log("sell.err1", reson);
		if (errorCallBack)
			errorCallBack(reson);
	});

}


/**
 * 取消挂单
 *  @param {Object} tid:tokenId
 *  @param {Object} callback  成功时候回调
 *  @param {Object} errorCallBack  失败时候回调
 */
function cancelSell(tid, callback, errorCallBack) {
	console.log(contract.methods)
	console.log("cancelSell.tid", tid);
	var value = "0";
	var obj = contract.methods.cancel(tid).encodeABI();
	console.log("cancelSell.obj", obj);
	this.callTransfer(obj, value, function (result) {
		if (callback)
			callback(result);
	}, function (reson) {

		if (errorCallBack)
			errorCallBack(reson);
	});

}


/**
 * 余额查询。
 *  @param {Object} owner 所属身份的地址
 * */
function balance(owner) {

	console.log("balance.owner", owner)
	var uBalance = web3Ref.eth.getBalance(window.ethereum.selectedAddress)
		.then((response) => {

			console.log("balance", response);
			return response
		});

	return uBalance;
}

/**
 * 购买
 * 余额不够需要提示。
 *  @param {Object} tokenId
 *  @param {Object} price
 *  @param {Object} succennCallback 成功回调
 *  @param {Object} errorCallBack 失败回调
 * */
function buy(tokenId, price, succennCallback, errorCallBack) {

	// 检测用户钱包里面是否有钱
	// web3Ref.eth.getBalance(window.ethereum.selectedAddress).then((balance) => {
	// 	console.log("balance",balance);
	// 	//检测用户余额是否足够
	// });
	var obj = contract.methods.buy(tokenId).encodeABI();
	this.callTransfer(obj, price, function (result) {
		console.log("buy.result", result);
		if (succennCallback)
			succennCallback(result);
	}, function (reson) {
		console.log("buy.err", reson);
		if (errorCallBack)
			errorCallBack(reson);
	});

}

/**
 * 开始游戏
 * */
function startGame(tokenID, callback, errorCallBack) {
	console.log("startGame.tokenId", tokenID)
	let value = "0";
	var obj = contract.methods.startGame(tokenID).encodeABI();
	this.callTransfer(obj, value, function (result) {
		console.log("startGame.result", result);
		if (callback)
			callback(result);
	}, function (reson) {

		console.log("startGame.err", reson);
		if (errorCallBack)
			errorCallBack(reson);
	});


}


/**
 * 点赞或者踩
 *  @param {Object} tokenID nft的tokenid
 *  @param {Object} price nft的price
 *  @param {Object} typa 投票类别：1表示👍 2表示👎；
 *  @param {Object} successCallback 成功回调
 *  @param {Object} errorCallBack 失败回调
 * */
function vote(tokenID, price, typa, successCallback, errorCallBack) {

	// 查询合约余额
	var balance = web3Ref.eth.getBalance(ContractAddress);
	console.log("contract.balance", balance);
	price = "0.1"; // 投票默认是0.1 eth
	var obj = null;
	// if(balance>price) {// 账户里没钱就调用vote1，有钱就调用vote2
	obj = contract.methods.vote(tokenID, '1', typa).encodeABI();
	// }else{
	// 	obj =  contract.methods.vote2(tokenID,typa).encodeABI();
	// }
	this.callTransfer(obj, price, function (result) {
		console.log("vote.result", result);
		if (successCallback)
			successCallback(result);
	}, function (reson) {
		console.log("vote.err", reson);
		if (errorCallBack)
			errorCallBack(reson);
	});
}

//
// function vote1(data, callback, errorCallBack) {
// 	console.log(data)
// 	// estimateGas获取交易的 gas 用量
// 	let value = "2";
// 	let params = [{
// 		// gasPrice: gasPrice,
// 		// gasLimit: gaslimit,
// 		from: window.ethereum.selectedAddress,
// 		nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
// 		to: ContractAddress,
// 		chainId: "0x3",
// 		data: contract.methods.vote1(data).encodeABI(),
// 		value: Web3Utils.toHex(Web3Utils.toWei(value, "ether")),
// 	},
// 	];
// 	console.log(params, "ssssss")
// 	//ethereum.sendAsync方法发送以太币、调用智能合约：
// 	ethereum.request({
// 		method: 'eth_sendTransaction',
// 		params: params,
// 	}).then((txHash) =>resolve(txHash), console.log(txHash, 'txHash')).
// 	catch((error) =>console.error);
// 	//监听MetaMask的事件
// 	ethereum.on('accountsChanged',
// 		function(accounts) {
// 			console.log(accounts[0])
// 		})
// }
//
// function vote2(data, callback, errorCallBack) {
// 	console.log(data)
// 	// estimateGas获取交易的 gas 用量
// 	let value = "2";
// 	let params = [{
// 		// gasPrice: gasPrice,
// 		// gasLimit: gaslimit,
// 		from: window.ethereum.selectedAddress,
// 		nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
// 		to: ContractAddress,
// 		chainId: "0x3",
// 		data: contract.methods.vote1(data).encodeABI(),
// 		value: Web3Utils.toHex(Web3Utils.toWei(value, "ether")),
// 	},
// 	];
// 	console.log(params, "ssssss")
// 	//ethereum.sendAsync方法发送以太币、调用智能合约：
// 	ethereum.request({
// 		method: 'eth_sendTransaction',
// 		params: params,
// 	}).then((txHash) =>resolve(txHash), console.log(txHash, 'txHash')).
// 	catch((error) =>console.error);
// 	//监听MetaMask的事件
// 	ethereum.on('accountsChanged',
// 		function(accounts) {
// 			console.log(accounts[0])
// 		})
// }

/**
 * 查询 当前地址对应的 tokenID 数组的长度
 * */
function balanceOf(owner, callback) {
	contract.methods.balanceOf(owner).call().then(function (result) {
		callback(result);
		return result;
	});
}

/**
 * 获取token
 * */
function tokenOfOwnerByIndex(owner, length, callback) {
	contract.methods.tokenOfOwnerByIndex(owner, length - 1).call().then(function (result) {
		console.log("tokenOfOwnerByIndex.result", result);
		callback(result);
		return result;
	});
}

/**
 * 根据owner 获取last token: 先调用balanceOf ，然后调用tokenOfOwnerByIndex
 *
 * */
function queryTokenByOwner(owner, callback) {
	var that = this;
	console.log("balanceOf.owner", owner)
	this.balanceOf(owner, function (count) {
		console.log("balanceOf.result", count)
		that.tokenOfOwnerByIndex(owner, count - 1, function (result) {
			console.log("tokenOfOwnerByIndex.result", result)
			if (callback)
				callback(result);
		}, function (err) {
			console.log("tokenOfOwnerByIndex.err", err)
		})
	});
}

/**
 * 提现接口
 */
function withdraw(successCallback, errorCallBack) {
	var resObj = contract.methods.withdraw().encodeABI();
	console.log("withdraw", resObj);
	var amount = "0";
	this.callTransfer(resObj, amount, function (result) {
		console.log("withdraw.success", result)
		if (successCallback)
			successCallback(result);
	}, function (reson) {
		console.log("withdraw.error", reson)
		if (errorCallBack)
			errorCallBack(reson);
	});

}

/**
 * 结算接口
 * @param {Object} tokenID nft的tokenid
 */
function endRound(tokenID, successCallback, errorCallBack) {
	var resObj = contract.methods.endRound(tokenID).encodeABI();
	console.log("endRound", resObj);
	let value = "0";
	this.callTransfer(resObj, value, function (result) {
		console.log("endRound.result", result);
		if (successCallback)
			successCallback(result);
	}, function (reson) {
		console.log("endRound.err", reson);
		if (errorCallBack)
			errorCallBack(reson);
	});
}

/**
 * 转换
 * @param {Object} value
 */
function fromWei(value) {
	if (value != "") {
		return Web3Utils.fromWei(value);
	}
}

/**
 * 转换
 * @param {Object} value
 */
function toWei(value) {
	if (value != "") {
		return Web3Utils.toWei(value);
	}
}

/**
 * 转换时间
 */
function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

/**
 * 检测是否投票
 */
function checkIsVotedOneGame(address, tokenID, callback) {
	contract.methods.checkIsVotedOneGame(address, tokenID).call().then(function (result) {
		console.log(result);
		callback(result);
		return result;
	})
}


//导出相应的方法
export
default {
	init, //初始化
	// sendTransfer,
	startGame, //游戏开始
	sell, //挂单
	balanceOf, //当前地址对应的 tokenID 数组的长度
	tokenOfOwnerByIndex, //获取token
	queryTokenByOwner,
	callTransfer, //发送交易
	mintToSelf,
	approve, //approve
	//balance,
	cancelSell, //取消挂单
	vote, //投票或者踩
	buy, //购买
	withdraw, //提现
	endRound, //结算
	fromWei, //转换
	unBind,
	toWei,
	getLocalTime,
	checkIsVotedOneGame, //检测是否投票
	getPrice,
	addNetwork,
	Sign,
}