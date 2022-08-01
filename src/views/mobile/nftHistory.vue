<template>
  <div class="mobile-container">
    <Header></Header>
    <div class="detail-container">
      <!-- 公共图片 -->
      <div class="thumbnail">
        <img class="img" :src="base" />
        <!-- <div
          class="collect"
          @click="addCollect(item)"
          :class="{ collected: item.IsCollect }"
        ></div> -->
        <ul class="card">
          <li>
            <span class="owner">{{
              item.Owner.substr(0, 8) +
              "...." +
              item.Owner.substr(item.Owner.length - 8, 8)
            }}</span>
            <span>Value</span>
          </li>
          <li>
            <span class="title">{{ item.Title }}</span>
            <div>
              <img src="./../../assets/img/icon.png" alt="" />
              <span>{{ item.Amount }}</span>
            </div>
          </li>
        </ul>
        <div class="num">CryptoTrunk #{{ item.TokenID }}</div>
      </div>
      <!-- 参与游戏 信息文字部分 -->
      <div class="info">
        <div class="time">
          <div class="endtime">
            <div class="title">End time:</div>
            <div class="value">{{ endTime }}</div>
          </div>
          <div class="Ticket">
            <span>Ticket price:</span>
            <div>
              <img src="./../../assets/img/icon.png" alt="" />
              <span>{{ item.Amount }}</span>
            </div>
          </div>
        </div>
        <div class="allocation">
          <div class="title">Allocation:</div>
          <div class="value">
            <div class="label label-red">To winners:{{ toWinners }}%</div>
            <div class="label label-green">
              To NFT Level-Up:{{ 100 - toWinners }}%
            </div>
            <el-tooltip placement="top">
              <div slot="content">
                In the event of a tie,<br />
                participants will be deducted <br />5% of the ticket price,
                <br />which means a return of 95%
              </div>
              <div class="circle-help"></div>
            </el-tooltip>
          </div>
        </div>
        <!-- 点赞或者踩 -->
        <div class="progress-container">
          <div class="progress-wrapper">
            <div
              class="progress-look look-smile"
              :class="{ gray: item.ApproveCount < item.DefuseCount }"
            ></div>
            <div class="progress-box">
              <div class="progress-text">
                <div class="text left">{{ item.ApproveCount }}</div>
                <img
                  src="./../../assets/img/win.png"
                  v-if="item.Result == 1"
                  alt=""
                />
                <img
                  src="./../../assets/img/lose.png"
                  v-if="item.Result == 2"
                  alt=""
                />
                <img
                  src="./../../assets/img/draw.png"
                  v-if="item.Result == 3"
                  alt=""
                />
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
        <!-- Your earnings: -->
        <div class="earnings">
          <p>
            <span>Your earnings：</span>
            <span class="value"
              >+ {{ Reward }}
              <sub>eth</sub>
            </span>
          </p>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import request from "../../services/request";
import ad from "../../utils/web3Helper";
import { BASE_V_API } from "@/config/env";
import moment from "moment";
export default {
  name: "nftDetail-m",
  data() {
    return {
      item: {},
      base: "",
      endTime: "",
      toWinners: 70,
      TokenID: "",
      loading: null,
      win: false,
      smile: false,
      angry: false,
      Reward: "",
      Scale: "",
    };
  },
  components: {
    Header,
    Footer,
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
    //收藏和取消收藏
    addCollect() {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        var para = {
          address: this.address,
          token_id: this.item.TokenID,
        };
        if (this.item.IsCollect == true) {
          request.delMyCollect(para).then((response) => {
            if (response.code == 200) {
              this.loadData();
            }
          });
        } else {
          request.addMyCollect(para).then((response) => {
            if (response.code == 200) {
              this.loadData();
            }
          });
        }
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
      text-align: center;
      background: #fff;
      border-radius: 5px 0 0 0;
      color: #841ae9;
      font-size: 13px;
      font-weight: 600;
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
          padding: 5px 10px;
          height:30px;
          border-radius: 25px;
          color: #000;
          margin-right: 10px;
          text-align: center;
          font-size:12px;
          width: 40%;
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
  }
}
/deep/ .el-tooltip__popper {
  width: 300px;
  margin: 0 auto;
  left: 0;
  right: 0;
}
</style>
