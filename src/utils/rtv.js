// rtvtoken 
import {
    Promise
} from "core-js";
import * as web3 from "web3";
import {ContractAddress} from './web3Helper';
import {AddressUrl} from '@/config/ContractAddress'
var Web3 = require('web3');
var Web3Utils = require("web3-utils");
var contractABI = require('../assets/js/rtv.json');
//tet_env
var web3Ref=new Web3(new Web3.providers.HttpProvider(AddressUrl.ContractUrl));
var contractAddress = '0x88A0fD77f23200a4A31FaC34017A1399Aba7f71a'
var contract = new web3Ref.eth.Contract(contractABI, contractAddress);
function claim(successCallback, errorCallBack) {
    var resObj = contract.methods.claim().encodeABI();
    let value = "0";
    this.callTransfer(resObj, value, function (result) {
        console.log("claim.result", result);
        if (successCallback)
            successCallback(result);
    }, function (reson) {
        console.log("claim.err", reson);
        if (errorCallBack)
            errorCallBack(reson);
    });
}

/**
 * buyPublic
 */
function deposit(value, successCallback, errorCallBack) {
    var resObj = contract.methods.deposit().encodeABI();

    this.callTransfer(resObj, value, function (result) {
        console.log("deposit.result", result);
        if (successCallback)
            successCallback(result);
    }, function (reson) {
        console.log("deposit.err", reson);
        if (errorCallBack)
            errorCallBack(reson);
    });
}
//判断能否解绑
function approve(price,successCallback, errorCallBack){
    var resObj = contract.methods.approve(ContractAddress,price).encodeABI();
    this.callTransfer(resObj,'0',(result)=>{
        console.log(result)
        successCallback(result);
    },err=>{
        errorCallBack(err);
    })
}
function getChainId() {
    return web3Ref.eth.getChainId()
}
function getTransactionCount() {
    return web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")
}
function callTransfer(dataObj, value, successCallback, errorCallBack) {
    Promise.all([getChainId(), getTransactionCount()]).then(res => {
        if (value == '') value = '1';
        let params = [{
            from: window.ethereum.selectedAddress,
            nonce: Web3Utils.toHex(res[1]),
            // nonce: Web3Utils.toHex(web3Ref.eth.getTransactionCount(window.ethereum.selectedAddress, "pending")),
            to: contractAddress,
            chainId: res[0],
            data: dataObj,
            value: Web3Utils.toHex(Web3Utils.toWei(value, "ether")),
        }];
        console.log(params,res,'params ,res')
        //ethereum.sendAsync方法发送以太币、调用智能合约：
        return new Promise((resolve, reject) => {
            ethereum.request({
                method: 'eth_sendTransaction',
                params: params,
            }).then(function (result) {
                console.log('callTransfer.success', result)
                if (successCallback)
                    successCallback(result)
                return resolve(result)
                // For example, this method will return a transaction hash on success.
            }).catch(function (reason) {
                console.log('callTransfer.catch', reason)
                if (errorCallBack)
                    errorCallBack(reason)
                if (reject)
                    reject(reason)
                // Like a typical promise, returns a reason on rejection.
            })
        })
    })

    //监听MetaMask的事件
    ethereum.on('accountsChanged',
        function (accounts) {
            console.log("accountsChanged", accounts[0]);
        })
}
function canClaim(address, callback) {
    contract.methods.canClaim(address).call().then(function (result) {
        console.log("canClaim.result", result);
        callback(result);
        return result;
    });
}
function BalanceOf(address,callback){
    contract.methods.balanceOf(address).call().then(result=>{
        callback(result);
    })
}
function balance(address, callback) {
    address = String(address);
    var balance = web3Ref.eth.getBalance(address);
    console.log("balance", balance);
    callback(balance);
    return balance;
}

//导出相应的方法
export
default {
    claim,
    deposit,
    callTransfer,
    canClaim,
    balance,
    BalanceOf,
    approve
}