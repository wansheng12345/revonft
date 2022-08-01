<template>
  <div class="home-detail" v-loading="loading">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="-1"></Header>
    </div>
    <div class="title-d">
      <span>{{ $t("lang.opting") }} - </span>
      <span style="color: #12022f">{{ item.Title }}</span>
    </div>
    <div class="box-d">
      <div class="creating-n">
        <div class="back">
          <img class="product-img" :src="base" />
          <img src="../../assets/img/detail-wrap.svg" class="back-top" />
          <div
            class="collect"
            @click="collectThis(item)"
            :class="{ collected: item.IsCollect }"
          ></div>
          <span>#{{ item.TokenID }}</span>
        </div>
      </div>
      <div class="creating-detail">
        <div class="endtime">
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
              <div class="price">0</div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="hd">{{ $t("lang.gameState") }}:</div>
          <div class="bd">
            <div class="state">
              <div class="item-smile" :class="{ fail: smile }"></div>
              <div class="item-progress">
                <div class="progress-text">
                  <div class="text-left">{{ item.ApproveCount }}</div>
                  <div class="win" v-if="item.Result == 1"></div>
                  <div class="lose" v-if="item.Result == 2"></div>
                  <div class="draw" v-if="item.Result == 3"></div>
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

        <div class="creat-p">
          <span>{{ $t("lang.ticketPrice") }}:</span>
          <div class="con-i"><i></i>0.1</div>
        </div>
        <div class="creat-p">
          <span>{{ $t("lang.Allocation") }} :</span>
          <span class="icon">To winners : {{ toWinners }}%</span>
          <span class="icon" style="background: #ddfff3"
            >To NFT Level-Up : {{ 100 - toWinners }}%</span
          >
          <el-tooltip class="item" effect="dark" placement="top">
            <div slot="content">
              {{ $t("lang.allocationInfoLine1") }}<br />{{
                $t("lang.allocationInfoLine2")
              }}
            </div>
            <span class="circle-help"></span>
          </el-tooltip>
        </div>
        <div class="message-box">
          <div class="title">{{ $t("lang.earnings") }}:</div>
          <div class="value">
            <span class="nums">+{{ Reward }}</span
            ><span class="unit">eth</span>
          </div>
        </div>
        <div class="Attention-please">
          Attention please： During the test, all tokens you gained are
          testcoins on the test network
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "../../components/footer.vue";
import request from "../../services/request";
import ad from "../../utils/web3Helper";
import { BASE_V_API } from "@/config/env";
import moment from "moment";
export default {
  name: "nftDetail",
  data() {
    return {
      loading: false,
      item: {},
      base: "",
      endTime: "",
      toWinners: 70,
      win: false,
      noItem: false,
      smile: false,
      angry: false,
      TokenID: "",
      Reward: "",
      Scale: "",
    };
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
  },
  created() {
    if (this.$route.query) {
      this.TokenID = this.$route.query.tokenID;
      this.Reward = this.$route.query.Reward;
      this.Scale = this.$route.query.Scale;
      this.loadData();
    }
  },
  methods: {
    loadData() {
      this.loading = true;
      var round = "";
      var that = this;
      if (this.$route.query && this.$route.query.tokenID) {
        round = this.$route.query.round;
        var params = {
          player: this.address,
          round: round,
          token_id: this.$route.query.tokenID,
        };
        request.joinRecord(params).then((response) => {
          if (response.code == 200) {
            this.item = response.data;
            if (that.item.TokenID && that.item.TokenID.trim().length > 6) {
              that.item.TokenID = that.item.TokenID.substr(0, 4);
            }
            var endTime = parseInt(response.data.Start) + 600; //游戏结束时间
            this.endTime = moment(endTime * 1000).format("yyyy-MM-DD HH:mm:ss"); //设置顶部结束时间
            this.item.Amount = ad.fromWei(this.item.Amount); //转换Amount
            this.base = BASE_V_API + this.item.Path; //图片地址
            var ac = parseInt(this.item.ApproveCount);
            var dc = parseInt(this.item.DefuseCount);
            if (ac == 0 && dc == 0) {
              this.item.Rate = 0.5;
            } else {
              this.item.Rate = ac / (ac + dc);
            }
            //输赢图片转换
            if (this.item.Choose == 1 && this.item.Result == 1) {
              that.win = true;
            } else if (this.item.Choose == 2 && this.item.Result == 2) {
              that.win = true;
            }
          }
        });
        //Allocation
        if (this.Scale < 1) {
          this.toWinners = 70;
        }
        if (this.Scale << 10) {
          this.toWinners = 50;
        }
        if (this.Scale > 1) {
          this.toWinners = 30;
        }
        if (this.Reward && this.Reward.length > 0) {
          this.Reward = ad.fromWei(this.Reward);
        }
        if (this.item.Result == 1 && this.item.Choose == 1) {
          this.smile = false;
          this.angry = true;
        } else if (this.item.Result == 2 && this.item.Choose == 2) {
          this.smile = false;
          this.angry = true;
        } else if (this.item.Result == 1 && this.item.Choose == 2) {
          this.smile = false;
          this.angry = true;
        } else if (this.item.Result == 2 && this.item.Choose == 1) {
          this.smile = false;
          this.angry = true;
        } else {
          this.smile = false;
          this.angry = false;
        }
        this.loading = false;
      } else {
        this.$message.error("参数传递错误");
      }
    },
    collectThis: function (item) {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        //收藏和取消收藏
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
              this.loadData();
            }
          });
        } else {
          request.addMyCollect(para).then((response) => {
            if (response.code == 200) {
              this.$message({
                message: "添加收藏成功",
                type: "success",
              });
              this.loadData();
            }
          });
        }
      }
    },
  },
  components: {
    Header,
    Footer,
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
        margin: 30px auto;
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
      .Attention-please {
        font-size: 13px;
        color: #594d6d;
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
