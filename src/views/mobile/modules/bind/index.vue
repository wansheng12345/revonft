<template>
  <div class="bind-page">
    <el-dialog
      :visible="visible"
      width="90%"
      :title="null"
      :center="true"
      :show-close="false"
      @close="closeDialog"
    >
      <section>
        <div class="top-detail">
          <div class="left-img">
            <img :src="base + item.Path" />
          </div>
          <div class="right-info">
            <h4>CryptoTrunk # {{ item.TokenID }}</h4>
            <div>
              <span>NFT Value</span>
              <span>{{ price }} ETH </span>
            </div>
          </div>
        </div>
        <h2>
          <span>Need token</span>
          <span>{{ NeedRtv }} RTV</span>
        </h2>
        <p v-if="NeedRtv < 0">Not enough token to unbind</p>
        <div class="button" @click="hanldeClick">Unbunding</div>
        <ul>
          <li class="attention">Attention</li>
          <li>
            Once the unbinding operation is confirmed,the NFT will be destroyed
            and you will get 1 eth
          </li>
        </ul>
      </section>
    </el-dialog>
    <el-dialog
      :visible="visible2"
      width="90%"
      :title="null"
      :center="true"
      :show-close="false"
    >
      <div class="confirm">
        <h2>ARE YOU SURE?</h2>
        <ul>
          <li class="Attention">Attention</li>
          <li>
            Once the unbinding operation is confirmed,the NFT will be destroyed
            and you will get 1 eth
          </li>
        </ul>
        <div class="button">
          <span @click="visible2 = false">Let me think</span>
          <span @click="handleUnbind">Unbind</span>
        </div>
      </div>
    </el-dialog>
    <!--  -->
    <el-dialog
      :visible="visible3"
      width="95%"
      :title="null"
      :center="true"
      :show-close="false"
      @close="closeDialog2"
    >
      <div class="confirm">
        <ul>
          <li class="Attention">Unbunding operation completed</li>
          <li>Nft has been destroyed and you will receive the bound ETH</li>
        </ul>
        <div class="success_btn" @click="handleView">
          view transaction on etherscan
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/services/request";
import { BASE_V_API } from "@/config/env";
import ad from "@/utils/web3Helper";
import rtv from "@/utils/rtv";
export default {
  data() {
    return {
      visible: false, //控制弹窗显示
      visible2: false,
      visible3: false,
      desc: "",
      price: 1,
      NeedRtv: "",
      item: {},
      base: "",
      hash: "",
      loading: "",
      address: "",
    };
  },
  created() {
    this.address =this.$store.getters.address;
    this.base = BASE_V_API;
  },
  methods: {
    showBind(item) {
      rtv.BalanceOf(this.address, (res) => {
        let account = ad.fromWei(res);
        console.log(account)
        if (account < 1) {
          this.$message.warning("Not enough rtv ！");
        } else {
          rtv.approve(ad.toWei(account), (result) => {
            this.item = item;
            request.getDestroy().then((res) => {
              if (res.code == 200) {
                this.NeedRtv = res.data.rate * this.price;
                this.visible = true;
              }
            });
          });
        }
      });
    },
    handleView() {
      window.open("https://etherscan.io/tx/" + this.hash);
      this.visible3 = false;
    },
    handleUnbind() {
      this.visible2 = false;
      var that = this;
      this.showLoading();
      that.visible3 = true;
      ad.unBind(
        this.item.TokenID,
        function (hash) {
          that.hash = hash;
          that.handleClose();
        },
        function (err) {
          console.log(err);
        }
      );
    },
    handleClose() {
      this.loading.close();
    },
    hanldeClick() {
      if (this.NeedRtv < 0) return;
      this.visible = false;
      this.visible2 = true;
    },
    closeDialog2() {
      this.visible3 = false;
      location.reload();
    },
    closeDialog() {
      //关闭弹窗
      this.visible = false;
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
.bind-page {
  /deep/ .el-dialog {
    border-radius: 15px;
  }
  section {
    & > h2 {
      display: flex;
      margin: 10px 0;
      color: #12022f;
      justify-content: space-between;
    }
    & > p {
      background: #ffe0db;
      padding: 0 10px;
      line-height: 25px;
      font-size: 12px;
      width: 90%;
      color: #12022f;
      border-radius: 4px;
    }
    .button {
      margin: 20px auto;
      width: 60%;
      line-height: 35px;
      background: #ffdda9;
      text-align: center;
      border-radius: 18px;
      cursor: pointer;
      color: #000;
      font-size: 15px;
    }
    & > ul {
      margin: 0 auto;
      width: 95%;
      text-align: center;
      line-height: 25px;
      color: #ce4f73;
      .attention {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  .top-detail {
    display: flex;
    .left-img {
      width: 44%;
      margin-right: 4%;
      text-align: center;
      img {
        width: 95%;
        border-radius: 10px;
      }
    }
    .right-info {
      width: 48%;
      & > div {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
      }
    }
  }
  .confirm {
    h2 {
      font-size: 20px;
      color: #12022f;
      text-align: center;
    }
    ul {
      width: 95%;
      margin: 10px auto;
      text-align: center;
      line-height: 25px;
      color: #594d6d;
      .Attention {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 10px;
      }
    }
    .button {
      display: flex;
      justify-content: space-around;
      span {
        display: inline-block;
        width: 45%;
        text-align: center;
        background: #ffdda9;
        color: #333;
        font-size: 15px;
        line-height: 32px;
        border-radius: 16px;
      }
    }
    .success_btn {
      display: flex;
      justify-content: center;
      width: 80%;
      margin: 20px auto 5px;
      background: #ffdda9;
      color: #000;
      line-height: 40px;
      border-radius: 20px;
      cursor: pointer;
    }
  }
  .dialogs {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.8);
    .loading {
      color: #fff;
      text-align: center;
      position: relative;
      .icon-loading {
        display: block;
        width: 160px;
        height: 160px;
        margin: 0 auto 30px;
        border: 8px solid #000;
        border-top-color: #0aa0ff;
        border-radius: 50%;
        -webkit-animation: 1s loader-05 linear infinite;
        animation: 1s loader-05 linear infinite;
        position: relative;
      }
      .loading-text {
        font-size: 35px;
        font-weight: 600;
        padding: 10px 0 20px;
      }
      .loading-desc {
        font-size: 16px;
        line-height: 30px;
      }
      .close {
        width: 48px;
        height: 48px;
        background: url("~@/assets/img/close.svg") no-repeat center
          center/contain;
        position: absolute;
        right: -160px;
        top: -100px;
        cursor: pointer;
        transition: all 0.5s;
        &:hover {
          transform: rotate(180deg);
        }
      }
    }
  }

  @-webkit-keyframes loader-05 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes loader-05 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
}
</style>