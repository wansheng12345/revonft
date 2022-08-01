<!-- 网络错误提示 -->
<template>
  <div class="error-network-page">
    <div class="main">
      <div class="circle-container">
        <img src="./../../assets/img/logo-circle.svg" alt="" />
      </div>
      <h1>Wrong network</h1>
      <p>
        Looks like you connected to unsupported network.Please change network
        correctly.
      </p>
      <div class="btn" @click="handleChange">Switch network</div>
    </div>
  </div>
</template>

<script>
import ad from "@/utils/web3Helper";
export default {
  data() {
    return {
      handleChange() {
        ad.addNetwork(() => {
          //切换网络，重新获取签名
          // setTimeout(() => {
          //   this.getSign();
          // }, 1000);
        });
      },
    };
  },
  methods: {},
};
</script>
<style lang='less' scoped>
.error-network-page {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 2000;
  background: #1f1f1f99;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .main {
    background: #fff;
    width: 520px;
    border-radius: 4px;
    padding: 25px 30px;
    box-shadow: 0 0 2px 0 #fff;
    position: relative;
    text-align: center;
    .circle-container {
      border-radius: 50%;
      width: 140px;
      height: 140px;
      margin: 10px auto;
      border: 6px solid #e6e6e6;
      border-top: 6px solid #3d66ed;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      animation: loading-360 1s infinite linear;
      img {
        width: 60px;
        height: 60px;
        animation: loading--rever-360 1s infinite linear;
      }
    }
    h1 {
      font-size: 24px;
      color: #333333;
    }
    p {
      font-size: 14px;
      line-height: 22px;
      color: #666666;
      margin: 25px 0;
    }
    .btn {
      cursor: pointer;
      background: #3c4897;
      line-height: 36px;
      color: #fff;
      border-radius: 2px;
      width: 160px;
      font-size: 14px;
      margin: 0 auto;
      &:hover {
        background: #293168;
      }
    }
  }
  @keyframes loading-360 {
    0% {
      transform: rotate(0deg); /*动画起始的时候旋转了0度*/
    }
    100% {
      transform: rotate(360deg); /*动画结束的时候旋转了360度*/
    }
  }
  @keyframes loading--rever-360 {
    0% {
      transform: rotate(360deg); /*动画起始的时候旋转了0度*/
    }
    100% {
      transform: rotate(0deg); /*动画结束的时候旋转了360度*/
    }
  }
}
</style>