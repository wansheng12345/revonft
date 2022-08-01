<template>
  <div class="mobile-container">
    <Header></Header>
    <div class="detail-container">
      <!-- 公共图片 -->
      <div class="thumbnail" v-if="base">
        <img class="img" :src="base" />
        <div
          class="collect"
          @click="addCollect(item)"
          :class="{ collected: item.IsCollect }"
        ></div>
        <ul class="card">
          <li>
            <span class="owner">{{
              item.Owner.substr(0, 8) +
              "...." +
              item.Owner.substr(item.Owner.length - 8, 8)
            }}</span>
            <span>{{ $t("lang.value") }}</span>
          </li>
          <li>
            <span class="title">{{ item.Title }}</span>
            <div>
              <img src="./../../assets/img/icon.png" alt="" />
              <span>{{ item.Amount || 1 }}</span>
              <!-- <span v-else-if="item.Price != ''">{{ item.Price }}</span> -->
              <!-- <span v-else></span> -->
            </div>
          </li>
        </ul>
        <div class="num"># {{ item.TokenID }}</div>
      </div>
      <!-- 参与游戏 信息文字部分 -->
      <div class="info" v-if="item.IsRunning">
        <div class="time">
          <div
            class="endtime"
            v-if="item.IsRunning == true && item.IsOnSelling == false"
          >
            <div class="title">{{ $t("lang.endTime") }}:</div>
            <div class="value">{{ endTime }}</div>
          </div>
          <div class="Ticket">
            <span>{{ $t("lang.ticketPrice") }}:</span>
            <div>
              <img src="./../../assets/img/icon.png" alt="" />
              <span>0.1</span>
            </div>
          </div>
        </div>
        <div class="allocation">
          <div class="title">{{ $t("lang.Allocation") }}:</div>
          <div class="value">
            <div class="label label-red">To winners:{{ toWinners }}%</div>
            <div class="label label-green">
              To NFT Level-Up:{{ 100 - toWinners }}%
            </div>
            <div class="circle-help" @click="handleHelp($t('lang.info'))"></div>
          </div>
        </div>
        <!-- 点赞或者踩 -->
        <div
          class="progress-container"
          v-if="item.IsRunning == true && item.IsOnSelling == false"
        >
          <div class="progress-wrapper">
            <div
              class="progress-look look-smile"
              :class="{ gray: item.ApproveCount < item.DefuseCount }"
            ></div>
            <div class="progress-box">
              <div class="progress-text">
                <div class="text left">{{ item.ApproveCount }}</div>
                <!-- <img src="./../../assets/img/win.png" alt="" /> -->
                <div class="text right">{{ item.DefuseCount }}</div>
              </div>
              <div class="progress">
                <div
                  class="progress-bar"
                  v-bind:style="'width:' + item.Rate * 100 + '%'"
                ></div>
              </div>
            </div>
            <div
              class="progress-look look-angry"
              :class="{ gray: item.ApproveCount > item.DefuseCount }"
            ></div>
          </div>
        </div>
        <!-- Waiting for settlement -->
        <div
          class="waiting"
          v-if="(item.IsOnSelling == 0 && item.isEnd) || isVoted"
        >
          <p>
            <img :src="require('@/assets/img/clock.svg')" />
            <span>{{ $t("lang.waiting") }}</span>
          </p>
        </div>
        <!-- Settle -->
        <div
          class="Settle"
          @click="endRound"
          :class="{ disable: isSettled }"
          v-if="item.isSame"
        >
          {{ $t("lang.settle") }}
        </div>
        <!-- Your earnings: -->
        <!-- <div class="earnings">
          <p>
            <span>Your earnings：</span>
            <span class="value"
              >+ 1.31
              <sub>eth</sub>
            </span>
          </p>
        </div> -->
      </div>
      <!-- 买卖交易 信息文字部分-->
      <div class="info-market" v-if="!item.IsRunning || item.IsOnSelling == 1">
        <div class="title">
          <div class="code">{{ item.Title }}</div>
          <!-- <div class="price">
            <p>
              <img src="./../../assets/img/icon.png" alt="" />
            </p>
            <span>{{ item.Price || 1 }}</span>
          </div> -->
        </div>
        <!-- Recent -->
        <div class="Recent">
          <h2>{{ $t("lang.Recent") }}</h2>
          <el-tabs
            class="custom-tabs"
            v-model="activeName"
            :stretch="true"
            @tab-click="tabsChange"
          >
            <el-tab-pane :label="$t('lang.SalesHistory')" name="1">
              <line-chart height="200px" :data-option="option"></line-chart>
            </el-tab-pane>
            <el-tab-pane :label="$t('lang.HistoryOfParticipation')" name="2">
              <line-chart
                height="200px"
                :data-option="history"
                v-if="activeName == 2"
              ></line-chart>
            </el-tab-pane>
            <el-tab-pane :label="$t('lang.Description')" name="3">
              <p class="mark">
                {{ item.Description }}
              </p>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!-- 底部按钮 -->
    <div
      class="tabbar join"
      v-if="item.IsRunning && !item.isSame && !item.isEnd && !isVoted"
    >
      <ul>
        <li>
          <span>{{ $t("lang.ticketPrice") }}:</span>
          <div>
            <p><img src="./../../assets/img/icon.png" alt="" /></p>
            <span>0.1</span>
          </div>
        </li>
        <li>
          <div class="btns" @click="joinNow">{{ $t("lang.Join") }}</div>
        </li>
      </ul>
    </div>
    <!-- 交易的 tabbar -->
    <div
      class="tabbar btn"
      v-if="item.IsOnSelling == 0 && !noButton && !item.IsRunning"
    >
      <div @click="OnStartGame">{{ $t("lang.publish") }}</div>
      <div
        class="Sell"
        @click="handleSell"
        v-if="item.NextSaleTime * 1000 - new Date().getTime() < 0"
      >
        {{ $t("lang.sell") }}
      </div>
      <div v-else class="Sell">
        <countDate
          :remain-time="item.NextSaleTime * 1000 - new Date().getTime()"
          @sell="handleSell"
        />
      </div>
    </div>
    <div class="tabbar buy" v-if="item.IsOnSelling == 1 && !item.IsRunning">
      <ul>
        <li>
          <img :src="require('@/assets/img/shopcart_white.svg')" />
          <span>{{ $t("lang.sellPrice") }}</span>
        </li>
        <li>
          <p><img src="./../../assets/img/icon.png" alt="" /></p>
          <span>{{ item.Price }}</span>
        </li>
        <li :class="{ isSame: item.isSame }">
          <div v-if="item.isSame" @click="cancelSell(item.TradeId)">
            {{ $t("lang.cancel") }}
          </div>
          <div v-else @click="buyNFT">
            {{ $t("lang.buy") }} {{ item.Price }} ETH {{ $t("lang.buyInfo") }}
          </div>
        </li>
      </ul>
    </div>
    <!-- 取消销售 -->
    <Cancel
      :ShowTooltip="ShowCancel"
      :TradeId="TradeId"
      @closeTooltip="closeTooltip"
    ></Cancel>
    <Message ref="message"></Message>
    <!-- 失败弹窗 -->
    <Fail ref="failed"></Fail>
    <!-- 成功页面 跳转到以太坊浏览器 -->
    <Success ref="successed"></Success>
    <camp-drawer ref="campDrawer" @updata="handleUpdata"></camp-drawer>
    <sale-drawer ref="saleDrawer"></sale-drawer>
    <connectMetamask ref="showMetamask"></connectMetamask>
  </div>
</template>
<script>
import Header from "@/components/mobile/header";
import CampDrawer from "./modules/campDrawer.vue";
import SaleDrawer from "./modules/saleDrawer.vue";
import Fail from "./modules/Failed.vue";
import Success from "./modules/Success.vue";
import request from "../../services/request";
import Message from "@/components/mobile/Message.vue";
import ad from "../../utils/web3Helper";
import { BASE_V_API } from "@/config/env";
import LineChart from "@/views/modules/lineChart.vue";
import moment from "moment";
import market from "@/utils/market";
import CountDate from "@/components/CountDate.vue";
import Cancel from "@/components/mobile/cancel.vue";
import { mapState } from "vuex";
import { throttle } from "@/utils/common.js";
export default {
  name: "nftDetail-m",
  data() {
    return {
      status: 1,
      item: {
        Title: "",
        Price: "",
        ApproveCount: "",
        DefuseCount: "",
        Rate: "",
        TokenID: "",
        Path: "",
        StartGame: "",
        Owner: "",
        Amount: "",
        isEnd: false,
      },
      base: "",
      isOwner: false,
      isVoted: false,
      noButton: false,
      activeName: "1",
      endTime: "",
      toWinners: 70,
      TokenID: "",
      option: {
        title: {
          text: "Price",
          textStyle: {
            fontWeight: "normal",
            fontSize: 12,
            color: "#999",
          },
          top: "5px",
          left: "10px",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params, ticket, callback) {
            let res = "",
              date = "2021/" + params[0].axisValue;
            res =
              moment(date).format("MMMM DD, YYYY") +
              "<br />Price: " +
              params[0].value +
              " eth";
            setTimeout(function () {
              callback(ticket, res);
            }, 100);
            return "loading";
          },
        },
        grid: {
          top: "35px",
          bottom: "30px",
          right: "15px",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#aaa",
            },
          },
          data: ["7/24", "7/25", "7/26", "7/27", "7/28", "7/29", "7/30"],
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: "#aaa",
            },
          },
          type: "value",
        },
        series: [
          {
            data: [234, 435, 354, 532, 123, 34, 43],
            type: "line",
            itemStyle: {
              color: "rgb(165,0,254)",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(165,0,254,1)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(165,0,254,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      },
      history: {
        title: {
          text: "Price",
          textStyle: {
            fontWeight: "normal",
            fontSize: 12,
            color: "#999",
          },
          top: "5px",
          left: "10px",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params, ticket, callback) {
            let res = "",
              date = "2021/" + params[0].axisValue;
            res =
              moment(date).format("MMMM DD, YYYY") +
              "<br />Price: " +
              params[0].value +
              " eth";
            setTimeout(function () {
              callback(ticket, res);
            }, 100);
            return "loading";
          },
        },
        grid: {
          top: "35px",
          bottom: "30px",
          right: "15px",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "#aaa",
            },
          },
          data: ["7/24", "7/25", "7/26", "7/27", "7/28", "7/29", "7/30"],
        },
        yAxis: {
          axisLine: {
            show: true,
            lineStyle: {
              color: "#aaa",
            },
          },
          type: "value",
        },
        series: [
          {
            data: [135, 254, 98, 196, 154, 189, 231],
            type: "line",
            itemStyle: {
              color: "rgb(165,0,254)",
            },
            areaStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(165,0,254,1)", // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(165,0,254,0)", // 100% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      },
      loading: null,
      ShowCancel: false,
      timers: "",
      TradeId: "",
    };
  },
  components: {
    Header,
    SaleDrawer,
    CampDrawer,
    LineChart,
    Fail,
    Success,
    CountDate,
    Message,
    Cancel,
  },
  computed: {
    ...mapState(["address"]),
    // ????
    isSettled: function () {
      if (this.item.isEnd == true) {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    if (this.$route.query && this.$route.query.tokenID) {
      this.TokenID = this.$route.query.tokenID;
      this.loadData();
    }
  },
  methods: {
    closeTooltip() {
      this.$refs.failed.openDialog();
      this.ShowCancel = false;
    },
    handleHelp(info) {
      this.$refs.message.msg = info;
      this.$refs.message.show = true;
    },
    handleUpdata(data) {
      this.$refs.successed.open(
        this.$t("lang.votingSuccess"),
        data.hash,
        data.typa
      );
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
        this.ShowCancel = true;
      }
    },
    //关闭弹窗
    CloseTooltip() {
      this.ShowTooltip = false;
    },
    addCollect(item) {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.showLoading();
        var para = {
          address: this.address,
          token_id: this.item.TokenID,
        };
        if (item.IsCollect) {
          request.delMyCollect(para).then((response) => {
            if (response.code == 200) {
              item.IsCollect = !item.IsCollect;
              // this.loadData();
            }
          });
        } else {
          request.addMyCollect(para).then((response) => {
            if (response.code == 200) {
              item.IsCollect = !item.IsCollect;
              // this.loadData();
            }
          });
        }
        this.loading.close();
      }
    },
    tabsChange() {},
    joinNow() {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.campDrawer.openDialog(this.item.TokenID);
      }
    },
    handleSell() {
      if (this.address) {
        let token = sessionStorage.getItem("Token");
        if (!token) {
          sessionStorage.setItem("iSsignature", false);
          this.getSign();
        } else {
          this.$refs.saleDrawer.item = this.item;
          this.$refs.saleDrawer.openDialog();
        }
      }
    },
    loadData() {
      this.showLoading();
      var para = { key: this.address || "", token_id: this.TokenID };
      var that = this;
      var time = new Date().getTime(); //获取当前时间
      request.getNftInfo(para).then((response) => {
        that.item = response.data.res;
        this.base = BASE_V_API + response.data.res.Path;
        this.TokenID = response.data.res.TokenID;
        this.item.Owner = this.item.Owner.toLowerCase(); //转小写
        var endTime = moment(this.item.StartGame).valueOf() + 600 * 1000; //游戏结束时间
        if (time > endTime) {
          that.item.isEnd = true;
        }
        this.endTime = moment(endTime).format("yyyy-MM-DD HH:mm:ss"); //设置顶部结束时间
        if (that.item.TokenID && that.item.TokenID.trim().length > 6) {
          that.item.TokenID = that.item.TokenID.substr(0, 4);
        }
        var ac = parseInt(this.item.ApproveCount);
        var dc = parseInt(this.item.DefuseCount);
        if (ac == 0 && dc == 0) {
          this.item.Rate = 0.5;
        } else {
          this.item.Rate = ac / (ac + dc);
        }
        //转换钱
        this.item.Price = ad.fromWei(this.item.Price);
        this.item.Amount = ad.fromWei(this.item.Amount);
        //Allocation
        if (this.item.Amount < 1) {
          this.toWinners = 70;
        }
        if (this.item.Amount << 10) {
          this.toWinners = 50;
        }
        if (this.item.Amount > 1) {
          this.toWinners = 30;
        }
        //是否是自己的
        if (this.item.Owner.toLowerCase() == this.address.toLowerCase()) {
          this.item.isSame = true;
        } else if (this.item.IsRunning) {
          ad.checkIsVotedOneGame(this.address, this.TokenID, function (result) {
            that.isVoted = result;
          });
        }
        //自己的nft中切换账号，不显示按钮
        if (
          !this.item.IsRunning &&
          this.item.IsOnSelling == "0" &&
          !this.item.isSame
        ) {
          this.noButton = true;
        }
        console.log(this.noButton, this.item);
      });
      this.loading.close();
      // request.saleHistory(para).then((response) => {
      //   //交易历史
      //   if (response.code == 200 && response.data != null) {
      //     this.option.series.data = response.data[0];
      //   } else {
      //     this.option.series.data = [234, 435, 354, 532, 123, 34, 43];
      //   }
      // });
    },
    endRound() {
      if (!this.isSettled) {
        throttle(
          ad.endRound(
            this.item.TokenID,
            (result) => {
              setTimeout(() => {
                location.reload();
              }, 3000);
            },
            (err) => {
              this.$refs.failed.openDialog();
            }
          ),
          5000,true
        );
      }
    },
    buyNFT() {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.showLoading();
        market.buy(
          this.item.TradeId,
          this.item.Price,
          (result) => {
            setTimeout(() => {
              location.reload();
            }, 3000);
          },
          (err) => {
            this.$refs.failed.openDialog();
            this.loading.close();
            console.log(err);
          }
        );
      }
    },
    openDialog() {
      if (this.item.Owner === this.address) {
        this.isOwner = true;
      }
      if (this.isOwner == false) {
        this.$refs.CampDrawer.TokenID = this.item.TokenID;
        this.$refs.CampDrawer.openDialog();
      }
    },
    OnStartGame() {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.showLoading();
        ad.startGame(
          this.item.TokenID,
          (res) => {
            this.loading.close();
            setTimeout(() => {
              location.reload();
            }, 2000);
          },
          (err) => {
            this.$refs.failed.openDialog();
            this.loading.close();
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
.mobile-container {
  font-size: 14px;
  background: #fff;
}
.detail-container {
  padding-bottom: 50px;
  .thumbnail {
    position: relative;
    padding: 5px;
    margin: 10px 8px;
    border: 1px solid #ccc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.22);
    .img {
      object-fit: cover;
      border-radius: 10px;
      object-fit: cover;
      width: 100%;
    }
    .collect {
      position: absolute;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      background: #fff url("~@/assets/img/heart.svg") no-repeat center
        center/60% 60%;
      right: 12px;
      top: 12px;
      z-index: 2;
      &.collected {
        background-image: url("~@/assets/img/heart-fill.svg");
      }
    }
    .num {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 30%;
      line-height: 25px;
      text-align: right;
      background: #fff;
      border-radius: 5px 0 0 0;
      color: #841ae9;
      font-size: 13px;
      font-weight: 600;
      padding-right: 5px;
    }
    .card {
      position: absolute;
      bottom: 40px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
      background: #fff;
      padding: 5px 10px;
      border-radius: 8px;
      box-shadow: 0px 0px 10px #ccc;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #12022f;
        font-size: 13px;
        line-height: 22px;
        .owner {
          display: inline-block;
          width: 50%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .title {
          font-size: 16px;
          font-weight: 600;
        }
        &:first-child {
          color: #666;
          font-size: 12px;
        }
        img {
          width: 22px;
        }
        div {
          display: flex;
          align-items: center;
          span {
            font-weight: 600;
          }
        }
      }
    }
  }
  .info {
    padding: 10px 12px 15px;
    .time {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .Ticket {
        display: flex;
        align-items: center;
        & > span {
          color: #594d6d;
        }
        div {
          display: flex;
          align-items: center;
          img {
            width: 20px;
          }
          span {
            margin-left: 1px;
            font-weight: 600;
            font-size: 16px;
          }
        }
      }
    }
    .endtime {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 13px;
      .title {
        background: url("~@/assets/img/clock-blue.svg") no-repeat 0/12px 12px;
        padding-left: 18px;
        margin-right: 10px;
        color: #594d6d;
      }
    }
    .allocation {
      .title {
        padding: 10px 0;
      }
      .value {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .label {
          padding: 5px 0px;
          height: 28px;
          font-size: 12px;
          border-radius: 25px;
          color: #000;
          margin-right: 15px;
          text-align: center;
          width: 42%;
          &.label-red {
            background: #fdd;
          }
          &.label-green {
            background: #ddfff3;
          }
        }
        .circle-help {
          background: url("~@/assets/img/circle-info.svg") no-repeat 50% / cover;
          width: 28px;
          height: 28px;
        }
      }
    }
    .progress-container {
      padding: 20px 0;
      .progress-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .progress-look {
          width: 45px;
          height: 45px;
          background-repeat: no-repeat;
          background-position: 50%;
          background-size: contain;
          &.look-smile {
            background-image: url("~@/assets/img/icon-sm.svg");
            &.gray {
              background-image: url("~@/assets/img/icon-sm-gray.svg");
            }
          }
          &.look-angry {
            background-image: url("~@/assets/img/icon-k.svg");
            &.gray {
              background-image: url("~@/assets/img/icon-k-gray.svg");
            }
          }
        }
        .progress-box {
          flex-grow: 1;
          margin: 0 15px;
          .progress-text {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 4px;
            img {
              width: 28px;
            }
            .text {
              font-size: 14px;
              font-weight: 600;
              &.left {
                color: #841ae9;
              }
              &.right {
                color: #fbad34;
              }
            }
          }
          .progress {
            background: #fbad34;
            height: 10px;
            .progress-bar {
              background: #841ae9;
              height: 10px;
            }
          }
        }
      }
    }
    .waiting {
      padding: 25px 0;
      background: #fefcf4;
      border: 1px solid #ffc977;
      border-radius: 10px;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 20px;
          margin-right: 10px;
        }
        span {
          color: #ebbc00;
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
    .earnings {
      padding: 18px 0;
      background: #fefcf4;
      border: 1px solid #ffc977;
      border-radius: 10px;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        .value {
          font-size: 22px;
          color: #ff2929;
        }
      }
    }
    .Settle {
      margin-top: 20px;
      background: #ffdda9;
      padding: 15px;
      text-align: center;
      border-radius: 30px;
      font-weight: 600;
      font-size: 14px;
      &.disable {
        opacity: 0.6;
        background: #ffdda9;
        border-color: #ffdda9;
        color: #999;
      }
    }
  }
  //交易模块样式
  .info-market {
    padding: 10px 12px 15px;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      height: 30px;
      .code {
        color: #12022f;
        font-size: 20px;
        font-weight: 600;
      }
      .price {
        display: flex;
        align-items: center;
        span {
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
        }
        p {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px;
          background: #e6e6e6;
          border-radius: 100%;
          margin-right: 5px;
        }
        img {
          width: 22px;
        }
      }
    }
    .Recent {
      h2 {
        color: #594d6d;
        font-size: 16px;
        font-weight: 600;
        line-height: 32px;
      }
      .mark {
        line-height: 24px;
        font-size: 12px;
        text-indent: 2em;
        color: #594d6d;
      }
    }
  }
}
.custom-tabs {
  /deep/ .el-tabs__nav-wrap::after {
    background: transparent;
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
.custom-tabs {
  /deep/ .el-tabs__nav-wrap::after {
    background: transparent;
  }
  /deep/ .el-tabs__item {
    font-weight: 400;
    padding: 0;
    font-size: 12px;
    box-sizing: content-box;
    &:hover {
      color: #12022f;
      opacity: 1;
    }
  }
}
.tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  z-index: 10;
}
.join {
  background: #12022f;
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    li {
      display: flex;
      align-items: center;
      div {
        margin-left: 5px;
        display: flex;
        align-items: center;
        p {
          background: #e6e6e6;
          padding: 3px;
          border-radius: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 6px;
        }
        img {
          width: 20px;
        }
        span {
          font-size: 18px;
        }
      }
      &:last-child {
        background: #ffdda9;
        color: #12022f;
        padding: 8px 15px;
        border-radius: 20px;
      }
    }
  }
}
.btn {
  background: #12022f;
  display: flex;
  padding: 10px;
  justify-content: space-around;
  align-items: center;
  & > div {
    width: 35%;
    line-height: 30px;
    border: 1px solid #dcdcdc;
    text-align: center;
    border-radius: 20px;
    &.Sell {
      background: #ffdda9;
      color: #12022f;
    }
  }
}
.buy {
  background: #12022f;
  padding: 10px;
  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    li {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        margin-right: 5px;
      }
      span {
        font-weight: 500;
      }
      &:nth-child(2) {
        p {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          background: #e6e6e6;
          border-radius: 100%;
          margin-right: 6px;
          img {
            width: 20px;
            margin-right: 0;
          }
        }
        span {
          font-weight: 600;
          font-size: 18px;
        }
      }
      &:last-child {
        width: 45%;
        background: #ffdda9;
        line-height: 32px;
        color: #12022f;
        justify-content: center;
        border-radius: 20px;
      }
      &.isSame {
        background: transparent;
        border: 1px solid #ffffff;
        color: #ffffff;
      }
    }
  }
}
/deep/ .el-tooltip__popper {
  width: 300px;
  margin: 0 auto;
  left: 0;
  right: 0;
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