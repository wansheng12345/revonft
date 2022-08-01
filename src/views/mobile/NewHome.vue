<!--  -->
<template>
  <div class="mobile-home-page">
    <Header custom-active="0"></Header>
    <Banner></Banner>
    <section>
      <!-- do -->
      <div class="do">
        <h1>What we do</h1>
        <p>
          Retain the decentralized auction pipeline as an auxiliary form of
          value discovery and work together to realize the discovery of NFT
          value.
        </p>
        <ul class="btn">
          <li @click="handleClick('https://www.revonft.com/faucet/')">
            Faucet
          </li>
          <li
            @click="
              handleClick(
                'https://www.revonft.com/book/RevolutionwhitepaperEnglish.pdf'
              )
            "
          >
            Whitepaper
          </li>
        </ul>
      </div>
      <!--  -->
      <ul class="text-img-container">
        <li>
          <h3>Genesis NFT Published</h3>
          <p>
            Purchase and mint a unique NFT for you which binds eth token ，and
            then start a journey that bring you benefits
          </p>
          <div class="btn" @click="handleGo">Create</div>
        </li>
        <li class="img-li">
          <img src="@/assets/img/Published.png" alt="" />
        </li>
      </ul>
      <!-- 游戏 Game -->
      <div class="game">
        <h2>{{ $t("lang.gameNavigation") }}</h2>
        <p>
          The game form is introduced to make NFT go through a more sufficient
          game,so as to realize the value discovery of NFT.
        </p>
        <div class="card-container">
          <ul class="card">
            <li
              v-for="v in gameList"
              :key="v.tokenId"
              @click="gotoDetail(v.tokenId)"
            >
              <div class="img-container">
                <img :src="v.src" alt="" />
              </div>
              <h4>
                <span>{{ v.title }}</span>
                <span># {{ v.tokenId }}</span>
              </h4>
              <p class="row">
                <span class="Owner">{{
                  v.Owner.substr(0, 6) +
                  "...." +
                  v.Owner.substr(v.Owner.length - 6, 8)
                }}</span>
                <span
                  ><img src="@/assets/img/icon.png" alt="" />{{
                    v.Amount
                  }}</span
                >
              </p>
              <!-- 票数 -->
              <div class="progress-container">
                <p>
                  <span>{{ v.ApproveCount }}</span>
                  <span class="defuse-count">{{ v.DefuseCount }}</span>
                </p>
                <div class="progress">
                  <span
                    class="progressing"
                    v-bind:style="'width:' + v.Rate * 100 + '%'"
                  >
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="game-btn">
          <div class="all" @click="$router.push({ name: 'pickMarket-m' })">
            {{ $t("lang.viewAll") }}
          </div>
        </div>
      </div>
    </section>
    <!-- 买卖市场 product -->
    <div class="product-header">
      <img src="./../../assets/img/animate.png" alt="" />
      <div class="container">
        <h2>The first NFT product</h2>
        <p>
          - using cooperative and non-cooperative game pricing <br />
          systems and value precipitation models
        </p>
      </div>
    </div>
    <section class="send">
      <div class="main market">
        <div class="market-desc">
          <h2>The Most Popular Trading Market</h2>
          <p>
            Compared with the traditional single auction model, cooperative game
            and non cooperative game models are introduced to make NFT have more
            sufficient game and make the price closer to the value of NFT
            itself, so as to realize the value discovery of NFT.
          </p>
        </div>
        <ul class="card">
          <li
            v-for="v in marketList"
            :key="v.tokenId"
            @click="gotoDetail(v.tokenId)"
          >
            <div class="img-container">
              <img :src="v.src" alt="" />
            </div>
            <h4>
              <span>{{ v.title }}</span>
              <span># {{ v.tokenId }}</span>
            </h4>
            <p class="row">
              <span class="Owner">{{
                v.Owner.substr(0, 6) +
                "...." +
                v.Owner.substr(v.Owner.length - 6, 8)
              }}</span>
              <span
                ><img src="@/assets/img/icon.png" alt="" />{{ v.Price }}</span
              >
            </p>
          </li>
        </ul>
        <div class="game-btn">
          <div @click="$router.push({ name: 'tradingMarket-m' })">
            {{ $t("lang.viewAll") }}
          </div>
        </div>
      </div>
    </section>
    <connectMetamask ref="showMetamask"></connectMetamask>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import Banner from "@/components/mobile/banner.vue";
import request from "@/services/request";
import { BASE_V_API } from "@/config/env.js";
import { mapState } from "vuex";
import ad from "@/utils/web3Helper.js";
export default {
  data() {
    return {
      gameList: [],
      marketList: [],
      page: 1,
    };
  },
  computed: {
    ...mapState(["address"]),
  },
  created() {
    this.GameData();
    this.getMarketData();
  },
  methods: {
    handleGo() {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$router.push({ name: "homeIndex-m" });
      }
    },
    handleClick(url) {
      window.open(url);
    },
    //获取游戏列表
    GameData() {
      let parma = {
        page: this.page,
        page_size: 4,
        typa: 3,
      };
      request.searchnft(parma).then((res) => {
        if (res.code == 200) {
          this.gameList = res.data.map((item) => {
            var ApproveCount = parseInt(item.ApproveCount),
              DefuseCount = parseInt(item.DefuseCount),
              Rate;
            if (ApproveCount == 0 && DefuseCount == 0) {
              Rate = 0.5;
            } else {
              Rate = ApproveCount / (ApproveCount + DefuseCount);
            }
            return {
              src: BASE_V_API + item.Path,
              title: item.Title,
              tokenId: item.TokenID,
              Owner: item.Owner,
              Amount: ad.fromWei(item.Amount),
              ApproveCount,
              DefuseCount,
              Rate,
            };
          });
          console.log(this.gameList);
        }
      });
    },
    getMarketData() {
      let parma = {
        page: 1,
        page_size: 6,
        typa: 2,
      };
      request.searchnft(parma).then((res) => {
        if (res.code == 200) {
          this.marketList = res.data.map((v) => {
            return {
              src: BASE_V_API + v.Path,
              title: v.Title,
              tokenId: v.TokenID,
              Owner: v.Owner,
              Price: ad.fromWei(v.Price),
            };
          });
        } else {
          this.$message.error(res.mesg);
        }
      });
    },
    gotoDetail(tokenID) {
      console.log(tokenID);
      this.$router.push({ name: "nftDetail-m", query: { tokenID: tokenID } });
    },
  },
  components: {
    Header,
    Banner,
    Footer,
  },
};
</script>
<style lang='less' scoped>
.mobile-home-page {
  section {
    color: #666;
    padding: 0 15px;
    .do {
      h1 {
        font-size: 22px;
        color: #333;
        line-height: 40px;
      }
      p {
        line-height: 20px;
        font-size: 13px;
      }
      ul {
        display: flex;
        align-items: center;
        margin: 10px 0;
        li {
          border: 1px solid #12022f;
          color: #12022f;
          line-height: 32px;
          width: 120px;
          text-align: center;
          border-radius: 2px;
          &:last-child {
            background: #3c4897;
            border-color: #3c4897;
            color: #fff;
            margin-left: 15px;
            line-height: 33px;
          }
        }
      }
    }
    .text-img-container {
      background: #fafafa;
      margin: 15px 0;
      padding: 15px 0;
      h3 {
        color: #333333;
        font-size: 22px;
        line-height: 35px;
        margin-bottom: 5px;
      }
      p {
        line-height: 20px;
      }
      .btn {
        border: 1px solid #12022f;
        color: #12022f;
        line-height: 32px;
        margin: 15px 0;
        width: 120px;
        text-align: center;
        border-radius: 2px;
      }
      .img-li {
        text-align: center;
        img {
          width: 80%;
        }
      }
    }
    .game {
      h2 {
        line-height: 35px;
        font-size: 22px;
        margin-bottom: 5px;
        color: #333;
      }
      p {
        line-height: 20px;
      }
    }
    .card-container {
      width: 100%;
      overflow: auto;
    }
    .card {
      display: flex;
      align-items: center;
      margin: 15px 0;
      overflow: auto;
      li {
        width: 60%;
        min-width: 230px;
        height: 380px;
        border-radius: 4px;
        margin-right: 20px;
        &:last-child {
          margin-right: 0px;
        }
        .img-container {
          height: 295px;
          img {
            object-fit: cover;
            height: 100%;
            width: 100%;
          }
        }
        h4 {
          font-size: 15px;
          display: flex;
          justify-content: space-between;
          line-height: 28px;
        }
        p {
          display: flex;
          justify-content: space-between;
          line-height: 24px;
          & > span {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 13px;
          }
          .Owner {
            color: #666;
          }
        }
        img {
          width: 20px;
        }
        //票数 进度条
        .progress-container {
          p {
            span {
              color: #0092bf;
              font-size: 16px;
            }
            .defuse-count {
              color: #e16b2e;
            }
          }
          .progress {
            width: 100%;
            display: flex;
            align-items: center;
            background: #e16b2e;
            span {
              height: 5px;
              display: inline-block;
              background: #0092bf;
            }
          }
        }
      }
    }
    .game-btn {
      border: 1px solid #39489c;
      color: #fff;
      background: #39489c;
      line-height: 32px;
      margin: 10px 0;
      width: 120px;
      text-align: center;
      border-radius: 2px;
    }
  }
  //买卖市场样式
  .product-header {
    width: 100%;
    height: 180px;
    background: url("./../../assets/img/firstNFT.png") no-repeat center;
    background-size: cover;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      height: 90%;
      z-index: 1;
      transform: translate(-50%, -50%);
    }
    .container {
      position: relative;
      z-index: 2;
      text-align: center;
      color: #111f5d;
      h2 {
        font-size: 22px;
        line-height: 30px;
        margin-bottom: 10px;
      }
      p {
        line-height: 20px;
        font-size: 13px;
      }
    }
  }
  .send {
    margin: 15px 0;
    .card {
      li {
        height: 350px;
      }
    }
    .market-desc {
      h2 {
        line-height: 32px;
        font-size: 20px;
        margin-bottom: 5px;
        color: #333;
      }
      p {
        line-height: 20px;
        color: #666;
      }
    }
  }
}
</style>