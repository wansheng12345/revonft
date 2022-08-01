<template>
  <div class="home-index">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="3"></Header>
    </div>
    <div class="common-container">
      <el-tabs class="custom-tabs" v-model="activeName" @tab-click="changeTab">
        <el-tab-pane :label="$t('lang.myNFT')" name="first"></el-tab-pane>
        <el-tab-pane
          :label="$t('lang.participation')"
          name="second"
        ></el-tab-pane>
        <el-tab-pane :label="$t('lang.follow')" name="third"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="filter-container" v-if="isHistory && dataSource.length > 0">
      <div class="title">Filter:</div>
      <el-select placeholder="All" v-model="sort" @change="selectChanged">
        <el-option :value="1" label="All"></el-option>
        <el-option :value="2" label="Waiting for settlement"></el-option>
        <el-option :value="3" label="Finished"></el-option>
      </el-select>
    </div>
    <div class="home-box-3">
      <div
        class="creating-n"
        v-for="(item, index) in dataSource"
        :key="'item_' + index"
      >
        <div class="back" @click="gotoDetail(item)">
          <img :src="base + item.Path" class="thumbnail" />
          <img src="../../assets/img/creat.png" class="back-top" />
          <span>#{{ item.TokenID.substr(0, 4) }}</span>
          <div
            class="waiting"
            v-if="item.IsRunning || (item.Status == 1 && item.isEnd)"
          >
            {{ $t("lang.waiting") }}
          </div>
          <ul class="status">
            <li class="Under" v-if="item.IsCheck == 1">Under Review</li>
            <li class="Failed" v-if="item.IsCheck == 3">Failed</li>
          </ul>
        </div>
        <div class="price">
          <span>{{
            item.Owner.substr(0, 8) +
            "...." +
            item.Owner.substr(item.Owner.length - 8, 8)
          }}</span>
          <span>{{ $t("lang.value") }}</span>
        </div>
        <div class="crypto">
          <span>{{ item.Title }}</span>
          <span class="con" 
            ><i></i>{{ item.Amount == "" ? "~" : item.Amount }}</span
          >
          <!-- <span class="con" v-else
            ><i></i>{{ item.Price == "" ? "~" : item.Price }}</span
          > -->
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
        <!--参与历史-->
        <div class="foot" v-if="item.Status == 1 || item.Status == 2">
          <img src="../../assets/img/icon.sm.png" :class="{ fail: smile }" />
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
          <img src="../../assets/img/icon-k.png" :class="{ fail: angry }" />
        </div>
        <div
          class="actions"
          v-if="
            (item.IsOnSelling == '0' || item.IsOnSelling == '') &&
            !item.IsRunning &&
            item.isOwner &&
            item.TokenID
          "
        >
          <a class="btn nft-btn-default" @click="OnStartGame(item.TokenID)">{{
            $t("lang.publish")
          }}</a>
          <a
            class="btn nft-btn"
            v-if="item.NextSaleTime * 1000 - new Date().getTime() < 0"
            @click="OnSell(item)"
            >{{ $t("lang.sell") }}</a
          >
          <a class="btn nft-btn down" v-else>
            <countDate
              :remain-time="item.NextSaleTime * 1000 - new Date().getTime()"
              @sell="OnSell(item)"
            />
          </a>
          <div class="bind-container">
            <img src="../../assets/img/ellipsis.png" class="ellipsis" alt="" />
            <div>
              <div class="bind-box">
                <img src="../../assets/img/bind.png" alt="" />
                <span @click="handlleUnbind(item)">unbind</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            item.IsOnSelling == 0 &&
            !item.IsRunning &&
            item.isOwner &&
            !item.TokenID
          "
          class="mitn_btn"
          :class="{ mitn: item.IsCheck == 2 }"
        >
          <span @click="shouMintDialog(item)">Mint</span>
          <div class="img-box" :class="{ Failed: item.IsCheck == 3 }">
            <img
              src="../../assets/img/ellipsis.png"
              class="ellipsis"
              v-if="item.IsCheck == 2"
              alt=""
            />
            <img
              src="../../assets/img/ellipsied.png"
              class="ellipsis"
              v-else
              alt=""
            />
            <div>
              <div class="bind-box" @click="remove(item)">
                <img src="../../assets/img/reduce.png" alt="" />
                <span>Remove from “MY NFT”</span>
              </div>
            </div>
          </div>
        </div>
        <div class="sell-action" v-if="item.IsOnSelling == 1">
          <div v-if="item.Owner.toLowerCase() === address.toLowerCase()">
            <img
              :src="require('@/assets/img/circle-arrow.svg')"
              class="icon"
              @click="cancelSell(item.TradeId)"
            />
          </div>
          <div class="sellprice">{{ $t("lang.sellPrice") }}</div>
          <div class="nft-price">
            <div class="circle-nft"></div>
            <div class="num">{{ item.Price }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="nodata" v-if="dataSource == null || dataSource.length == 0">
      <img
        :src="require('@/assets/img/nodata_items.png')"
        v-if="activeName == 'first'"
        class="img"
      />
      <img
        :src="require('@/assets/img/nodata_participated.png')"
        v-if="activeName == 'second'"
        class="img"
      />
      <img
        :src="require('@/assets/img/nodata_follow.png')"
        v-if="activeName == 'third'"
        class="img"
      />
    </div>
    <el-dialog :visible="visible" width="30%" :title="null" :center="true">
      <div class="confirm">
        <h2>
          ARE YOU SURE <br />
          TO REMOVE?
        </h2>
        <div class="button">
          <span @click="handleRemove(true)">YES, I AM SURE</span>
          <span @click="handleRemove(false)">NO</span>
        </div>
      </div>
    </el-dialog>
    <Bind ref="bind"></Bind>
    <Footer></Footer>
    <cancel-dialog
      ref="cancelDialog"
      @fail="openFail"
      @openWeberr="openWeberr"
      @offWeberr="offWeberr"
    ></cancel-dialog>
    <saledetail-dialog
      ref="saledetailDialog"
      @fail="openFail"
      @openWeberr="openWeberr"
      @offWeberr="offWeberr"
    ></saledetail-dialog>
    <fail-dialog ref="failDialog"></fail-dialog>
    <weberr :show="weberr"></weberr>
    <minting-dialog ref="MintingDialog"></minting-dialog>
    <el-dialog
      :visible="showMint"
      title="COMPLETE CHECKOUT"
      :close-on-click-modal="false"
      width="650px"
      custom-class="nft-dialog"
      @close="closeDialog"
    >
      <div class="nft-dialog-body">
        <div class="top-detail">
          <div class="left-img" v-if="item.Path">
            <img :src="base + item.Path" />
          </div>
          <div class="right-info">
            <div class="row">
              <h4>{{ item.Title }}</h4>
              <div>
                <span class="value">Value </span>
                <img src="./../../assets/img/icon.png" alt="" />
                <span>{{ price }}</span>
              </div>
            </div>
            <div>
              {{ item.Description }}
            </div>
          </div>
        </div>
        <div class="Confirm">
          <el-button @click="handleMint()" :loading="showButtonLoading" round
            >Confirm check out</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "../../components/footer.vue";
import request from "@/services/request";
import cancelDialog from "@/views/modules/cancelDialog";
import MintingDialog from "@/views/modules/mintingDialog.vue";
import saledetailDialog from "../pickMarket/modules/saledetailDialog";
import failDialog from "../modules/failDialog";
import ad from "../../utils/web3Helper.js";
import { BASE_V_API } from "@/config/env";
import Weberr from "../modules/weberr.vue";
import Bind from "../modules/bind/index";
import CountDate from "./../../components/CountDate.vue";
import moment from "moment";
export default {
  name: "home",
  data() {
    return {
      remainTime: 1563547,
      loading: false,
      isLoading: false,
      activeName: "first",
      dataSource: [],
      base: "",
      sort: 1,
      isHistory: false,
      weberr: false,
      timer: null,
      smile: false,
      isOwner: false,
      angry: false,
      showBind: false,
      visible: false,
      removeId: null, //删除审核失败的 ID
      item: "",
      showMint: false,
      price: "1",
      showButtonLoading: false,
      timeId: "",
    };
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
  },
  mounted() {
    this.loadData();
    this.base = BASE_V_API;
  },
  methods: {
    moment,
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
        this.price = "0.01";
        this.item = item;
        this.showMint = true;
      }
      // ad.getPrice((res) => {
      //   this.price = ad.fromWei(res);
      //   this.item = item;
      //   this.showMint = true;
      // });
    },
    handleMint() {
      var para = {
        cid: this.item.Cid,
        description: this.item.Description,
        owner: this.address,
        title: this.item.Title,
      };
      let that = this;
      this.showButtonLoading = true;
      request.getUrl(para).then((res) => {
        ad.mintToSelf(
          res.data.url,
          res.data.id,
          (hash) => {
            this.showButtonLoading = false;
          },
          (err) => {
            this.showButtonLoading = false;
            var data = {
              title: that.$t("lang.transactionFailed"),
              desc: that.$t("lang.failedDesc"),
            };
            that.$emit("fail", data);
          }
        );
      });
    },
    handleRemove(flag) {
      if (flag) {
        request
          .remove({
            id: this.removeId + "",
            operator: this.address,
          })
          .then((res) => {
            if (res.code == 200) {
              this.loadData();
              this.visible = false;
            }
          });
      } else {
        this.visible = false;
      }
    },
    remove(item) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.removeId = item.ID;
        this.visible = true;
      }
    },
    handlleUnbind(item) {
      this.$refs.bind.showBind(item);
    },
    handleBind() {
      this.showBind = !this.showBind;
    },
    openWeberr() {
      this.weberr = true;
    },
    offWeberr() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      location.reload();
    },
    selectChanged(value) {
      if (value == 1) {
        this.sort = 1;
        this.getMyHistory();
      } else if (value == 2) {
        this.sort = 2;
        this.getMyHistory();
      } else if (value == 3) {
        this.sort = 3;
        this.getMyHistory();
      }
    },
    openFail(data) {
      this.weberr = false;
      this.$refs.failDialog.title = data.title;
      this.$refs.failDialog.descriptionText = data.desc;
      this.$refs.failDialog.openDialog();
    },
    cancelSell(TradeId) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.cancelDialog.TradeId = TradeId;
        this.$refs.cancelDialog.openDialog();
      }
    },
    changeTab(tab, event) {
      this.isLoading = true;
      this.showLoading();
      if (tab.name == "first") {
        //tab-My NFT
        this.activeName = "first";
        this.isHistory = false;
        this.loadData();
      } else if (tab.name == "second") {
        //tab-history
        this.activeName = "second";
        this.isHistory = true;
        this.getMyHistory();
      } else if (tab.name == "third") {
        //Tab-Follow
        this.activeName = "third";
        this.isHistory = false;
        this.getMyCollected();
      }
    },
    getMyHistory() {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
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
            console.log( this.dataSource)
          } else {
            this.$message.error(response.msg);
          }
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
                if (owner.toLowerCase() == this.address.toLowerCase()) {
                  this.dataSource[index].isOwner = true;
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
              console.log(this.dataSource)
            } else {
              this.$message.error(response.msg);
            }
          },
          (err) => {
            console.log(err, "err");
          }
        );
      }
    },
    OnSell(item) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.saledetailDialog.item = item;
        this.$refs.saledetailDialog.openDialog();
      }
    },
    OnStartGame(tid) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        var that = this;
        this.dataSource.forEach((item) => {
          if (item.TokenID == tid) {
            console.log("OnStartGame", item);
            ad.startGame(
              tid,
              function (res) {
                console.log(res);
                that.timer = setTimeout(that.offWeberr, 3 * 1000);
              },
              function (err) {
                console.log(err, "startGame error");
                var data = {
                  title: that.$t("lang.failed"),
                  desc: that.$t("lang.failedDesc"),
                };
                that.openFail(data);
              }
            );
          }
        });
      }
    },
    loadData() {
      // this.address =
      //   this.getAccountToken().toLowerCase() ||
      //   this.$store.getters.address.toLowerCase();
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.isLoading = true;
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
                let owner;
                if (this.dataSource[index]) {
                  owner = this.dataSource[index].Owner;
                }
                if (owner.toLowerCase() == this.address.toLowerCase()) {
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
              console.log("this.dataSource", this.dataSource);
            } else {
              this.$message.error(response.msg);
            }
          },
          (err) => {
            console.log(err, "err");
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
      setTimeout(() => {
        this.loading.close();
      }, 200);
    },
    gotoDetail(item) {
      if (!item.TokenID) return;
      if (item.Status == 2) {
        this.$router.push({
          name: "nftHistory",
          query: {
            tokenID: item.TokenID,
            Reward: item.Reward,
            Scale: item.Scale,
            round: item.Round,
          },
        });
      } else {
        this.$router.push({
          name: "nftDetail",
          query: { tokenID: item.TokenID },
        });
      }
    },
  },
  components: {
    Header,
    Footer,
    cancelDialog,
    saledetailDialog,
    MintingDialog,
    failDialog,
    Weberr,
    Bind,
    CountDate,
  },
};
</script>

<style lang="less" scoped>
/deep/.nft-dialog {
  border-radius: 10px;
  .el-dialog__header {
    padding: 30px 30px 15px;
    .el-dialog__title {
      font-size: 28px;
      font-weight: 800;
      line-height: 50px;
    }
    .el-dialog__headerbtn {
      width: 48px;
      height: 48px;
      .el-dialog__close {
        background: url("~@/assets/img/close.svg") no-repeat center center/cover;
        width: 48px;
        height: 48px;
        transition: all 0.5s;
        cursor: pointer;
        &:before {
          content: "";
        }
        &:hover {
          transform: rotate(180deg);
        }
      }
    }
  }
  .el-dialog__body {
    padding: 10px 40px 40px;
    .top-detail {
      display: flex;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
      .left-img {
        width: 53%;
        margin-right: 4%;
        text-align: center;
        img {
          width: 90%;
          border-radius: 10px;
        }
      }
      .right-info {
        width: 46%;
        .row {
          display: flex;
          justify-content: space-between;
          font-size: 16px;
          font-weight: 600;
          & > div {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            .value {
              font-weight: 400;
              margin-right: 10px;
            }
            img {
              width: 24px;
              margin: 0 2px;
            }
          }
        }
      }
    }
    .Confirm {
      text-align: center;
      margin-top: 40px;
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
}

.home-index {
  min-height: 100%;
  position: relative;
  .home-tit {
    width: 1190px;
    height: 116px;
    background: #f4f4f4;
    border-radius: 3px;
    border: 1px solid #c9c9c9;
    padding: 20px 29px;
    margin: auto;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    h1 {
      font-size: 28px;
      font-weight: 400;
      color: #12022f;
      line-height: 76px;
    }
    div {
      span {
        display: block;
        font-size: 14px;
        font-weight: 400;
        color: #594d6d;
      }
      .pric {
        margin-top: 14px;
        font-size: 36px;
        font-weight: 400;
        color: #12022f;
        i {
          font-size: 14px;
          font-weight: 400;
          color: #12022f;
        }
      }
    }
    .butt-on {
      width: 128px;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background: #ffdda9;
      border-radius: 28px;
      font-size: 16px;
      font-weight: 400;
      color: #12022f;
      margin-top: 16px;
    }
    .disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
  .home-t {
    display: flex;
    justify-content: flex-end;
    width: 1200px;
    margin: auto;
    margin-top: 28px;
    span {
      font-size: 14px;
      font-weight: 400;
      color: #12022f;
      padding: 9px 22px;
    }
    div {
      padding: 9px 22px;
      margin-right: 16px;
      border-radius: 6px;
      border: 1px solid #c4c0cb;
      font-size: 16px;
      text-align: center;
      font-weight: 400;
      color: rgba(196, 192, 203, 1);
      i {
        margin-left: 10px;
      }
    }
    .active {
      color: rgba(115, 36, 254, 1);
      border: 1px solid rgba(115, 36, 254, 1);
    }
  }
  .home-box-3 {
    display: flex;
    //justify-content: space-between;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 1200px;
    margin: auto;
    margin-bottom: 20px;
    .creating-n {
      width: 280px;
      //margin-top: 36px;
      margin: 36px 10px 0;
      position: relative;
      .back {
        width: 280px;
        height: 384px;
        box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.22);
        border-radius: 20px;
        // border: 1px solid;
        //background-color: red;
        position: relative;
        padding: 2px;
        box-sizing: border-box;

        img {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          &.thumbnail {
            object-fit: cover;
          }
          &.back-top {
            object-fit: contain;
            position: absolute;
          }
        }
        span {
          position: absolute;
          bottom: 8px;
          right: 10px;
          font-size: 12px;
          font-weight: 400;
          color: #841ae9;
          z-index: 99;
        }
        .waiting {
          background: #caffe6;
          color: #000;
          padding: 10px 16px;
          text-align: center;
          border-radius: 10em;
          position: absolute;
          bottom: 60px;
          left: 62px;
          right: 62px;
          font-size:12px;
        }
      }
      .status {
        width: 60%;
        margin: 0 auto;
        text-align: center;
        position: absolute;
        bottom: 10%;
        right: 0;
        left: 0;
        line-height: 28px;
        border-radius: 14px;
        overflow: hidden;
        font-size: 13px;
        color: #841ae9;
        z-index: 99;
        .Under {
          background: #caffe6;
        }
        .Failed {
          background: #ff3916;
          color: #fff;
        }
      }
      .price {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        font-weight: 400;
        color: rgba(89, 77, 109, 10.5);
        padding: 9px 6px;
        span {
          max-width: 50%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          display: block;
        }
      }

      .crypto {
        display: flex;
        justify-content: space-between;
        padding: 0 6px;

        span {
          font-size: 14px;
          font-weight: 400;
          color: #12022f;
        }

        .con {
          font-size: 16px;
          font-weight: bold;
          color: #12022f;
          display: block;
          display: flex;
          align-items: center;

          i {
            display: block;
            width: 24px;
            height: 24px;
            background: url(../../assets/img/icon.png) no-repeat;
            background-size: 100% 100%;
            margin-right: 10px;
          }
        }
      }
      .foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 280px;
        height: 64px;
        border-radius: 8px;
        border: 1px solid #ededed;
        padding: 12px;
        margin-top: 12px;

        div {
          .progress-num {
            width: 150px;
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
              width: 62px;
              height: 26px;
              transform: scale(0.8);
            }
            .lose {
              background: url("~@/assets/img/lose.png") no-repeat center
                center/contain;
              width: 79px;
              height: 28px;
              transform: scale(0.8);
            }
            .draw {
              background: url("~@/assets/img/draw.png") no-repeat center
                center/contain;
              width: 92px;
              height: 27px;
              transform: scale(0.8);
            }
          }

          .progress {
            width: 150px;
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
          width: 42px;
          height: 42px;
        }
      }
      .back-zan {
        width: 32px;
        height: 32px;
        display: block;
        position: absolute;
        top: 18px;
        right: 18px;
        z-index: 99;
      }
      .back-time {
        width: 80px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        background: #000000;
        border-radius: 12px;
        opacity: 0.57;
        position: absolute;
        bottom: 10px;
        left: 18px;
        z-index: 99;
        font-size: 14px;
        font-weight: 400;
        color: #ffffff;
      }

      .back-top {
        width: 100%;
        height: 384px;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
      }
    }
  }
}
.confirm {
  h2 {
    font-size: 28px;
    color: #12022f;
    text-align: center;
  }
  .button {
    display: flex;
    justify-content: space-around;
    margin-top: 25px;
    span {
      display: inline-block;
      width: 35%;
      text-align: center;
      background: #ffdda9;
      color: #000;
      line-height: 40px;
      border-radius: 20px;
      cursor: pointer;
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
    padding: 10px 10px 10px 20px;
    box-sizing: content-box;
    &:hover {
      color: #12022f;
      opacity: 0.6;
    }
  }
}
.common-container {
  width: 1200px;
  margin: 0 auto;
  padding: 20px 0;
}
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  .btn {
    border-radius: 10em;
    height: 44px;
    line-height: 24px;
    padding: 10px 20px;
    border: transparent 1px solid;
    text-align: center;
    min-width: 120px;
    font-size: 15px;
    cursor: pointer;
    &.nft-btn {
      background: #ffdda9;
      color: #000;
      border-color: #ffdda9;
      &.is-disabled,
      &.is-disabled:hover {
        opacity: 0.6 !important;
        background: #ffdda9;
        color: #999;
        border-color: #ffdda9;
      }
    }
    &.btn-block {
      display: block;
      width: 100%;
      box-sizing: border-box;
    }
    &.nft-btn-default {
      border-color: #dcdcdc;
    }
    &:hover {
      opacity: 0.6;
    }
    &.down:hover {
      opacity: 1;
    }
  }
  .bind-container {
    position: relative;
    cursor: pointer;
    height: 40px;
    display: flex;
    align-items: center;
    & > div {
      display: none;
    }
    &:hover {
      & > div {
        display: block;
      }
    }
    .bind-box {
      position: absolute;
      display: flex;
      align-items: center;
      top: -30px;
      right: -10px;
      z-index: 2;
      background: #12022f;
      padding: 8px 10px;
      color: #fff;
      border-radius: 4px;
      width: 80px;
      justify-content: space-between;
      font-size:13px;
      &:hover {
        background: #841ae9;
      }
      &::after {
        content: "";
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 8px solid #12022f;
        position: absolute;
        top: 32px;
        right: 10px;
      }
      &:hover::after {
        border-top: 8px solid #841ae9;
      }
    }
  }
}
.mitn_btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  position: relative;
  & > span {
    height: 40px;
    padding: 10px 20px;
    border-radius: 20px;
    border: transparent 1px solid;
    text-align: center;
    flex: 1;
    font-size: 15px;
    cursor: not-allowed;
    background: #f2f2f2;
  }
  .img-box {
    height: 40px;
    line-height: 40px;
    margin-left: 10px;
    img {
      width: 18px;
      cursor: not-allowed;
    }
    & > div {
      display: none;
    }
  }
  .Failed {
    &:hover > div {
      display: flex;
    }
  }
  .bind-box {
    position: absolute;
    display: flex;
    align-items: center;
    line-height: 18px;
    top: -10px;
    right: -10px;
    z-index: 2;
    background: #12022f;
    padding: 8px 5px;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    img {
      margin-right: 5px;
      height: 80%;
    }
    &:hover {
      background: #841ae9;
    }
    &::after {
      content: "";
      width: 0;
      height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 8px solid #12022f;
      position: absolute;
      top: 32px;
      right: 10px;
    }
    &:hover::after {
      border-top: 8px solid #841ae9;
    }
  }
}
.mitn {
  & > span {
    cursor: pointer;
    background: #ffdda9;
  }
  img {
    cursor: pointer;
  }
}
.sell-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  .icon {
    width:40px;
    height:40px;
    margin-right: 20px;
    cursor: pointer;
  }
  .sellprice {
    background: url("~@/assets/img/shopcart.svg") no-repeat left center/15px
      14px;
    padding-left: 25px;
    font-size: 14px;
  }
  .nft-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .circle-nft {
      background: #f1f1f1 url("~@/assets/img/nft.svg") no-repeat center
        center/60% 60%;
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
    .num {
      font-size: 28px;
      color: #841ae9;
      margin-left: 10px;
    }
  }
}
.filter-container {
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .title {
    font-weight: 600;
    margin-right: 15px;
    font-size: 14px;
  }
}
.nodata {
  min-height: calc(100vh - 390px);
  .img {
    width: 358px;
    height: 307px;
    display: block;
    margin: 50px auto 0;
  }
}
</style>
