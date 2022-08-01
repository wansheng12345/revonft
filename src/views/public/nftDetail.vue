<template>
  <div class="home-detail">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="-1"></Header>
    </div>
    <div class="title-d">
      <span v-if="item.IsRunning">{{ $t("lang.opting") }} - </span>
      <span v-else>{{ $t("lang.market") }} - </span>
      <span style="color: #12022f">{{ item.Title }}</span>
    </div>
    <div class="box-d">
      <div class="creating-n">
        <div class="back">
          <img class="product-img" :src="base" v-if="!item.isVideo" />
          <video v-else :src="base" class="videoThumb" autoplay></video>
          <img src="../../assets/img/detail-wrap.svg" class="back-top" />
          <!-- <div class="back-zan">
            <img src="../../assets/img/dianzan.png" />
          </div> -->
          <el-tooltip
            :content="$t('lang.CancelCollect')"
            v-if="item.IsCollect"
            placement="top"
          >
            <div
              class="collect"
              @click="collectThis(item)"
              :class="{ collected: item.IsCollect }"
            ></div
          ></el-tooltip>
          <el-tooltip :content="$t('lang.AddCollect')" v-else placement="top">
            <div
              class="collect"
              @click="collectThis(item)"
              :class="{ collected: item.IsCollect }"
            ></div
          ></el-tooltip>
          <span>#{{ item.TokenID }}</span>
        </div>
      </div>
      <div class="creating-detail">
        <div class="endtime" v-if="item.IsRunning && item.IsOnSelling == 0">
          <div class="title">{{ $t("lang.endTime") }}:</div>
          <div class="value">{{ endTime }}</div>
        </div>
        <div class="detail-metas">
          <div class="labels">
            <div class="label">{{ item.Owner }}</div>
            <div class="label">{{ $t("lang.value") }}</div>
          </div>
          <div class="values">
            <div class="value">{{ item.Title }}</div>
            <div class="value">
              <img :src="require('@/assets/img/nft.svg')" class="icon" />
              <div class="price">{{ item.Amount }}</div>
              <!-- <div class="price" v-else-if="item.Price != ''">
                {{ item.Price }}
              </div>
              <div class="price" v-else></div> -->
            </div>
          </div>
        </div>
        <div class="item" v-if="item.IsRunning && item.IsOnSelling == 0">
          <div class="hd">{{ $t("lang.gameState") }}:</div>
          <div class="bd">
            <div class="state">
              <div class="item-smile" :class="{ fail: smile }"></div>
              <div class="item-progress">
                <div class="progress-text">
                  <div class="text-left">{{ item.ApproveCount }}</div>
                  <div class="win" v-if="current == 'win'"></div>
                  <div class="lose" v-if="current == 'lose'"></div>
                  <div class="draw" v-if="current == 'draw'"></div>
                  <div class="text-right">{{ item.DefuseCount }}</div>
                </div>
                <div class="progress">
                  <div
                    class="bar"
                    v-bind:style="'width:' + item.Rate * 100 + '%'"
                  ></div>
                </div>
              </div>
              <div class="item-angry" :class="{ fail: angry }"></div>
            </div>
          </div>
        </div>

        <div class="creat-p" v-if="item.IsRunning">
          <span>{{ $t("lang.ticketPrice") }}:</span>
          <div class="con-i"><i></i>0.1</div>
        </div>
        <div class="creat-p" v-if="item.IsRunning && item.IsOnSelling == 0">
          <span>{{ $t("lang.Allocation") }} :</span>
          <span class="icon">To winnners : {{ toWinners }}%</span>
          <span class="icon" style="background: #ddfff3"
            >To NFT Level-Up : {{ 100 - toWinners }}%</span
          >
          <!-- 提示 -->
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              {{ $t("lang.allocationInfoLine1") }}<br />{{
                $t("lang.allocationInfoLine2")
              }}
            </div>
            <span class="circle-help"></span>
          </el-tooltip>
        </div>
        <div v-if="item.IsRunning">
          <div
            class="actions"
            v-if="!item.isSame && !item.isEnd && !isVoted && !userVoted"
          >
            <el-button class="nft-btn" @click="openDialog">{{
              $t("lang.Join")
            }}</el-button>
          </div>
          <div class="actions" v-if="item.isSame">
            <el-button
              class="nft-btn"
              @click="endRound"
              :disabled="isSettled"
              >{{ $t("lang.settle") }}</el-button
            >
          </div>
          <div
            class="nei"
            v-if="(item.IsOnSelling == 0 && item.isEnd) || isVoted || userVoted"
          >
            <img :src="require('@/assets/img/clock.svg')" />
            <span>{{ $t("lang.waiting") }}</span>
          </div>
        </div>
        <div
          class="recent-container"
          v-if="!item.IsRunning || item.IsOnSelling == 1"
        >
          <div class="hd">{{ $t("lang.Recent") }}</div>
          <div class="bd">
            <el-tabs
              class="custom-tabs"
              :stretch="true"
              @tab-click="tabsChange"
            >
              <el-tab-pane :label="$t('lang.SalesHistory')">
                <line-chart height="260px" :data-option="option"></line-chart>
              </el-tab-pane>
              <el-tab-pane :label="$t('lang.HistoryOfParticipation')">
                <line-chart
                  height="260px"
                  :data-option="history"
                  v-if="isShowLine"
                ></line-chart>
              </el-tab-pane>
              <el-tab-pane :label="$t('lang.Description')">{{
                item.Description
              }}</el-tab-pane>
            </el-tabs>
          </div>
          <div class="mynft" v-if="item.IsOnSelling == 1 && !item.IsRunning">
            <div class="title">
              <div class="sellprice">{{ $t("lang.sellPrice") }}</div>
              <div class="eth">
                <div class="icon"></div>
                <div class="num">{{ item.Price }}</div>
              </div>
            </div>
            <div class="act" v-if="item.isSame">
              <div class="nft-btn" @click="cancelSell">
                {{ $t("lang.cancel") }}
              </div>
            </div>
            <div class="act" v-else>
              <el-button class="nft-btn btn-block" @click="buyNFT"
                >{{ $t("lang.buy") }} {{ item.Price }} ETH
                {{ $t("lang.buyInfo") }}</el-button
              >
            </div>
          </div>
        </div>
        <div
          class="actions right"
          v-if="!item.IsRunning && item.IsOnSelling == 0 && noButton == false"
        >
          <div class="nft-btn-default mr" @click="OnStartGame">
            <i class="el-icon-loading" v-show="publishLoading"></i>
            {{ $t("lang.publish") }}
          </div>
          <div
            class="nft-btn"
            @click="OnSell"
            v-if="item.NextSaleTime * 1000 - new Date().getTime() < 0"
          >
            {{ $t("lang.sell") }}
          </div>
          <div v-else class="nft-btn down">
            <countDate
              :remain-time="item.NextSaleTime * 1000 - new Date().getTime()"
              @sell="OnSell"
            />
          </div>
        </div>
      </div>
    </div>
    <connectMetamask ref="showMetamask"></connectMetamask>
    <Footer></Footer>
    <cancel-dialog
      ref="cancelDialog"
      @fail="openFail"
      @offWeberr="offWeberr"
    ></cancel-dialog>
    <camp-dialog
      ref="campDialog"
      @fail="openFail"
      @offWeberr="offWeberr"
      @reload="reload"
    ></camp-dialog>
    <saledetail-dialog
      ref="saledetailDialog"
      @fail="openFail"
      @offWeberr="offWeberr"
    ></saledetail-dialog>
    <fail-dialog ref="failDialog"></fail-dialog>
    <purchaseDialog
      ref="purchaseDialog"
      @fail="openFail"
      @offWeberr="offWeberr"
      @reload="reload"
    ></purchaseDialog>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "../../components/footer.vue";
import cancelDialog from "@/views/modules/cancelDialog";
import campDialog from "../pickMarket/modules/campDialog";
import LineChart from "@/views/modules/lineChart.vue";
import request from "../../services/request";
import ad from "../../utils/web3Helper";
import { BASE_V_API } from "@/config/env";
import saledetailDialog from "../pickMarket/modules/saledetailDialog";
import moment from "moment";
import failDialog from "../modules/failDialog.vue";
import purchaseDialog from "../modules/purchaseDialog.vue";
import CountDate from "./../../components/CountDate.vue";
import { mapState } from "vuex";
export default {
  name: "nftDetail",
  data() {
    return {
      loading: false,
      publishLoading: false,
      isShowLine: false,
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
        isSame: false,
        isEnd: false,
      },
      base: "",
      activeName: "1",
      endTime: "",
      choose: 0,
      toWinners: 70,
      isVoted: false,
      userVoted: false,
      noButton: false,
      smile: false,
      angry: false,
      current: "",
      option: {
        title: {
          text: this.$t("lang.prices"),
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
          text: this.$t("lang.People"),
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
              "<br />People: " +
              params[0].value;
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
    };
  },
  computed: {
    ...mapState(["address"]),
    isSettled: function () {
      if (this.item.isEnd == true) {
        return false;
      } else {
        return true;
      }
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    checkJoin() {
      var params = {
        player: this.address,
        token_id: this.$route.query.tokenID,
      };
      var that = this;
      request.checkJoin(params).then((response) => {
        let result = response.data;
        if (response.data.is_join) {
          that.choose = result.choose;
          that.current = result.current_win_or_lose;
        }
        if (that.choose == 1 && that.current == "win") {
          that.smile = false;
          that.angry = true;
        } else if (that.choose == 1 && that.current == "lose") {
          that.smile = true;
          that.angry = false;
        } else if (that.choose == 2 && that.current == "win") {
          that.smile = false;
          that.angry = true;
        } else if (that.choose == 2 && that.current == "lose") {
          that.smile = false;
          that.angry = true;
        }
        console.log("current: " + that.choose);
      });
    },
    reload(data) {
      if (data == true) {
        this.userVoted = data;
        console.log("userVoted: " + this.userVoted);
      }
      location.reload();
    },
    offWeberr() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      location.reload();
    },
    openFail(data) {
      this.weberr = false;
      console.log("data", data);
      this.$refs.failDialog.title = data.title;
      this.$refs.failDialog.descriptionText = data.desc;
      this.$refs.failDialog.openDialog();
    },
    loadData() {
      this.loading = true;
      var tokenID = "";
      if (this.$route.query && this.$route.query.tokenID) {
        tokenID = this.$route.query.tokenID;
        var para = { key: this.address || "", token_id: tokenID };
        var that = this;
        var time = new Date().getTime(); //获取当前时间
        request.getNftInfo(para).then((response) => {
          that.item = response.data.res;
          this.base = BASE_V_API + this.item.Path;
          this.TokenID = response.data.res.TokenID;
          this.item.Owner = this.item.Owner.toLowerCase(); //转小写
          var endTime = moment(this.item.StartGame).valueOf() + 600 * 1000; //游戏结束时间
          if (time > endTime) {
            that.item.isEnd = true;
            if (that.address) {
              that.checkJoin();
            }
          }
          let arr = that.item.Path.split("/");
          let fileName = arr[arr.length - 1];
          let fileSplit = fileName.split(".");
          let suffixType = fileSplit[fileSplit.length - 1];
          if (suffixType == "mp4") {
            that.item.isVideo = true;
          } else {
            that.item.isVideo = false;
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
          if (this.item.Owner.toLowerCase() == this.address) {
            that.item.isSame = true;
          } else if (this.item.IsRunning) {
            ad.checkIsVotedOneGame(this.address, tokenID, function (result) {
              that.isVoted = result;
            });
            console.log("this.isVoted = " + that.isVoted);
          }
          console.log(that.item);
          //自己的nft中切换账号，不显示按钮
          if (
            !this.item.IsRunning &&
            this.item.IsOnSelling == "0" &&
            !this.item.isSame
          ) {
            this.noButton = true;
          }
        console.log( this.noButton,this.item.isSame)
          //输赢图片转换
          if (this.history.Result != "") {
            if (this.history.Result == 1) {
              this.smile = false;
              this.angry = true;
            } else if (this.history.Result == 2) {
              this.smile = true;
              this.angry = false;
            }
          }
          this.loading = false;
          if (this.address) {
            this.loadSales();
            this.loadPeople();
          }
        });
      }
    },
    endRound() {
      var that = this;
      ad.endRound(
        this.item.TokenID,
        function (result) {
          console.log("endRound.success", result);
          that.timer = setTimeout(that.offWeberr, 3 * 1000);
        },
        function (err) {
          console.log("endRound.err", err);
          var data = {
            title: that.$t("lang.failed"),
            desc: that.$t("lang.failedDesc"),
          };
          that.openFail(data);
        }
      );
    },
    buyNFT() {
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.purchaseDialog.TradeId = this.item.TradeId;
        this.$refs.purchaseDialog.title = this.item.Title;
        this.$refs.purchaseDialog.price = this.item.Price;
        this.$refs.purchaseDialog.path = this.base;
        this.$refs.purchaseDialog.isVideo = this.item.isVideo;
        this.$refs.purchaseDialog.openDialog();
      }
    },
    cancelSell() {
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.cancelDialog.TradeId = this.item.TradeId;
        this.$refs.cancelDialog.openDialog();
      }
    },
    collectThis: function (item) {
      //收藏和取消收藏
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
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
              // this.loadData();
              item.IsCollect = !item.IsCollect;
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
      }
    },
    openDialog() {
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.campDialog.TokenID = this.item.TokenID;
        this.$refs.campDialog.openDialog();
      }
    },
    OnSell() {
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.saledetailDialog.item = this.item;
        this.$refs.saledetailDialog.openDialog();
      }
    },
    OnStartGame() {
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        if (this.publishLoading) {
          return;
        }
        this.publishLoading = true;
        var that = this;
        ad.startGame(
          this.item.TokenID,
          function (res) {
            setTimeout(() => {
              location.reload();
            }, 1500);
          },
          function (err) {
            that.publishLoading = false;
            console.log(err);
            var data = {
              title: that.$t("lang.failed"),
              desc: that.$t("lang.failedDesc"),
            };
            that.openFail(data);
          }
        );
      }
    },
    loadSales() {
      var para = {
        token_id: this.item.TokenID,
      };
      request.saleHistory(para).then((response) => {
        if (response.code == 200 && response.data != null) {
          this.option.series.data = response.data[0];
        }
      });
    },
    loadPeople() {
      var para = {
        token_id: this.item.TokenID,
      };
      request.players(para).then((response) => {
        if (response.code == 200 && response.data != null) {
          this.history.series.data = response.data[0];
        }
      });
    },
    tabsChange(value) {
      if (value.index === "1") {
        this.isShowLine = true;
      }
    },
  },
  components: {
    saledetailDialog,
    Header,
    Footer,
    cancelDialog,
    LineChart,
    campDialog,
    failDialog,
    purchaseDialog,
    CountDate,
  },
};
</script>

<style lang="less" scoped>
.home-detail {
  min-height: 100%;
  position: relative;
  .header {
    min-width: 1200px;
  }
  .title-d {
    padding-top: 34px;
    padding-bottom: 34px;
    width: 1200px;
    margin: auto;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #594d6d;
    }
  }
  .box-d {
    width: 1200px;
    margin: auto;
    margin-bottom: 209px;
    display: flex;
    .creating-n {
      width: 490px;
      .back {
        width: 490px;
        height: 672px;
        //box-shadow: 0px 0px 8px 0px rgba(0,0,0,0.22);
        border-radius: 28px;
        // border: 1px solid;
        //background-color: red;
        position: relative;
        padding: 12px;

        // img {
        // 	width: 100%;
        // 	height: 100%;
        // 	border-radius: 20px;
        // }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 25px;
        }
        .back-top {
          width: 100%;
          height: 100%;
          object-fit: contain;
          position: absolute;
        }
        .videoThumb {
          width: 520px;
          height: 640px;
        }
        span {
          position: absolute;
          bottom: 19px;
          right: 28px;
          font-size: 22px;
          font-weight: 400;
          color: #841ae9;
          z-index: 99;
        }
      }
      .back-zan {
        width: 54px;
        height: 54px;
        display: block;
        position: absolute;
        top: 33px;
        right: 33px;
        z-index: 99;
      }
      .back-top {
        width: 100%;
        height: 100%;
        // height: 384px;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 99;
      }
      .collect {
        background: #fff url("~@/assets/img/heart.svg") no-repeat center
          center/65% 65%;
        width: 54px;
        height: 54px;
        position: absolute;
        right: 30px;
        top: 30px;
        border-radius: 50%;
        transition: all 0.2s;
        cursor: pointer;
        z-index: 101;
        &.collected {
          background-image: url("~@/assets/img/heart-fill.svg");
        }
      }
    }
    .creating-detail {
      margin-left: 50px;
      flex-grow: 1;
      span {
        font-size: 12px;
        font-weight: 400;
        color: #594d6d;
      }
      .magin-20 {
        margin-top: 20px;
        display: block;
      }
      .con {
        font-size: 32px;
        font-weight: bold;
        color: #12022f;
        line-height: 32px;
        display: block;
        display: flex;
        margin-top: 5px;
        padding-bottom: 17px;
        border-bottom: 1px solid #eeeeee;

        i {
          display: block;
          width: 32px;
          height: 32px;
          background: url(../../assets/img/bianzu.png) no-repeat;
          background-size: 100% 100%;
          margin-right: 10px;
        }
      }
      h3 {
        font-size: 24px;
        margin-top: 3px;
        font-weight: 400;
        color: #12022f;
      }
      .foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        div {
          margin: 0 8px;
          .progress-num {
            width: 500px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            span {
              font-size: 28px;
              font-weight: bold;
              color: #6a2ac8;
            }
            .cor {
              color: #fbad34;
            }
          }

          .progress {
            width: 500px;
            height: 10px;
            background: rgba(251, 173, 52, 1);
            text-align: center;
            color: #fff;

            .progressing {
              position: relative;
              float: left;
              margin: 0 auto;
              height: 10px;
              background: #6a2ac8;
            }
          }
        }
        img {
          width: 70px;
          height: 70px;
        }
      }
      .creat-p {
        display: flex;
        justify-content: start;
        margin-top: 37px;
        span {
          line-height: 24px;
        }
        .icon {
          padding: 2px 23px;
          background: #ffdddd;
          font-size: 14px;
          font-weight: 400;
          color: #12022f;
          margin-left: 23px;
          border-radius: 10em;
        }
        .time {
          font-size: 24px;
          font-weight: 400;
          color: #12022f;
          padding-left: 10px;
        }
        .con-i {
          font-size: 24px;
          font-weight: bold;
          color: #12022f;
          line-height: 28px;
          display: block;
          display: flex;

          i {
            display: block;
            width: 24px;
            height: 28px;
            background: url(../../assets/img/bianzu.png) no-repeat;
            background-size: 100% 100%;
            margin-right: 4px;
            margin-left: 5px;
          }
        }
        .circle-help {
          background: url("~@/assets/img/circle-info.svg") no-repeat center
            center/cover;
          width: 28px;
          height: 28px;
          margin-left: 20px;
        }
      }
      .butt {
        width: 254px;
        height: 56px;
        background: #ffdda9;
        border-radius: 28px;
        font-size: 16px;
        line-height: 56px;
        text-align: center;
        font-weight: 400;
        color: #12022f;
        margin-top: 37px;
      }
      .nei {
        width: 681px;
        height: 157px;
        background: #fdfbf2;
        border-radius: 8px;
        opacity: 0.85;
        border: 1px solid #ffecd1;
        margin-top: 24px;
        padding: 54px 29px;
        display: flex;
        img {
          width: 46px;
          height: 46px;
        }
        span {
          display: block;
          line-height: 46px;
          padding-left: 30px;
          font-size: 24px;
          font-weight: 600;
          color: #ebbc00;
        }
      }
      .nei-u {
        width: 681px;
        height: 157px;
        background: #fdfbf2;
        border-radius: 8px;
        opacity: 0.85;
        border: 1px solid #ffecd1;
        margin-top: 24px;
        line-height: 157px;
        display: flex;
        padding-left: 45px;
        span {
          font-size: 24px;
          font-weight: bold;
          color: #414141;
        }
        .jia {
          font-size: 64px;
          font-weight: bold;
          color: #ff2929;
          padding-left: 30px;
        }
      }

      .endtime {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: url("~@/assets/img/clock-blue.svg") no-repeat left
          center/24px 24px;
        padding-left: 34px;
        .title {
          margin-right: 20px;
        }
        .value {
          font-size: 30px;
          font-weight: 800;
        }
      }
      .detail-metas {
        background: #f3f3f3;
        border: #dcdcdc 1px solid;
        border-radius: 10px; //display:flex; justify-content: space-between;
        padding: 20px 30px;
        margin: 20px 0;
        .labels,
        .values {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .values {
          padding-top: 5px;
          font-weight: 800;
          font-size: 18px;
          .value {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .price {
              margin-left: 8px;
            }
          }
        }
        // .item-title {padding-bottom:5px;}
        // .item-value {
        //   display:flex; justify-content:flex-start; align-items:center; font-weight:800; font-size:18px;
        //   .icon {margin-right:10px;}
        // }
      }
      .mynft {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 25px 0;
        .title {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .sellprice {
            background: url("~@/assets/img/shopcart.svg") no-repeat left
              center/30px 28px;
            padding-left: 40px;
            font-size: 16px;
            line-height: 28px;
            margin-right: 50px;
          }
          .eth {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .icon {
              background: #e6e6e6 url("~@/assets/img/nft.svg") no-repeat center
                center/60% 60%;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              margin-right: 15px;
            }
            .num {
              color: #841ae9;
              font-size: 42px;
            }
          }
        }
      }
      .item {
        .hd {
          padding-bottom: 5px;
        }
        .bd {
          .state {
            display: flex;
            justify-content: space-between;
            .item-smile {
              background: url("~@/assets/img/icon-sm.svg") no-repeat center
                center/cover;
              width: 68px;
              height: 68px;
              &.fail {
                background-image: url("~@/assets/img/icon-sm-gray.svg");
              }
            }
            .item-angry {
              background: url("~@/assets/img/icon-k.svg") no-repeat center
                center/cover;
              width: 68px;
              height: 68px;
              &.fail {
                background-image: url("~@/assets/img/icon-k-gray.svg");
              }
            }
            .item-progress {
              margin: 0 20px;
              flex-grow: 1;
              .progress-text {
                font-size: 28px;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                font-weight: 800;
                padding-bottom: 10px;
                .text-left {
                  color: #6a2ac8;
                }
                .text-right {
                  color: #fbad34;
                }
                .win {
                  background: url("~@/assets/img/win.png") no-repeat center
                    center/contain;
                  width: 61px;
                  height: 43px;
                }
                .lose {
                  background: url("~@/assets/img/lose.png") no-repeat center
                    center/contain;
                  width: 81px;
                  height: 43px;
                }
                .draw {
                  background: url("~@/assets/img/draw.png") no-repeat center
                    center/contain;
                  width: 92px;
                  height: 43px;
                }
              }
              .progress {
                background: #fbad34;
                height: 10px;
                .bar {
                  background: #6a2ac8;
                  height: 10px;
                  position: relative;
                  &:after {
                    content: "";
                    height: 18px;
                    background: #000;
                    width: 2px;
                    display: block;
                    position: absolute;
                    right: 0;
                    top: -4px;
                  }
                }
              }
            }
          }
        }
      }
      .actions {
        padding: 20px 0 0 0;
        &.right {
          text-align: right;
        }
        .nft-btn,
        .nft-btn-default {
          width: 280px;
          &.is-disabled {
            opacity: 0.6;
            background: #ffdda9;
            border-color: #ffdda9;
            color: #999;
            cursor: not-allowed;
          }
        }
        .mr {
          margin-right: 20px;
        }
      }
      .message-box {
        background: #fdfbf2;
        border: 1px solid #ffecd1;
        display: flex;
        opacity: 0.85;
        border-radius: 8px;
        min-height: 157px;
        align-items: center;
        box-sizing: border-box;
        padding: 30px;
        font-weight: 800;
        .title {
          font-size: 24px;
          margin-right: 15px;
        }
        .value {
          .nums {
            font-size: 36px;
            color: #f00;
            font-weight: 800;
            margin-right: 5px;
          }
          .unit {
            font-size: 24px;
            color: #f00;
            font-weight: 800;
          }
        }
      }
    }
  }
}
.nft-btn {
  height: 56px;
  border-radius: 10em;
  text-align: center;
  background: #ffdda9;
  border: #ffdda9 1px solid;
  color: #000;
  font-size: 16px;
  line-height: 26px;
  padding: 15px 60px;
  cursor: pointer;
  display: inline-block;
  &:hover {
    opacity: 0.6;
  }
  &.disabled,
  &.is-disabled,
  &.is-disabled:hover {
    opacity: 0.6;
    background: #ffdda9;
    color: #999;
    border-color: #ffdda9;
  }
  &.btn-block {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }
}
.down {
  i {
    font-size: 20px;
    margin-right: 2px;
  }
  &:hover {
    opacity: 1;
  }
}
.nft-btn-default {
  height: 56px;
  border-radius: 10em;
  text-align: center;
  border: #dcdcdc 1px solid;
  color: #000;
  font-size: 16px;
  line-height: 26px;
  padding: 15px 60px;
  cursor: pointer;
  display: inline-block;
  &.is-disabled,
  &.is-disabled:hover {
    opacity: 0.6;
    color: #999;
    border-color: #dcdcdc;
  }
  &:hover {
    opacity: 0.6;
  }
}
.recent-container {
  .hd {
    padding: 20px 0 10px;
    font-size: 14px;
    line-height: 20px;
    color: #12022f;
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
    padding: 10px 20px;
    font-size: 16px;
    box-sizing: content-box;
    &:hover {
      color: #12022f;
      opacity: 0.6;
    }
  }
}
</style>
