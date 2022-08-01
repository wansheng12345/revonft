<template>
  <div class="mobile-container">
    <Header></Header>
    <!-- <div class="notice-container">
      Have you ever finally just gave in to the temptation and read your
      horoscope in the newspaper on Sunday morning? Sure, we all have. For most
      of us, it’s a curiosity, an amusement to see what they say our day will be
      like based on the sign of the zodiac that we were b
    </div> -->
    <div class="list-container">
      <div class="tools">
        <div class="text">NEW</div>
        <div class="timer">
          <span class="num">{{h}}</span>
          <span class="split">:</span>
          <span class="num">{{m}}</span>
          <span class="split">:</span>
          <span class="num">{{s}}</span>
        </div>
      </div>
      <div
        class="list-wrapper"
        v-for="(item, index) in pendingList"
        :key="'item_' + index"
        @click="open(index)"
      >
        <div class="nft-box">
          <div class="box-img">
            <img :src="require('@/assets/img/box-wrap.svg')" class="img-wrap" />
            <div class="num">{{ item.Price }}</div>
          </div>
          <div class="box-info">
            <div class="info-title">Crypto Trunks</div>
            <div class="info-value">CryptoTrunk #{{ item.TokenID }}</div>
          </div>
        </div>
      </div>
    </div>

    <Footer></Footer>
    <!-- 失败弹窗 -->
    <Fail ref="failed"></Fail>
    <!-- 成功页面 跳转到以太坊浏览器 -->
    <mintSuccess ref="mintSuccess"></mintSuccess>
    <nftpool-drawer
      ref="NftpoolDrawer"
      @fail="NFTfail"
      @success="NFTsuccess"
    ></nftpool-drawer>
  </div>
</template>
<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import NftpoolDrawer from "./modules/nftpoolDrawer.vue";
import Fail from "./modules/Failed.vue";
import mintSuccess from "./modules/mintSuccess.vue";
import request from "@/services/request";
import { BASE_V_API } from "@/config/env";
import moment from "moment";
export default {
  name: "homeIndex-m",
  data() {
    return {
      activeName: "1",
      pendingList: [],
      h: "0",
      m: "0",
      s: "0",
    };
  },
  components: {
    Header,
    Footer,
    NftpoolDrawer,
    Fail,
    mintSuccess,
  },
  created() {
    this.getNtfPendingList();
    this.getTime();
    setInterval(()=>{
      this.getTime();
    },1000)
  },
  methods: {
    getTime() {
      this.h = moment().format('HH');
      this.m= moment().format('mm');
      this.s = moment().format('ss');
    },
    moment,
    NFTfail() {
      this.$refs.failed.openDialog();
    },
    NFTsuccess(hash) {
      this.$refs.mintSuccess.open(hash);
    },
    open(index) {
      let selectPendingItem = this.pendingList[index];
      localStorage.setItem(
        "selectPendingImte",
        JSON.stringify(selectPendingItem)
      );
      if (this.checkAccountToken() == true) {
        this.$refs.NftpoolDrawer.openDialog();
      } else {
        alert(this.$t("lang.MateMask"));
      }
    },
    //获取nft池子
    getNtfPendingList() {
      var para = {
        page: 1,
        page_size: 1000,
      };
      var that = this;
      request.getNftPending(para).then(
        (response) => {
          if (response.code == "200") {
            that.pendingList = response.data;
            that.pendingList.forEach((item, index) => {
              that.pendingList[index].Path =
                BASE_V_API + that.pendingList[index].Path;
            });
            console.log(response);
          } else {
            that.$message.error(response.mesg);
          }
        },
        (err) => {
          console.log(err, "err");
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.notice-container {
  background: #4173ea;
  color: #fff;
  padding: 20px;
}
.list-container {
  .tools {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0 15px;
    .text {
      font-size: 14px;
      margin-right: 10px;
    }
    .timer {
      display: flex;
      justify-content: center;
      align-items: center;
      .num {
        background: #000;
        border-radius: 4px;
        width: 34px;
        height: 34px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 16px;
      }
      .split {
        font-size: 16px;
        margin:0 2px;
      }
    }
  }
  .list-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    .nft-box {
      margin: 0 0 30px;
      width: 65%;
      padding: 0 10px;
      .box-img {
        width: 100%;
        object-fit: contain;
        position: relative;
        .img-wrap {
          width: 100%;
          object-fit: contain;
        }
        .num {
          color: #fff;
          font-size: 16px;
          position: absolute;
          left: 25%;
          top: 5%;
          font-weight: 600;
        }
      }
      .box-info {
        padding: 5px 3px;
        .info-title {
          color: #594d6d;
          font-size: 10px;
        }
        .info-value {
          color: #12022f;
        }
      }
    }
  }
}

.btn {
  display: inline-block;
  border: #ccc 1px solid;
  font-size: 16px;
  line-height: 26px;
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
}
</style>
