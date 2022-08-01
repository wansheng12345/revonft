<template>
  <div class="mobile-container">
    <Header custom-active="3"></Header>
    <div class="tools">
      <el-tabs class="custom-tabs" v-model="activeName" @tab-click="changeTab">
        <el-tab-pane :label="$t('lang.myNFT')" name="0"></el-tab-pane>
        <el-tab-pane :label="$t('lang.participation')" name="1"></el-tab-pane>
        <el-tab-pane :label="$t('lang.follow')" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <ul class="tabs-list">
      <li>
        <ul class="list">
          <!-- my NFT -->
          <div v-if="activeName == '0'">
            <li v-for="(item, i) of dataSource" :key="i">
              <div class="img-box">
                <img :src="base + item.Path" class="view" alt="" />
                <img
                  src="./../../assets/img/creat.png"
                  class="bg-img"
                  @click="toDetail(item)"
                  alt=""
                />
                <div
                  class="info-text"
                  v-if="item.IsRunning || (item.Status == 1 && item.isEnd)"
                >
                  {{ $t("lang.waiting") }}
                </div>
                <div class="card-info" v-if="item.IsOnSelling == 1">
                  <p>
                    <img :src="require('@/assets/img/shopcart.svg')" alt="" />
                    <span>{{ $t("lang.sellPrice") }}</span>
                  </p>
                  <p>
                    <img src="./../../assets/img/icon.png" alt="" />
                    <span class="price">{{ item.Price }}</span>
                  </p>
                </div>
                <!-- 待审核 审核失败 文字提示 -->
                <div
                  class="info-examin"
                  v-if="
                    item.IsOnSelling == 0 &&
                    !item.IsRunning &&
                    item.isOwner &&
                    !item.TokenID &&
                    item.IsCheck != 2
                  "
                >
                  <span v-if="item.IsCheck == 1">Under Review</span>
                  <span v-if="item.IsCheck == 3" class="Failed">Failed</span>
                </div>
                <div class="foot" v-if="item.IsRunning">
                  <img src="../../assets/img/icon.sm.png" />
                  <div class="progress-n">
                    <div class="progress-num">
                      <span>{{ item.ApproveCount }}</span>
                      <span class="cor">{{ item.DefuseCount }}</span>
                    </div>
                    <div class="progress">
                      <span
                        class="progressing"
                        v-bind:style="'width:' + item.Rate * 100 + '%'"
                      ></span>
                    </div>
                  </div>
                  <img src="../../assets/img/icon-k.png" />
                </div>
                <div class="mark"># {{ item.TokenID.substr(0, 4) }}</div>
              </div>
              <div class="info">
                <div class="row">
                  <h5>
                    {{
                      item.Owner.substr(0, 8) +
                      "...." +
                      item.Owner.substr(item.Owner.length - 8, 8)
                    }}
                  </h5>
                  <h4>{{ item.Title }}</h4>
                </div>
                <div class="row">
                  <div :class="{ row: item.IsOnSelling != 1 }">
                    <span>{{ $t("lang.value") }}</span>
                    <p>
                      <img src="./../../assets/img/icon.png" alt="" />
                      <span v-if="item.IsOnSelling == 1">{{
                        item.Price == "" ? "~" : item.Price
                      }}</span>
                      <span v-else>{{
                        item.Amount == "" ? "~" : item.Amount
                      }}</span>
                    </p>
                  </div>
                  <img
                    :src="require('@/assets/img/circle-arrow.svg')"
                    class="icon"
                    @click="cancelSell(item.TradeId)"
                    v-if="item.IsOnSelling == 1"
                  />
                </div>
                <!-- 审核 -->
                <div
                  class="mitn_btn"
                  v-if="
                    item.IsOnSelling == 0 &&
                    !item.IsRunning &&
                    item.isOwner &&
                    !item.TokenID &&
                    item.IsCheck == 2
                  "
                >
                  <span class="mint-button" @click="shouMintDialog(item)"
                    >Mint</span
                  >
                  <!-- <span class="unbind">unbind</span> -->
                </div>
                <div
                  class="btn-info"
                  :class="{ 'ja-btn-info': langs == 'ja' || langs == 'ko' }"
                  v-if="
                    item.IsOnSelling == 0 &&
                    item.isOwner &&
                    !item.IsRunning &&
                    item.TokenID
                  "
                >
                  <div @click="OnStartGame(item.TokenID)">
                    {{ $t("lang.publish") }}
                  </div>
                  <div
                    class="Sell"
                    v-if="item.NextSaleTime * 1000 - new Date().getTime() < 0"
                    @click="handleSell(item)"
                  >
                    {{ $t("lang.sell") }}
                  </div>
                  <div class="Sell" v-else>
                    <countDate
                      size="small"
                      :remain-time="
                        item.NextSaleTime * 1000 - new Date().getTime()
                      "
                      @sell="handleSell(item)"
                    />
                  </div>
                  <img
                    src="@/assets/img/ellipsis.png"
                    @click="handlleUnbind(item)"
                    class="ellipsis"
                    alt=""
                  />
                </div>
              </div>
            </li>
            <li class="nodata" v-if="dataSource.length == 0">
              <img src="./../../assets/img/nodata_items.png" alt="" />
            </li>
          </div>
          <div v-if="activeName == '1'">
            <li v-for="(item, i) of dataSource" :key="i">
              <div class="img-box">
                <!-- <div class="collect" @click="addCollect(item)">
                  <img
                    :src="require('@/assets/img/heart-fill.svg')"
                    v-if="item.IsCollect"
                    alt=""
                  />
                  <img :src="require('@/assets/img/heart.svg')" v-else alt="" />
                </div> -->
                <img :src="base + item.Path" class="view" alt="" />
                <img
                  src="./../../assets/img/creat.png"
                  class="bg-img"
                  @click="toHistoryDetail(item)"
                  alt=""
                />
                <div class="info-text" v-if="item.Status == 1">
                  {{ $t("lang.waiting") }}
                </div>
                <div class="foot" v-if="item.Status == 1 || item.Status == 2">
                  <img src="../../assets/img/icon.sm.png" />
                  <div class="progress-n">
                    <div class="progress-num">
                      <span>{{ item.ApproveCount }}</span>
                      <div class="win" v-if="item.Result == 1"></div>
                      <div class="lose" v-if="item.Result == 2"></div>
                      <div class="draw" v-if="item.Result == 3"></div>
                      <span class="cor">{{ item.DefuseCount }}</span>
                    </div>
                    <div class="progress">
                      <span
                        class="progressing"
                        v-bind:style="'width:' + item.Rate * 100 + '%'"
                      ></span>
                    </div>
                  </div>
                  <img src="../../assets/img/icon-k.png" />
                </div>
                <div class="mark"># {{ item.TokenID.substr(0, 4) }}</div>
              </div>
              <div class="info">
                <h5>
                  {{
                    item.Owner.substr(0, 8) +
                    "...." +
                    item.Owner.substr(item.Owner.length - 8, 8)
                  }}
                </h5>
                <h4>{{ item.Title }}</h4>
                <div class="row rowItem">
                  <span>{{ $t("lang.value") }}</span>
                  <p>
                    <img src="./../../assets/img/icon.png" alt="" />
                    <span v-if="item.IsOnSelling == 1">{{
                      item.Price == "" ? "~" : item.Price
                    }}</span>
                    <span v-else>{{
                      item.Amount == "" ? "~" : item.Amount
                    }}</span>
                  </p>
                </div>
              </div>
            </li>
            <li class="nodata" v-if="dataSource.length == 0">
              <img src="./../../assets/img/nodata_participated.png" alt="" />
            </li>
          </div>
          <!-- collect -->
          <div v-if="activeName == '2'">
            <li v-for="(item, i) of dataSource" :key="i">
              <div class="img-box">
                <!-- <div class="collect" @click="addCollect(item)">
                  <img
                    :src="require('@/assets/img/heart-fill.svg')"
                    v-if="item.IsCollect"
                    alt=""
                  />
                  <img :src="require('@/assets/img/heart.svg')" v-else alt="" />
                </div> -->
                <img :src="base + item.Path" class="view" alt="" />
                <img
                  src="./../../assets/img/creat.png"
                  class="bg-img"
                  @click="toDetail(item)"
                  alt=""
                />
                <div class="info-text" v-if="item.IsRunning">
                  {{ $t("lang.waiting") }}
                </div>
                <div class="card-info" v-if="item.IsOnSelling == 1">
                  <p>
                    <img :src="require('@/assets/img/shopcart.svg')" alt="" />
                    <span>{{ $t("lang.sellPrice") }}</span>
                  </p>
                  <p>
                    <img src="./../../assets/img/icon.png" alt="" />
                    <span class="price">{{ item.Price }}</span>
                  </p>
                </div>
                <div
                  class="btn-info"
                  v-if="
                    item.IsOnSelling == 0 &&
                    item.isOwner &&
                    !item.IsRunning &&
                    !item.TokenID
                  "
                >
                  <div @click="OnStartGame(item.TokenID)">
                    {{ $t("lang.publish") }}
                  </div>
                  <div class="Sell" @click="handleSell(item)">
                    {{ $t("lang.sell") }}
                  </div>
                </div>
                <div class="foot" v-if="item.IsRunning">
                  <img src="../../assets/img/icon.sm.png" />
                  <div class="progress-n">
                    <div class="progress-num">
                      <span>{{ item.ApproveCount }}</span>
                      <div class="win" v-if="item.Result == 1"></div>
                      <div class="lose" v-if="item.Result == 2"></div>
                      <div class="draw" v-if="item.Result == 3"></div>
                      <span class="cor">{{ item.DefuseCount }}</span>
                    </div>
                    <div class="progress">
                      <span
                        class="progressing"
                        v-bind:style="'width:' + item.Rate * 100 + '%'"
                      ></span>
                    </div>
                  </div>
                  <img src="../../assets/img/icon-k.png" />
                </div>
                <div class="mark"># {{ item.TokenID.substr(0, 4) }}</div>
              </div>
              <div class="info">
                <h5>
                  {{
                    item.Owner.substr(0, 8) +
                    "...." +
                    item.Owner.substr(item.Owner.length - 8, 8)
                  }}
                </h5>
                <h4>{{ item.Title }}</h4>
                <div class="row">
                  <div>
                    <span>{{ $t("lang.value") }}</span>
                    <p>
                      <img src="./../../assets/img/icon.png" alt="" />
                      <span v-if="item.IsOnSelling == 1">{{
                        item.Price == "" ? "~" : item.Price
                      }}</span>
                      <span v-else>{{
                        item.Amount == "" ? "~" : item.Amount
                      }}</span>
                    </p>
                  </div>
                  <img
                    :src="require('@/assets/img/circle-arrow.svg')"
                    @click="cancelSell(item.TradeId)"
                    class="icon"
                    v-if="item.IsOnSelling == 1 "
                  />
                </div>
              </div>
            </li>
            <li class="nodata" v-if="dataSource.length == 0">
              <img src="./../../assets/img/nodata_follow.png" alt="" />
            </li>
          </div>
        </ul>
      </li>
    </ul>
    <Footer></Footer>
    <sale-drawer ref="SaleDrawer"></sale-drawer>
    <!-- 铸造弹窗 -->
    <el-dialog
      :visible="showMint"
      title="COMPLETE CHECKOUT"
      :close-on-click-modal="false"
      width="85%"
      custom-class="mint-dialog"
      @close="closeDialog"
    >
      <div class="left-img" v-if="item.Path">
        <img :src="base + item.Path" />
      </div>
      <ul>
        <li><span>Title：</span>{{ item.Title }}</li>
        <li>
          <span>VAlue:</span>
          <p>
            <img src="./../../assets/img/icon.png" alt="" />
            <span>{{ price }}</span>
          </p>
        </li>
        <li><span>Description:</span>{{ item.Description }}</li>
      </ul>
      <div class="mint-Confirm">
        <el-button @click="handleMint()" :loading="btnLoading" round
          >Confirm check out</el-button
        >
      </div>
    </el-dialog>
    <Cancel
      :ShowTooltip="ShowTooltip"
      :TradeId="TradeId"
      @closeTooltip="closeTooltip"
    ></Cancel>
    <connectMetamask ref="showMetamask"></connectMetamask>
    <!-- 失败弹窗 -->
    <Fail ref="failed"></Fail>
    <Bind ref="bind"></Bind>
  </div>
</template>
<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import SaleDrawer from "./modules/saleDrawer";
import Fail from "./modules/Failed.vue";
import request from "@/services/request";
import ad from "../../utils/web3Helper.js";
import market from "@/utils/market";
import { BASE_V_API } from "@/config/env";
import CountDate from "@/components/CountDate.vue";
import Bind from "./modules/bind/index";
import Cancel from "@/components/mobile/cancel.vue";
export default {
  name: "mine-m",
  data() {
    return {
      activeName: "0",
      dataSource: [],
      base: "",
      sort: 1,
      loading: null,
      tokenID: "",
      ShowTooltip: false,
      showMint: false,
      price: "",
      item: "",
      btnLoading: false,
      TradeId: "",
      timers: "",
    };
  },
  components: {
    SaleDrawer,
    Header,
    Footer,
    Fail,
    CountDate,
    Bind,
    Cancel,
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
    langs() {
      return this.$i18n.locale;
    },
  },
  created() {
    this.getMyNFT();
    this.base = BASE_V_API;
  },
  methods: {
    //关闭弹窗
    closeTooltip() {
      this.ShowTooltip = false;
    },
    handlleUnbind(item) {
      this.$refs.bind.showBind(item);
    },
    handleMint() {
      this.btnLoading = true;
      this.showLoading();
      var para = {
        cid: this.item.Cid,
        description: this.item.Description,
        owner: this.address,
        title: this.item.Title,
      };
      request.getUrl(para).then((res) => {
        ad.mintToSelf(
          res.data.url,
          res.data.id,
          (hash) => {
            this.loading.close();
            this.closeDialog();
          },
          (err) => {
            this.loading.close();
            var data = {
              title: this.$t("lang.transactionFailed"),
              desc: this.$t("lang.failedDesc"),
            };
            that.$emit("fail", data);
          }
        );
      });
    },
    closeDialog() {
      this.showMint = false;
    },
    shouMintDialog(item) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        if (item.IsCheck != 2) return;
        ad.getPrice((res) => {
          this.price = ad.fromWei(res);
          this.item = item;
          this.showMint = true;
        });
      }
    },
    toDetail(item) {
      if (!item.TokenID) return;
      this.$router.push({
        name: "nftDetail-m",
        query: { tokenID: item.TokenID },
      });
    },
    toHistoryDetail(item) {
      console.log(item);
      if (item.Status == 2) {
        this.$router.push({
          name: "nftHistory-m",
          query: {
            tokenID: item.TokenID,
            Reward: item.Reward,
            Scale: item.Scale,
            round: item.Round,
          },
        });
      } else {
        this.$router.push({
          name: "nftDetail-m",
          query: { tokenID: item.TokenID },
        });
      }
    },
    //出售
    handleSell(item) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        console.log(item, "handleSell");
        this.$refs.SaleDrawer.item = item;
        this.$refs.SaleDrawer.openDialog();
      }
    },
    updateList() {
      if (this.activeName == "0") {
        this.getMyNFT();
      } else if (this.activeName == "1") {
        this.getMyHistory();
      } else if (this.activeName == "2") {
        this.getMyCollected();
      }
    },
    //关闭弹窗
    CloseTooltip() {
      this.ShowTooltip = false;
    },
    //下架弹窗
    cancelSell(TradeId) {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.TradeId = TradeId;
        this.ShowTooltip = true;
      }
    },
    //收藏 or 取消收藏
    addCollect(item) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        var para = {
          address: this.address,
          token_id: item.TokenID,
        };
        if (item.IsCollect == true) {
          request.delMyCollect(para).then((response) => {
            if (response.code == 200) {
              this.$message({
                message: "删除收藏成功",
                type: "success",
              });
              this.updateList();
            }
          });
        } else {
          request.addMyCollect(para).then((response) => {
            if (response.code == 200) {
              this.$message({
                message: "添加收藏成功",
                type: "success",
              });
              this.updateList();
            }
          });
        }
      }
    },
    //获取My NFT 列表数据
    getMyNFT() {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.showLoading();
        var time = Date.parse(new Date()) / 1000; //获取当前时间
        var para = {
          key: this.address,
          page: 1,
          page_size: 10,
          typa: 4,
        };
        this.dataSource = [];
        request.searchnft(para).then(
          (response) => {
            if (response.code == "200") {
              this.dataSource = response.data;
              this.dataSource.forEach((item, index) => {
                let owner = this.dataSource[index].Owner;
                if (owner == this.address) {
                  this.dataSource[index].isOwner = true;
                }
                this.dataSource[index].isEnd = false;
                if (
                  this.dataSource[index].StartGame &&
                  this.dataSource[index].StartGame != "" &&
                  this.dataSource[index].StartGame.trim().length > 0
                ) {
                  var endTime =
                    parseInt(this.dataSource[index].StartGame) + 600; //游戏结束时间
                  if (time > endTime) {
                    this.dataSource[index].isEnd = true;
                  }
                }
                this.dataSource[index].Price = ad.fromWei(
                  this.dataSource[index].Price
                );
                this.dataSource[index].Amount = ad.fromWei(
                  this.dataSource[index].Amount
                );
                var ac = parseInt(item.ApproveCount);
                var dc = parseInt(item.DefuseCount);
                if (ac == 0 && dc == 0) {
                  this.dataSource[index].Rate = 0.5;
                } else {
                  this.dataSource[index].Rate = ac / (ac + dc);
                }
                this.dataSource[index].Owner = this.dataSource[index].Owner;
              });
            } else {
              this.$message.error(response.msg);
            }
            this.loading.close();
          },
          (err) => {
            console.log(err, "err");
            this.loading.close();
          }
        );
      }
    },
    changeTab(tab, event) {
      if (tab.name == "0") {
        //tab-My NFT
        this.getMyNFT();
      } else if (tab.name == "1") {
        //tab-history
        this.getMyHistory();
      } else if (tab.name == "2") {
        //Tab-Follow
        this.getMyCollected();
      }
    },
    getMyHistory() {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.showLoading();
        var para = {
          address: this.address,
          page: 1,
          page_size: 1000,
        };
        this.dataSource = [];
        var time = Date.parse(new Date()) / 1000; //获取当前时间
        request.historyOfParticipation(para).then(
          (response) => {
            if (response.code == 200) {
              this.dataSource = response.data;
              this.dataSource.forEach((item, index) => {
                this.dataSource[index].isEnd = false;
                var endTime = parseInt(this.dataSource[index].Start) + 600; //游戏结束时间
                if (time > endTime) {
                  this.dataSource[index].isEnd = true;
                }
                this.dataSource[index].Amount = ad.fromWei(
                  this.dataSource[index].Amount
                );
                var ac = parseInt(item.ApproveCount);
                var dc = parseInt(item.DefuseCount);
                if (ac == 0 && dc == 0) {
                  this.dataSource[index].Rate = 0.5;
                } else {
                  this.dataSource[index].Rate = ac / (ac + dc);
                }
                if (
                  this.dataSource[index].Result == 1 &&
                  this.dataSource[index].Choose == 1
                ) {
                  this.smile = false;
                  this.angry = true;
                } else if (
                  this.dataSource[index].Result == 2 &&
                  this.dataSource[index].Choose == 2
                ) {
                  this.smile = false;
                  this.angry = true;
                } else if (
                  this.dataSource[index].Result == 1 &&
                  this.dataSource[index].Choose == 2
                ) {
                  this.smile = false;
                  this.angry = true;
                } else if (
                  this.dataSource[index].Result == 2 &&
                  this.dataSource[index].Choose == 1
                ) {
                  this.smile = false;
                  this.angry = true;
                } else {
                  this.smile = false;
                  this.angry = false;
                }
              });
            } else {
              this.$message.error(response.msg);
            }
            this.loading.close();
          },
          (err) => {
            console.log(err, "err");
          }
        );
      }
    },
    getMyCollected() {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.showLoading();
        var para = {
          address: this.address,
          page: 1,
          page_size: 1000,
        };
        request.myCollect(para).then(
          (response) => {
            if (response.code == "200") {
              this.dataSource = response.data;
              this.dataSource.forEach((item, index) => {
                let owner = this.dataSource[index].Owner;
                if (owner == this.address) {
                  this.dataSource[index].isOwner = true;
                } else {
                  this.dataSource[index].isOwner = false;
                }
                this.dataSource[index].Price = ad.fromWei(
                  this.dataSource[index].Price
                );
                this.dataSource[index].Amount = ad.fromWei(
                  this.dataSource[index].Amount
                );
                var ac = parseInt(item.ApproveCount);
                var dc = parseInt(item.DefuseCount);
                if (ac == 0 && dc == 0) {
                  this.dataSource[index].Rate = 0.5;
                } else {
                  this.dataSource[index].Rate = ac / (ac + dc);
                }
              });
            } else {
              this.$message.error(response.msg);
            }
            this.loading.close();
          },
          (err) => {
            console.log(err, "err");
          }
        );
      }
    },
    OnStartGame(tid) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        ad.startGame(
          tid,
          (res) => {
            console.log(res);
            setTimeout(() => {
              location.reload();
            }, 1000);
          },
          (err) => {
            console.log(err);
            this.$refs.failed.openDialog();
          }
        );
      }
    },
    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: this.$t("lang.please"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.6)",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.mint-dialog {
  .left-img {
    text-align: center;
    img {
      max-height: 300px;
    }
  }
  ul {
    li {
      display: flex;
      align-items: center;
      line-height: 40px;
      & > span {
        color: #000;
        font-weight: 600;
        margin-right: 5px;
      }
      img {
        width: 22px;
      }
    }
  }
  .mint-Confirm {
    text-align: center;
    margin-top: 10px;
    .el-button {
      background: #ffdda9;
      border: none;
      &:hover {
        border: none;
        color: #333;
        background: #fad398;
      }
    }
  }
}
.custom-tabs {
  /deep/ .el-tabs__nav-wrap::after {
  }
  /deep/ .el-tabs__active-bar {
    background: #12022f;
  }
  /deep/ .el-tabs__item.is-active {
    color: #12022f;
  }
  /deep/ .el-tabs__item {
    color: #959595;
    font-weight: 400;
    padding-right: 10px;
    &:hover {
      color: #12022f;
      opacity: 0.6;
    }
  }
}
.tools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 5px;
  .custom-tabs {
    flex-grow: 1;
  }
  .more-dot {
    width: 50px;
    height: 50px;
    background: url("~@/assets/img/dots.svg") no-repeat center center/15px 3px;
    margin-left: 20px;
  }
}
// .empty-table {
//   line-height: 40px;
//   text-align: center;
//   color: #666;
//   font-size: 16px;
// }
.tabs-list {
  padding: 5px 5px 20px;
  & > li {
    .list {
      & > div {
        display: flex;
        flex-wrap: wrap;
      }
      li {
        width: 96%;
        margin: 0 auto 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        padding: 10px;
        border-radius: 15px;

        .btn-info {
          display: flex;
          justify-content: space-around;
          padding: 7px 5px;
          align-items: center;
          & > div {
            width: 45%;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 15px;
            line-height: 30px;
            font-size: 12px;
            margin-right: 8px;
          }
          .Sell {
            background: #ffdda9;
            border-color: #ffdda9;
            color: #000;
          }
          img {
            width: 30px;
          }
        }
        .mitn_btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          span {
            background: #ffdda9;
            display: inline-block;
            width: 100%;
            text-align: center;
            border-radius: 14px;
            border: 1px solid #ccc;
            line-height: 26px;
            font-size: 12px;
          }
        }
        .img-box {
          position: relative;
          overflow: hidden;
          height: 420px;
          .view {
            object-fit: cover;
            height: 100%;
            width: 99%;
            border-radius: 20px;
          }
          .bg-img {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: 100%;
            width: 100%;
            object-fit: fill;
          }
          .mark {
            position: absolute;
            font-size: 12px;
            right: 17px;
            bottom: 10px;
            color: #841ae9;
          }
          .collect {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10;
            padding: 6px;
            border-radius: 100%;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 22px;
            }
          }
          .card-info {
            position: absolute;
            width: 90%;
            border-radius: 6px;
            margin: 0 auto;
            background: #fff;
            right: 0;
            left: 0;
            bottom: 10%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 10px;
            box-shadow: 0px 0px 5px #ccc;
            p {
              display: flex;
              align-items: center;
              &:nth-child(1) {
                img {
                  width: 16px;
                }
                span {
                  color: #12022f;
                  font-size: 12px;
                  font-weight: 500;
                }
              }
              img {
                width: 22px;
                margin-right: 4px;
              }
              span {
                color: #841ae9;
                font-size: 16px;
                font-weight: 600;
              }
            }
          }
          .ja-btn-info {
            flex-wrap: wrap;
            padding: 12px 5px 7px;
            & > div {
              width: 100%;
              margin-bottom: 5px;
            }
          }
          .info-text,
          .info-examin {
            position: absolute;
            width: 85%;
            border-radius: 20px;
            margin: 0 auto;
            background: #caffe6;
            color: #000;
            right: 0;
            left: 0;
            bottom: 32%;
            text-align: center;
            line-height: 30px;
          }
          .info-examin {
            bottom: 10%;
            span {
              display: flex;
              width: 100%;
              height: 100%;
              justify-content: center;
              background: #caffe6;
              border-radius: 20px;
              &.Failed {
                background: #ff3916;
                color: #fff;
              }
            }
          }
          .foot {
            position: absolute;
            width: 90%;
            border-radius: 6px;
            margin: 0 auto;
            background: #fff;
            right: 0;
            left: 0;
            bottom: 12%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            // border: 1px solid #ededed;
            padding: 0 5px;
            .progress-n {
              width: 100%;
            }
            div {
              .progress-num {
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
                span {
                  font-size: 14px;
                  font-weight: bold;
                  color: #6a2ac8;
                }
                .cor {
                  color: #fbad34;
                }
                .win {
                  background: url("~@/assets/img/win.png") no-repeat center
                    center/contain;
                  width: 26px;
                }
                .lose {
                  background: url("~@/assets/img/lose.png") no-repeat center
                    center/contain;
                  width: 30px;
                }
                .draw {
                  background: url("~@/assets/img/draw.png") no-repeat center
                    center/contain;
                  width: 30px;
                }
              }

              .progress {
                width: 100%;
                height: 4px;
                background: rgba(251, 173, 52, 1);
                text-align: center;
                color: #fff;

                .progressing {
                  position: relative;
                  float: left;
                  margin: 0 auto;
                  height: 4px;
                  background: #6a2ac8;
                }
              }
            }
            img {
              width: 30px;
              height: 30px;
            }
          }
        }
        .info {
          .row {
            display: flex;
            justify-content: space-between;
          }
          h5 {
            color: #666;
            font-size: 13px;
            line-height: 25px;
            margin-top: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          h4 {
            font-size: 15px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 22px;
            margin-top: 5px;
            width: 100%;
            p {
              display: flex;
              align-items: center;
              padding-right: 5px;
              img {
                width: 25px;
              }
            }
            & > div {
              & > span {
                padding-left: 0px;
                font-size: 12px;
              }
            }
            .icon {
              width: 32px;
            }
          }
          .rowItem {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .rows {
            & > div {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
      }
      .nodata {
        width: 95%;
        height: calc(100vh - 350px);
        margin: 0 auto;
      }
    }
  }
}
/deep/.account-drawer {
  width: 70% !important;
  .account-mod {
    padding: 20px;
    .hd {
      font-size: 22px;
      padding: 10px 0;
    }
    .bd {
      .meta-item {
        padding: 10px 0 15px;
        position: relative;
        .item-title {
          color: #594d6d;
          font-size: 16px;
          padding: 10px 0 2px;
        }
        .item-value {
          .num {
            font-size: 28px;
          }
          .unit {
            font-size: 10px;
            margin-left: 4px;
          }
        }
        &:after {
          content: "";
          display: block;
          width: 16px;
          height: 2px;
          background: #d7d7d7;
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }
      .actions {
        padding: 40px 0 0;
      }
    }
  }
}
.btn {
  display: inline-block;
  border: #ccc 1px solid;
  font-size: 16px;
  line-height: 22px;
  padding: 8px 20px;
  border-radius: 4px;
  color: #000;
  text-align: center;
  min-width: 130px;
  &.btn-rounded {
    border-radius: 10em;
  }
  &.btn-nft {
    background: #ffdda9;
    border-color: #ffdda9;
    color: #000;
  }
  &.gay {
    background: #ccc;
    border-color: #ccc;
    color: #fff;
  }
  &.btn-sm {
    font-size: 10px;
    line-height: 14px;
    padding: 2px 4px;
    min-width: 50px;
  }
}
//弹窗样式
.tooltip {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 15;
  background: #33333388;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 75%;
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    h2 {
      display: flex;
      align-content: center;
      justify-content: center;
      line-height: 25px;
      font-size: 16px;
      margin-bottom: 5px;
      color: #666;
    }
    p {
      font-weight: 600;
      line-height: 25px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      border-bottom: #dcdcdc solid 1px;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 8px 0;
      div {
        width: 48%;
        line-height: 30px;
        font-size: 12px;
        border: 1px solid #dcdcdc;
        border-radius: 25px;
        text-align: center;
        color: #12022f;
        &:last-child {
          background: #ffdda9;
          border-color: #ffdda9;
        }
      }
    }
  }
}
</style>
<style>
.el-loading-spinner i {
  color: #dadce6;
  font-size: 30px;
}
.el-loading-spinner .el-loading-text {
  color: #dadce6;
  margin-top: 5px;
}
</style>