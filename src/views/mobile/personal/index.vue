<!-- 个人中心 -->
<template>
  <div class="mobile-personal-page">
    <Header custom-active="4-3"></Header>
    <transition name="fade">
      <div class="message-container" v-if="showAttention">
        <h2>Attention please :</h2>
        <p>
          During the test, all tokens you earned (ETH&RTV) by trading or voting
          are testcoins on the test network !
        </p>
        <p>
          Only the RTV by completing the task can be claimed on Ethereum Mainnet
          !
        </p>
        <div class="close-box" @click="closeAttention">
          <i class="el-icon-close"></i>
        </div>
      </div>
    </transition>
    <div class="scroll-container">
      <ul>
        <li>
          <div class="icon">
            <img src="@/assets/img/N.svg" alt="" />
          </div>
          <p class="name">NFT</p>
          <h5>{{ info.nft_amount || 0 }}</h5>
        </li>
        <li>
          <div class="icon">
            <img src="@/assets/img/voting.svg" alt="" />
          </div>
          <p class="name">Total Voting</p>
          <h5>{{ info.total_voting || 0 }}</h5>
        </li>
        <li>
          <div class="icon">
            <img src="@/assets/img/bound-icon.svg" alt="" />
          </div>
          <p class="name">Total Bound Value</p>
          <h5>{{ info.total_bound_value || 0 }} ETH</h5>
        </li>
        <li>
          <div class="icon">
            <img src="@/assets/img/N-icon.svg" alt="" />
          </div>
          <p class="name">Total Sales Value</p>
          <h5>{{ info.total_sales_value || 0 }} ETH</h5>
        </li>
        <li class="total-long">
          <div class="icon">
            <img src="@/assets/img/total.svg" alt="" />
          </div>
          <p class="name">Total Earnings</p>
          <div class="eth-rtv">
            <h5>{{ info.total_earnings_eth || 0 }} ETH</h5>
            <span></span>
            <h5>{{ info.total_earnings_rtv || 0 }} RTV</h5>
          </div>
        </li>
      </ul>
    </div>
    <section>
      <div class="eht-container">
        <div class="title">
          <img src="@/assets/img/ETH.png" alt="" />
          <span>ETH</span>
          <b></b>
        </div>
        <!-- 提现 -->
        <ul class="Withdraw-box">
          <li>
            <p>{{ $t("lang.Portfolio") }}</p>
            <h4>{{ balance.total || 0 }}</h4>
          </li>
          <li>
            <p>{{ $t("lang.Participating") }}</p>
            <h4>{{ balance.participating || 0 }}</h4>
          </li>
          <li>
            <p>{{ $t("lang.Available") }}</p>
            <h4>{{ balance.portfolio || 0 }}</h4>
          </li>
          <div class="Withdraw">
            <div @click="OnWithDraw" :class="{ disabled: balance.total <= 0 }">
              {{ $t("lang.withdraw") }}
            </div>
          </div>
        </ul>
      </div>
      <div class="rtv-container">
        <div class="title">
          <img src="@/assets/img/RTV.png" alt="" />
          <span>RTV</span>
          <b></b>
        </div>
        <h6>Rewards</h6>
        <div class="rewards">
          <div class="line1">
            <div class="row">
              <div>
                <p>Balance</p>
                <i class="el-icon-info" @click="showBalanceInfo"></i>
              </div>
              <h2>{{ info.rewards_balance || 0 }}</h2>
              <!-- <el-tooltip
              class="item"
              effect="dark"
              popper-class="atooltip"
              content="Distributed uniformly after test"
              placement="top-start"
            >
              <i class="el-icon-info"></i>
            </el-tooltip> -->
            </div>
            <div class="Claim">Claim</div>
          </div>
          <ul>
            <li>
              <div class="key">Interactive reward</div>
              <div class="val">{{ info.rewards_interactive || 0 }}</div>
            </li>
            <li>
              <div class="key">Daily reward</div>
              <div class="val">{{ info.rewards_daily || 0 }}</div>
            </li>
            <li>
              <div class="key">Top 1000</div>
              <div class="val">{{ info.top_thousand || 0 }}</div>
            </li>
            <li>
              <div class="key">BUG/Suggestions reward</div>
              <div class="val">{{ info.rewards_daily || 0 }}</div>
            </li>
            <li class="ranking">
              <div class="key">
                <div>Ranking reward</div>
                <div class="viewRank" @click="handleRanking">View ranking</div>
              </div>
              <div class="val">{{ info.rewards_ranking || 0 }}</div>
            </li>
          </ul>
        </div>
        <div class="Public-sale" v-if="isAddress">
          <h6>Public-sale</h6>
          <ul class="Public-sale-ul">
            <li>
              <p>Balance</p>
              <h3>{{ PublicSale.available || 0 }}</h3>
            </li>
            <li>
              <p>Locked</p>
              <h3>{{ PublicSale.locked || 0 }}</h3>
            </li>
            <li>
              <p>UnLocked</p>
              <h3>{{ PublicSale.total || 0 }}</h3>
            </li>
            <li class="claim">
              <div :class="{ disabled: PublicSale.total <= 0 }">Claim</div>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <!-- history -->
    <div class="history" v-if="isAddress">
      <div class="history-row" @click="handleClick">
        <span>History</span>
        <i :class="show ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
      </div>
      <div class="table" v-if="tableData.length > 0">
        <ul v-show="show">
          <li class="theader">
            <span>{{ $t("lang.Date") }}</span>
            <span>{{ $t("lang.PurchaseType") }}</span>
          </li>
          <li v-for="(v, i) in tableData" :key="i">
            <span>{{ v.CreatedAt }}</span>
            <span
              >{{
                v.Description == "Purchase"
                  ? $t("lang.PurchaseType")
                  : $t("lang.withdraw")
              }}{{ v.Amount }}RTV</span
            >
          </li>
        </ul>
      </div>
    </div>
    <Message ref="message"></Message>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import Message from "@/components/mobile/Message.vue";
import request from "@/services/request";
import ad from "@/utils/web3Helper.js";
export default {
  data() {
    return {
      showAttention: true,
      show: false,
      info: {},
      balance: {},
      PublicSale: {},
      tableData: [],
    };
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
        window.scroll(0, 480);
      }, 1000);
    }
  },
  methods: {
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
              CreatedAt: this.$moment(v.CreatedAt).format(
                "yyyy-MM-DD HH:mm:ss"
              ),
              Amount: ad.fromWei(v.Amount),
              Description: v.Description,
              Round: v.Round,
            };
          });
        }
      });
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
    closeAttention() {
      this.showAttention = false;
    },
    showBalanceInfo() {
      this.$refs.message.msg = "Distributed uniformly after test";
      this.$refs.message.show = true;
    },
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
    handleClick() {
      this.show = !this.show;
    },
    handleRanking() {
      this.$router.push("rank-m");
    },
  },
  components: {
    Header,
    Footer,
    Message,
  },
};
</script>
<style lang='less' scoped>
.mobile-personal-page {
  .message-container {
    background: linear-gradient(180deg, #3e57ff 0%, #3c4897 100%);
    color: #fff;
    padding: 10px 15px;
    position: relative;
    transition: all 0.3 ease-in;
    h2 {
      font-size: 14px;
    }
    p {
      font-size: 12px;
      line-height: 18px;
      margin-top: 10px;
    }
    .close-box {
      position: absolute;
      right: 10px;
      top: 8px;
      background: #1b2fb7;
      padding: 4px 6px;
      border-radius: 50%;
      font-size: 16px;
    }
  }
  .scroll-container {
    width: 100%;
    overflow: auto;
    ul {
      display: flex;
      margin: 15px 0;
      li {
        min-width: 40%;
        margin-left: 4%;
        height: 80px;
        position: relative;
        line-height: 30px;
        background: #eff1ff;
        border-radius: 4px;
        font-size: 13px;
        padding: 5px 0;
        padding-left: 8%;
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
            width: 90%;
          }
        }
        p {
          color: #666666;
        }
        h5 {
          font-size: 20px;
          line-height: 35px;
        }
      }
      .total-long {
        min-width: 60%;
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
  section {
    padding: 0 15px;
    margin: 10px 0;
  }
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    img {
      width: 12px;
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
  .Withdraw-box {
    background: #f7f6f6;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 2%;
    border-radius: 4px;
    flex-wrap: wrap;
    li {
      width: 30%;
      line-height: 40px;
      p {
        color: #666;
        font-size: 13px;
      }
      h4 {
        color: #333;
        font-size: 22px;
      }
    }
  }
  .Withdraw {
    margin: 10px 0;
    div {
      width: 120px;
      line-height: 35px;
      background: #3c4897;
      text-align: center;
      cursor: pointer;
      color: #fff;
      font-size: 13px;
      border-radius: 2px;
      &.disabled {
        background: #ccc;
        cursor: not-allowed;
        &:hover {
          background: #ccc;
        }
      }
    }
  }
  .rtv-container {
    margin-top: 10px;
    h6 {
      color: #333333;
      font-size: 16px;
      line-height: 40px;
    }
    .rewards {
      background: #f7f6f6;
      margin: 10px 0;
      padding: 20px 15px;
      border-radius: 4px;
      font-size: 14px;
      .line1 {
        display: flex;
        align-items: center;
      }
      .row {
        color: #666666;
        line-height: 30px;
        width: 50%;
        & > div {
          display: flex;
          align-items: center;
        }
        h2 {
          font-size: 26px;
          color: #333;
        }
        i {
          font-size: 18px;
          color: #757ba5;
          margin-left: 5px;
        }
      }
      .Claim {
        background: #a2a2a2;
        cursor: not-allowed;
        width: 120px;
        line-height: 35px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        border-radius: 2px;
      }
      & > ul {
        display: flex;
        flex-wrap: wrap;
        li {
          width:50%;
          margin-bottom: 10px;
          & > div {
            line-height: 38px;
          }
          .key {
            color: #666666;
            font-size: 13px;
          }
          .val {
            color: #333;
            font-size: 20px;
            font-weight: 700;
          }
          &.ranking {
            width: 100%;
            & > div {
              display: flex;
              align-items: center;
              .viewRank {
                margin-left: 10px;
                line-height: 26px;
                padding: 0 12px;
                font-size: 12px;
                color: #3c4897;
                border: 1px solid #3c4897;
                border-radius: 2px;
              }
            }
          }
        }
      }
    }
    .Public-sale {
      .Public-sale-ul {
        background: #f7f6f6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 2% 10px;
        border-radius: 4px;
        flex-wrap: wrap;
        li {
          width: 30%;
          line-height: 40px;
          p {
            color: #666;
            font-size: 13px;
          }
          h3 {
            color: #333;
            font-size: 22px;
          }
          &.claim {
            margin-top: 15px;
            div {
              width: 120px;
              line-height: 35px;
              background: #3c4897;
              text-align: center;
              cursor: pointer;
              color: #fff;
              font-size: 13px;
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
  }
  .history {
    padding-bottom: 10px;
  }
  .history-row {
    line-height: 35px;
    background: #70768a;
    color: #fff;
    font-weight: 600;
    padding-left: 2%;
    margin-top: 10px;
    font-size: 13px;
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      font-size: 16px;
      margin-left: 5px;
    }
  }
  .table {
    padding: 0 2%;
    background-color: #70768a;
    ul {
      width: 100%;
      border-top: 1px solid #868ca2;
      padding: 10px 0;
      li {
        line-height: 40px;
        width: 100%;
        span {
          color: #fff;
          display: inline-block;
          width: 50%;
          font-size: 12px;
        }
      }
      .theader {
        span {
          font-weight: 600;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transform: translateX(-50%);
  transition: all 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>