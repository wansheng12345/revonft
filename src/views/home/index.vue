<!--  -->
<template>
  <div>
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="0"></Header>
    </div>
    <Banner />
    <section>
      <div class="main">
        <div class="do">
          <h1>{{ $t("lang.WhatweDo") }}</h1>
          <p>
            {{ $t("lang.realized") }}
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
      </div>
      <div class="text-img-container">
        <ul class="main">
          <li>
            <h3>{{ $t("lang.genesis") }}</h3>
            <p>
              {{ $t("lang.genesisdesc") }}
            </p>
            <div class="btn" @click="handleCreate">Create</div>
          </li>
          <li>
            <img src="@/assets/img/Published.png" alt="" />
          </li>
        </ul>
      </div>
      <!-- 游戏 Game -->
      <div class="game">
        <h2>{{ $t("lang.gameNavigation") }}</h2>
        <p>
          The game form is introduced to make NFT go through a more sufficient
          game, so as to realize the value discovery of NFT.
        </p>
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
                ><img src="@/assets/img/icon.png" alt="" />{{ v.Amount }}</span
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
        <div class="game-btn">
          <div @click="refreshGameData" v-if="gameList.length > 0">
            <img src="@/assets/img/refresh.svg" alt="" />
            <span> {{ $t("lang.refresh") }}</span>
          </div>
          <div class="all" @click="$router.push({ name: 'pickMarket' })">
            {{ $t("lang.viewAll") }}
          </div>
        </div>
      </div>
      <!-- 买卖市场 product -->
      <div class="product-header">
        <img src="./../../assets/img/animate.png" alt="" />
        <div class="container">
          <h2>{{ $t("lang.firstNFT") }}</h2>
          <p>- {{ $t("lang.cooperation") }}</p>
        </div>
      </div>
      <div class="main market">
        <ul class="card">
          <li class="market-desc">
            <h2>{{ $t("lang.Popular") }}</h2>
            <p>
              Compared with the traditional single auction model, cooperative
              game and non cooperative game models are introduced to make NFT
              have more sufficient game and make the price closer to the value
              of NFT itself, so as to realize the value discovery of NFT.
            </p>
          </li>
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
        <div class="market-btn">
          <div @click="$router.push({ name: 'tradingMarket' })">
            {{ $t("lang.viewAll") }}
          </div>
        </div>
      </div>
    </section>
    <connectMetamask ref="showMetamask"></connectMetamask>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Banner from "@/components/banner-img.vue";
import Footer from "../../components/footer.vue";
import request from "@/services/request";
import { BASE_V_API } from "@/config/env.js";
import ad from "@/utils/web3Helper.js";
import { mapState } from "vuex";
export default {
  components: {
    Header,
    Banner,
    Footer,
  },
  data() {
    return {
      gameList: [],
      marketList: [],
      page: 1,
      lang: "",
    };
  },
  computed: {
    ...mapState(["address"]),
  },
  created() {
    this.lang = sessionStorage.getItem("Language");
    this.GameData();
    this.getMarketData();
  },
  methods: {
    handleCreate() {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$router.push({ name: "homeIndex" });
      }
    },
    handleClick(url) {
      window.open(url);
    },
    refreshGameData() {
      this.page += 1;
      this.GameData();
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
          if (this.page > 1 && res.data.length == 0) {
            this.page = 1;
            this.GameData();
            return;
          }
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
        } else {
          this.page = 1;
          this.GameData();
        }
      });
    },
    //去详情页
    gotoDetail(tokenID) {
      this.$router.push({ name: "nftDetail", query: { tokenID: tokenID } });
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
  },
};
</script>
<style lang='less' scoped>
section {
  color: #333;
  margin-bottom: 50px;
  .main {
    width: 1200px;
    margin: 0 auto;
    .do {
      padding: 20px 10%;
      text-align: center;
      font-size: 16px;
      h1 {
        font-size: 48px;
        color: #333333;
        line-height: 80px;
      }
      p {
        color: #666666;
        font-size: 15px;
        line-height: 22px;
        width: 80%;
        margin: 0 auto;
      }
      ul {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 15px auto;
        li {
          border: 1px solid #12022f;
          color: #12022f;
          line-height: 36px;
          width: 140px;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            background: #f8f8f8;
          }
          &:last-child {
            background: #3c4897;
            border-color: #3c4897;
            color: #fff;
            margin-left: 5%;
            line-height: 36px;
            &:hover {
              background: #2939a3;
            }
          }
        }
      }
    }
  }
  .text-img-container {
    background: #fafafa;
    .main {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 15px 5%;
      height: 570px;
      ul {
        width: 60%;
      }
      li {
        h3 {
          color: #333333;
          font-size: 38px;
          line-height: 50px;
          margin-bottom: 10px;
        }
        p {
          text-indent: 2em;
          width: 70%;
          color: #666666;
          line-height: 25px;
          font-size: 16px;
        }
        .btn {
          border: 1px solid #12022f;
          color: #12022f;
          line-height: 34px;
          margin-top: 15px;
          width: 110px;
          text-align: center;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            background: #eee;
          }
        }
      }
    }
  }
  //  游戏卡片样式
  .game {
    width: 1000px;
    margin: 0 auto;
    padding: 2% 0;
    h2 {
      text-align: center;
      line-height: 60px;
      font-size: 38px;
      color: #333;
    }
    & > p {
      width: 40%;
      min-width: 300px;
      margin: 0 auto;
      text-indent: 2em;
      text-align: center;
      line-height: 24px;
      color: #666;
      font-size: 16px;
    }
    .game-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 12px;
        line-height: 34px;
        border: 1px solid #594d6d;
        color: #594d6d;
        border-radius: 2px;
        font-size: 15px;
        cursor: pointer;
        img {
          width: 15px;
          margin-right: 2px;
        }
        &:hover {
          background: #f8f8f8;
        }
        &.all {
          background: #39489c;
          color: #fff;
          border-color: #39489c;
          line-height: 34px;
          margin-left: 20px;
          &:hover {
            background: #2939a3;
          }
        }
      }
    }
  }
  //买卖市场样式
  .product-header {
    width: 100%;
    height: 300px;
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
        font-size: 36px;
        line-height: 50px;
        margin-bottom: 10px;
      }
      p {
        line-height: 24px;
        font-size: 16px;
        width: 60%;
        margin: 0 auto;
      }
    }
  }
  .card {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: 15px 0;
    li {
      width: 23.5%;
      height: 410px;
      border-radius: 2px;
      overflow: hidden;
      margin-right: 1.5%;
      cursor: pointer;
      .img-container {
        height: 320px;
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
        & > span:first-child {
          font-size: 12px;
        }
      }
      p {
        display: flex;
        justify-content: space-between;
        line-height: 24px;
        & > span {
          display: flex;
          align-items: center;
          font-weight: 600;
          font-size: 14px;
        }
        .Owner {
          color: #666;
          font-weight: 500;
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
  .market {
    .card {
      .market-desc {
        width: 47%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 15px;
        cursor: initial;
        h2 {
          font-size: 30px;
          padding-right: 5%;
          margin-bottom: 10px;
        }
        p {
          color: #666;
          font-size: 16px;
          line-height: 28px;
        }
      }
      li {
        height: 380px;
        margin-bottom: 10px;
      }
    }
    .market-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        align-items: center;
        padding: 0 25px;
        line-height: 34px;
        border: 1px solid #594d6d;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        font-size: 15px;
        background: #39489c;
        &:hover {
          background: #2939a3;
        }
      }
    }
    .market-desc {
      margin-right: 3%;
    }
  }
}
</style>