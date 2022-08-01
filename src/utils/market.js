import * as web3 from "web3";
import {
    ContractAddress
} from './web3Helper';
import {
    AddressUrl
} from '@/config/ContractAddress'
var Web3 = require('web3');
var Web3Utils = require("web3-utils");
var web3Ref = new Web3(new Web3.providers.HttpProvider(AddressUrl.ContractUrl));

var authorizationABI = require('../assets/js/abi.json');
var authorization = ContractAddress; //授权合约地址
var authorizationContract = new web3Ref.eth.Contract(authorizationABI, authorization);

var contractABI = require('../assets/js/market.json');
var contractAddress = '0xA4309C194511E7003b82340B82eAaae247b2Cd83';
var contract = new web3Ref.eth.Contract(contractABI, contractAddress);
//发送授权申请
function author(TokenID, callback) {
    // var str = authorizationContract.methods.setApprovalForAll(contractAddress, true).encodeABI();
    var str = authorizationContract.methods.approve(contractAddress, TokenID).encodeABI();
    this.callTransfer(str, '0', authorization, function () {
        callback(true)
    }, err => {
        callback(false)
    })
}

//查询是否授权，授权则发送售卖交易，否则发送授权申请
function getAuthor(token, callback) {
    // this.author(()=>{})
    //authorizationContract.methods.isApprovedForAll(token, contractAddress).call().then(res => {
    authorizationContract.methods.isApprovedOrOwner(contractAddress, token).call().then(res => {
        if (res) {
            callback(true)
        } else {
            callback(false)
        }
    })
}
//售卖
function sell(tid, hPrice, scuuessCallback, errorCallBack) {
    hPrice = Web3Utils.toWei(hPrice);
    var sellObj = contract.methods.openTrade(tid, hPrice, '0x00').encodeABI();
    var value = "0";
    this.callTransfer(sellObj, value, contractAddress, function (result) {
        if (scuuessCallback)
            scuuessCallback(result);
    }, function (reson) {
        if (errorCallBack)
            errorCallBack(reson);
    });

}
/**
 * 购买
 * 余额不够需要提示。
 *  @param {Object} tokenId
 *  @param {Object} price
 *  @param {Object} succennCallback 成功回调
 *  @param {Object} errorCallBack 失败回调
 * */
function buy(tradeId, price, succennCallback, errorCallBack) {
    // 检测用户钱包里面是否有钱
    // web3Ref.eth.getBalance(window.ethereum.selectedAddress).then((balance) => {
    // 	//检测用户余额是否足够
    // });
    var obj = contract.methods.executeTrade(tradeId, '0x00').encodeABI();
    this.callTransfer(obj, price, contractAddress, function (result) {
        if (succennCallback)
            succennCallback(result);
    }, function (reson) {
        if (errorCallBack)
            errorCallBack(reson);
    });

}
//取消交易
function cancelSell(tid, callback, errorCallBack) {
    var value = "0";
    var obj = contract.methods.cancelTrade(tid, '0x00').encodeABI();
    this.callTransfer(obj, value, contractAddress, function (result) {
        if (callback)
            callback(result);
    }, function (reson) {

        if (errorCallBack)
            errorCallBack(reson);
    });

}

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
function callTransfer(dataObj, value, address, successCallback, errorCallBack) {
    Promise.all([getChainId(), getTransactionCount()]).then(res => {
        if (value == '') value = '1';
        let params = [{
            from: window.ethereum.selectedAddress,
            nonce: Web3Utils.toHex(res[1]),
            // nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
            to: address,
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
            }).catch(function (reason) {
                if (errorCallBack)
                    errorCallBack(reason)
                if (reject)
                    reject(reason)
            })
        })
    })
    //监听MetaMask的事件
    ethereum.on('accountsChanged',
        function (accounts) {
            console.log("accountsChanged", accounts[0]);
        })
}
export default {
    sell,
    buy,
    callTransfer,
    author,
    cancelSell,
    getAuthor
}