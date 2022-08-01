<!-- 个人中心 -->
<template>
  <div class="personal-page">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="4"></Header>
    </div>
    <div class="banner">
      <img src="./../../assets/img/personal-banner.png" alt="" />
    </div>
    <nav class="info" v-if="showMessage">
      <div class="message">
        <div class="left-text">
          <h3>Attention please：</h3>
          <p>
            During the test, all tokens you earned (ETH&RTV) by trading or
            voting are testcoins on the test network !
          </p>
          <p>
            Only the RTV by completing the task can be claimed on Ethereum
            Mainnet !
          </p>
        </div>
        <div class="right-close" @click="showMessage = false">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </nav>
    <section>
      <ul class="total-box">
        <li>
          <div class="icon">
            <img src="./../../assets/img/N.svg" alt="" />
          </div>
          <p class="name">NFT</p>
          <h5>{{ info.nft_amount || 0 }}</h5>
        </li>
        <li>
          <div class="icon">
            <img src="./../../assets/img/voting.svg" alt="" />
          </div>
          <p class="name">Total Voting</p>
          <h5>{{ info.total_voting || 0 }}</h5>
        </li>
        <li>
          <div class="icon">
            <img src="./../../assets/img/bound-icon.svg" alt="" />
          </div>
          <p class="name">Total Bound Value</p>
          <h5>{{ info.total_bound_value || 0 }} ETH</h5>
        </li>
        <li>
          <div class="icon">
            <img src="./../../assets/img/N-icon.svg" alt="" />
          </div>
          <p class="name">Total Sales Value</p>
          <h5>{{ info.total_sales_value || 0 }} ETH</h5>
        </li>
        <li class="total-long">
          <div class="icon">
            <img src="./../../assets/img/total.svg" alt="" />
          </div>
          <p class="name">Total Earnings</p>
          <div class="eth-rtv">
            <h5>{{ info.total_earnings_eth || 0 }} ETH</h5>
            <span></span>
            <h5>{{ info.total_earnings_rtv || 0 }} RTV</h5>
          </div>
        </li>
      </ul>
      <div class="eht-container">
        <div class="title">
          <img src="./../../assets/img/ETH.png" alt="" />
          <span>ETH</span>
          <b></b>
        </div>
        <!-- 提现 -->
        <ul class="Withdraw-box">
          <li>
            <!-- <p>{{ $t("lang.Portfolio") }}</p> -->
            <p>Balance</p>
            <h4>{{ balance.total }}</h4>
          </li>
          <li>
            <!-- <p>{{ $t("lang.Participating") }}</p> -->
            <p>Open Positions</p>
            <h4>{{ balance.participating }}</h4>
          </li>
          <li>
          <!-- <li> -->
            <!-- <p>{{ $t("lang.Available") }}</p> -->
            <p>Cash</p>
            <h4>{{ balance.portfolio }}</h4>
          </li>
          <li class="Withdraw">
            <div @click="OnWithDraw" :class="{ disabled: balance.total <= 0 }">
              Withdraw
            </div>
          </li>
        </ul>
      </div>
      <div class="rtv-container">
        <div class="title">
          <img src="./../../assets/img/RTV.png" alt="" />
          <span>RTV</span>
          <b></b>
        </div>
        <h6>Rewards</h6>
        <ul class="rewards">
          <li>
            <div class="row">
              <p>Balance</p>
              <el-tooltip
                class="item"
                effect="dark"
                popper-class="atooltip"
                content="Distributed uniformly after test"
                placement="top-start"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <h2>{{ info.rewards_balance || 0 }}</h2>
            <div class="Claim">Claim</div>
          </li>
          <li>
            <p>Interactive reward</p>
            <h4>{{ info.rewards_interactive || 0 }}</h4>
            <p>Top 1000</p>
            <h4>{{ info.top_thousand || 0 }}</h4>
          </li>
          <li>
            <p>Daily reward</p>
            <h4>{{ info.rewards_daily || 0 }}</h4>
            <p>BUG/Suggestions reward</p>
            <h4>{{ info.rewards_bug || 0 }}</h4>
          </li>
          <li class="last">
            <p>
              Ranking reward
              <span class="rank" @click="handleRanking">View ranking</span>
            </p>
            <h4>{{ info.rewards_ranking || 0 }}</h4>
          </li>
        </ul>
      </div>
      <div class="rtv-container" v-if="isAddress">
        <!-- Public-sale -->
        <h6>Public-sale</h6>
        <ul class="Public-sale">
          <li>
            <p>Balance</p>
            <h3>{{ PublicSale.available }}</h3>
          </li>
          <li>
            <p>Locked</p>
            <h3>{{ PublicSale.locked }}</h3>
          </li>
          <li>
            <p>UnLocked</p>
            <h3>{{ PublicSale.total }}</h3>
          </li>
          <li class="claim">
            <div :class="{ disabled: PublicSale.total <= 0 }">Claim</div>
          </li>
        </ul>
        <!-- history -->
        <div class="history-row" @click="handleClick">
          <span>History</span>
          <i :class="show ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </div>
        <div class="table" v-if="tableData.length > 0">
          <ul v-show="show">
            <li class="theader">
              <span>{{ $t("lang.Date") }}</span>
              <span>{{ $t("lang.PurchaseType") }}</span>
              <span>{{ $t("lang.Amount") }}</span>
            </li>
            <li v-for="(v, i) in tableData" :key="i">
              <span>{{ v.CreatedAt }}</span>
              <span
                >{{
                  v.Description == "Purchase"
                    ? $t("lang.PurchaseType")
                    : $t("lang.withdraw")
                }}( {{ $t("lang.round") }}
                {{ v.Round }}
                {{ $t("lang.roundDesc") }} )</span
              >
              <span>{{ v.Amount }} RTV</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "../../components/footer.vue";
import request from "@/services/request";
import ad from "@/utils/web3Helper.js";
import moment from "moment";
export default {
  data() {
    return {
      showMessage: true,
      show: false,
      tableData: [],
      balance: {
        participating: 0,
        portfolio: 0,
        total: 0,
      },
      info: {},
      PublicSale: {
        available: 0,
        locked: 0,
        total: 0,
      },
    };
  },
  components: {
    Header,
    Footer,
  },
  computed: {
    isAddress() {
      var a = this.address.toLowerCase();
      var a1 = "0x6624ba70EADA1fd1e3B12034a3219170135510cd".toLowerCase();
      var a2 = "0x7621c77F2BA72C3B6577ED02000Ce83a049ac893".toLowerCase();
      var a3 = "0xa76569F2cE5eaEA0f8a725E4Faebc8683b06967D".toLowerCase();
      var a4 = "0x1220441DACB1342534ea6884aaDCE764A96F3917".toLowerCase();
      var a5 = "0x8a9830BB7ca1058dC797B552aB35d4036D10Da22".toLowerCase();
      let show = a == a1 || a == a2 || a == a3 || a == a4 || a == a5;
      return show;
    },
    address() {
      return this.$store.getters.address;
    },
  },
  mounted() {
    let token = sessionStorage.getItem("Token");
    if (!token) {
      Object.assign(this.$data, this.$options.data());
      sessionStorage.setItem("iSsignature", false);
      this.getSign();
    } else {
      this.getMyBalance();
      this.getHistory();
      this.get_address_info();
      this.getPublicSale();
    }
    let scroll = sessionStorage.getItem("scroll");
    if (scroll == "true") {
      setTimeout(() => {
        window.scroll(0, 270);
      }, 100);
    }
  },
  methods: {
    moment,
    OnWithDraw() {
      if (this.balance.total > 0) {
        var that = this;
        ad.withdraw(
          function (result) {
            location.reload();
          },
          function (err) {
            console.log(err);
            var data = {
              title: that.$t("lang.failed"),
              desc: that.$t("lang.failedDesc"),
            };
          }
        );
      }
    },
    handleRanking() {
      this.$router.push("rank");
    },
    handleClick() {
      this.show = !this.show;
    },
    getHistory() {
      let para = {
        address: this.address,
        page: 1,
        page_size: 10,
      };
      request.active(para).then((response) => {
        if (response.code == 200) {
          this.tableData = response.data.map((v, index) => {
            return {
              CreatedAt: moment(v.CreatedAt).format("yyyy-MM-DD HH:mm:ss"),
              Amount: ad.fromWei(v.Amount),
              Description: v.Description,
              Round: v.Round,
            };
          });
        }
      });
    },
    getMyBalance() {
      var para = {
        address: this.address,
      };
      var that = this;
      request.balance(para).then(
        (response) => {
          if (response.code == "200") {
            that.balance = response.data;
            if (that.balance.portfolio > 10000) {
              that.balance.portfolio = (
                that.balance.portfolio / 1000000000000000000.0
              ).toFixed(4);
            }
            if (that.balance.participating > 10000) {
              that.balance.participating = (
                that.balance.participating / 1000000000000000000.0
              ).toFixed(4);
            }
            if (that.balance.total > 10000) {
              that.balance.total = (
                that.balance.total / 1000000000000000000.0
              ).toFixed(4);
            }
          } else {
            this.$message.error(response.msg);
          }
        },
        (err) => {
          console.log(err, "err");
        }
      );
    },
    get_address_info() {
      request.address_info({ address: this.address }).then((res) => {
        if (res.code == 200) {
          this.info = res.data;
        }
      });
    },
    getPublicSale() {
      request.saleBalance({ address: this.address }).then((res) => {
        if (res.code == 200) {
          this.PublicSale = res.data;
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
.personal-page {
  .banner {
    width: 100%;
    img {
      width: 100%;
    }
  }
  nav.info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 84px;
    background: linear-gradient(180deg, #3e57ff 0%, #3c4897 100%);
    color: #fff;
    font-size: 12px;
    transform: translate(0, -3px);
    .message {
      width: 1100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        font-size: 14px;
        line-height: 25px;
      }
      p {
        line-height: 23px;
        color: #f8f8f8;
      }
      .right-close {
        background: #1b2fb7;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        &:hover {
          background: #0922c9;
        }
        i {
          font-size: 18px;
          color: #fff;
        }
      }
    }
  }
  section {
    width: 1100px;
    margin: 20px auto;
    .title {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      img {
        width: 16px;
      }
      span {
        font-size: 16px;
        display: inline-block;
        color: #333;
        font-weight: 600;
        margin: 0 8px;
      }
      b {
        flex: 1;
        border-top: 1px solid #cbcbcb;
      }
    }
    .total-box {
      margin: 25px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      li {
        width: 16.5%;
        line-height: 40px;
        background: #eff1ff;
        border-radius: 4px;
        font-size: 15px;
        padding: 5px 0;
        padding-left: 3%;
        position: relative;
        p {
          color: #666666;
        }
        h5 {
          font-size: 26px;
          line-height: 50px;
        }
        .icon {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 35px;
          height: 35px;
          border-radius: 35px;
          z-index: 2;
          background: #ececec;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 95%;
          }
        }
        &.total-long {
          width: 28%;
          .eth-rtv {
            display: flex;
            align-items: center;
            h5 {
              margin-right: 15px;
            }
            span {
              display: inline-block;
              width: 2px;
              height: 18px;
              background: #d8d8d8;
              margin-right: 15px;
            }
          }
        }
      }
    }
    .eht-container {
      .Withdraw-box {
        background: #f7f6f6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 4%;
        margin-bottom: 30px;
        border-radius: 4px;
        li {
          width: 25%;
          line-height: 40px;
          p {
            color: #666;
            font-size: 15px;
          }
          h4 {
            color: #333;
            font-size: 28px;
          }
          &.Withdraw {
            text-align: left;
            div {
              width: 150px;
              line-height: 40px;
              background: #3c4897;
              text-align: center;
              cursor: pointer;
              color: #fff;
              font-size: 15px;
              border-radius: 2px;
              &:hover {
                background: #2c3eb3;
              }
              &.disabled {
                background: #ccc;
                cursor: not-allowed;
                &:hover {
                  background: #ccc;
                }
              }
            }
          }
        }
      }
    }
    .rtv-container {
      & > h6 {
        font-size: 16px;
        color: #333;
        line-height: 40px;
      }
      .rewards {
        background: #f7f6f6;
        display: flex;
        padding: 15px 4%;
        li {
          width: 24%;
          line-height: 40px;
          &:first-child {
            border-right: 1px solid #bfbfbf;
            margin-right: 5%;
          }
          p {
            font-size: 14px;
            color: #666;
            span.rank {
              display: inline-block;
              line-height: 26px;
              padding: 0 15px;
              margin-left: 15px;
              font-size: 12px;
              color: #3c4897;
              cursor: pointer;
              border: 1px solid #3c4897;
              border-radius: 4px;
            }
          }
          .row {
            display: flex;
            align-items: center;
            p {
              margin-right: 10px;
            }
            i {
              font-size: 22px;
              color: #757ba5;
            }
          }
          h2 {
            font-size: 36px;
            color: #333;
            line-height: 50px;
            margin: 10px 0;
          }
          h4 {
            font-size: 20px;
            color: #333;
          }
          .Claim {
            background: #ccc;
            cursor: not-allowed;
            width: 120px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            font-size: 15px;
            border-radius: 2px;
          }
        }
      }
      .Public-sale {
        background: #f7f6f6;
        display: flex;
        align-items: center;
        padding: 15px 4%;
        li {
          width: 25%;
          line-height: 40px;
          p {
            font-size: 14px;
            color: #666;
          }
          h3 {
            font-size: 20px;
            color: #333;
          }
          &.claim {
            div {
              width: 150px;
              font-size: 15px;
              line-height: 40px;
              background: #3c4897;
              text-align: center;
              cursor: pointer;
              color: #fff;
              border-radius: 2px;
              &:hover {
                background: #2c3eb3;
              }
            }
            .disabled {
              background: #ccc;
              cursor: not-allowed;
              &:hover {
                background: #ccc;
              }
            }
          }
        }
      }
    }
    .history-row {
      line-height: 40px;
      background: #70768a;
      color: #fff;
      font-weight: 600;
      padding-left: 2%;
      margin-top: 15px;
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        font-size: 20px;
        margin-left: 5px;
      }
    }
  }
}
.router-slid-enter-active,
.router-slid-leave-active {
  transition: all 0.3s;
}
.router-slid-enter,
.router-slid-leave-active {
  transform: translate(0, 1rem);
  opacity: 0;
}
.table {
  padding: 0 2%;
  background-color: #70768a;
  ul {
    width: 100%;
    border-top: 1px solid #fff;
    padding: 10px 0;
    li {
      line-height: 40px;
      width: 100%;
      span {
        color: #fff;
        display: inline-block;
        width: 30%;
        font-size: 14px;
        &:last-child {
          width: 40%;
        }
      }
    }
    .theader {
      span {
        font-weight: 600;
        font-size: 16px;
      }
    }
  }
}
.box /deep/ .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: #70768a;
}
.box /deep/ .el-table .cell {
  color: #fff;
}
.box /deep/ .el-table--border td,
.box /deep/ .el-table--border th,
.box
  /deep/
  .el-table__body-wrapper
  .el-table--border.is-scrolling-left
  ~ .el-table__fixed {
  border-color: #70768a;
}
</style>
<style>
.atooltip.el-tooltip__popper[x-placement^="top-start"] .popper__arrow {
  border-top-color: #757ba5;
}
.atooltip.el-tooltip__popper[x-placement^="top-start"] .popper__arrow:after {
  border-top-color: #757ba5;
}
.el-tooltip {
  cursor: pointer;
}
.atooltip {
  background: #757ba5 !important;
}
</style>