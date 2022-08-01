import {
  axiosGet,
  axiosPost
} from '../api/api'
import { BASE_V_API } from '../config/env'
import axios from "axios";
export default {

  download(params) {
    return axiosPost(BASE_V_API + `/file/download`, params)
  },
  uptoipfs(params) {
    return axiosPost(BASE_V_API + `/file/up-to-ipfs`, params)
  },
  addnft(params) {
    return axiosPost(BASE_V_API + `/nft/add`, params)
  },
  searchnft(params) {
    return axiosPost(BASE_V_API + `/search`, params)
  },
  balance(params) {
    return axiosPost(BASE_V_API + `/nft/balance`, params)
  },
  // 获取nft池子
  getNftPending(params) {
    return axiosPost(BASE_V_API + `/nft/pending`, params)
  },
  // 获取nft详情
  getNftInfo(params) {
    return axiosPost(BASE_V_API + `/info`, params)
  },
  // 添加收藏nft
  addMyCollect(params) {
    return axiosPost(BASE_V_API + `/nft/add-my-collect`, params)
  },
  // 取消收藏nft
  delMyCollect(params) {
    return axiosPost(BASE_V_API + `/nft/del-my-collect`, params)
  },
  //交易历史
  saleHistory(params){
    return axiosPost(BASE_V_API + `/nft/sales`, params)
  },
  //收藏的NFT
  myCollect(params){
    return axiosPost(BASE_V_API + `/nft/my-collect`, params)
  },
  //nft售卖
  afterSell(params){
    return axiosPost(BASE_V_API + `/nft/after-sell`, params)
  },
  //配置nft基本信息
  getUrl(params){
    return axiosPost(BASE_V_API + `/nft/get-url`, params);
  },
  //nft详情参与人数
  players: function(params){
    return axiosPost(BASE_V_API + `/nft/players`, params);
  },
  //mine页面参与历史
  historyOfParticipation: function(params){
    return axiosPost(BASE_V_API + `/nft/history-of-participation`, params);
  },
  //检测游戏当前的状态是什么
  checkJoin: function(params){
    return axiosPost(BASE_V_API + `/nft/check-join`, params);
  },
  //根据数据查单轮游戏详情
  joinRecord:function(params){
    return axiosPost(BASE_V_API + `/nft/join-record`, params);
  },
  //bannerBaseInfo
  saleBalance:function(params){
    return axiosPost(BASE_V_API + `/sale/balance`, params);
  },
  //bannerBaseInfo
  saleBase:function(params){
    return axiosPost(BASE_V_API + `/sale/base`, params);
  },
  //表格数据
  distribution:function(params){
    return axiosPost(BASE_V_API + `/sale/distribution`, params);
  },
  //饼状图
  pieChart:function(params){
    return axiosPost(BASE_V_API + `/sale/pie-chart`, params);
  },
  //倒计时
  status:function(params){
    return axiosPost(BASE_V_API + `/sale/status`, params);
  },
  //详情
  active:function(params){
    return axiosPost(BASE_V_API + `/sale/tx-list`, params);
  },
  //添加nft 调用后台接口
  addNft:function(params){
    return axiosPost(BASE_V_API + `/nft/add`, params);
  },
  remove:(params)=>{
    return axiosPost(BASE_V_API + `/nft/del-invalid-nft`, params);
  },
  getDestroy:params=>{
    return axiosPost(BASE_V_API + `/nft/get-destroy-rate`, params);
  },
  //获取任务信息
  getTaskDetail:(params)=>{
    return axiosPost(BASE_V_API + `/nft/task_detail`, params);
  },
  //获取balance 
  getBalance:(params)=>{
    return axiosPost(BASE_V_API + `/nft/sys-balance`, params);
  },
  // 获取recent 
  getRecent:(params)=>{
    return axiosPost(BASE_V_API + `/nft/recent`, params);
  },
  //获取个人信息
  address_info:(params)=>{
    return axiosPost(BASE_V_API + `/nft/address_info`, params);
  },
  get_user:(params)=>{
    return axiosPost(BASE_V_API + `/get_user`, params);
  },
  metamask_login:(params)=>{
    return axiosPost(BASE_V_API + `/metamask_login`, params);
  },
  //投票排行榜
  voteRank:(params)=>{
    return axiosPost(BASE_V_API + `/nft/votes_rank`, params);
  },
  //获票排行榜
  getVoteRank:(params)=>{
    return axiosPost(BASE_V_API + `/nft/get_votes_rank`, params);
  },
  //查询opting 页面数据
  getOpting:(params)=>{
    return axiosPost(BASE_V_API + `/option`, params)
  },
  //查询market 页面数据
  getMarket:(params)=>{
    return axiosPost(BASE_V_API + `/market`, params)
  },
  //上传图片
  uploadImg:(params)=>{
    return axiosPost(BASE_V_API +'/file/up-to-ipfs', params)
  }
}

