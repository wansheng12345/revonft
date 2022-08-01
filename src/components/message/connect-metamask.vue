<!-- 安装metaMask -->
<template>
  <div class="matemask-page" v-if="show" @click.self="handleClose">
    <div class="main" :class="{ mobileMain: !pc}">
      <h1>Connect your wallet</h1>
      <i class="el-icon-close" @click="handleClose"></i>
      <p>Sign in with your Metamask to get started</p>
      <div class="btn-container">
        <div class="btn" :class="{ mobile: !pc}">
          <img src="./../../assets/img/metamask.svg" alt="" />
          <span @click="MetaMask">MetaMask</span>
        </div>
        <a
          :href="pc?'https://metamask.io/download/':'https://token.im/'"
          class="download-href"  :class="{ mobileDownload: !pc}"
          target="_blank"
          >Click here to install</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import ad from "@/utils/web3Helper.js";
import {
	isPc
} from './../../utils'
export default {
  data() {
    return {
      show: false,
    };
  },
   computed: {
    pc(){
      return isPc()
    }
  },
  methods: {
    MetaMask() {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => {
          this.handleClose();
        })
        .catch((err) => {
          this.handleClose();
        });
      // ad.init(function (flag) {
      //   console.log(flag)
      // });
    },
    handleClose() {
      this.show = false;
    },
  },
};
</script>
<style lang='less' scoped>
.matemask-page {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 200;
  background: #1f1f1f99;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .main {
    background: #fff;
    width: 90%;
    max-width: 420px;
    border-radius: 4px;
    padding: 25px 30px;
    box-shadow: 0 0 2px 0 #fff;
    position: relative;
    h1 {
      font-size: 24px;
      color: #333333;
    }
    .el-icon-close {
      font-size: 26px;
      color: #3c4897;
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 10px;
      transition: all 0.1s ease-in;
      &:hover {
        color: #293168;
        transform: rotate(90deg);
      }
    }
    p {
      font-size: 13px;
      color: #666666;
      margin: 25px 0;
    }
    .btn-container {
      display: flex;
      align-items: center;
      .btn {
        background: #3c4897;
        display: flex;
        align-items: center;
        padding: 2px 26px;
        line-height: 30px;
        color: #fff;
        font-size: 14px;
        margin-right: 20px;
        &:hover {
          background: #293168;
        }
        span {
          cursor: pointer;
        }
        img {
          width: 22px;
          margin-right: 10px;
        }
      }
      .mobile {
        padding: 2px 20px;
        font-size: 12px;
        img{
          width:16px;
        }
      }
      .download-href {
        font-size: 14px;
        color: #3c4897;
        line-height: 18px;
        text-decoration: underline;
        cursor: pointer;
        &:hover {
          color: #293168;
        }
      }
      .mobileDownload{
        font-size:12px;
      }
    }
  }
  .mobileMain{
    padding: 25px;
  }
}
</style>