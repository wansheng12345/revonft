
<template>
  <!-- 调用matemask失败 组件 -->
  <div class="success-page" v-show="show" @click.self="handleClose">
    <ul>
      <li class="head">
        <span></span>
        <span>{{ $t('lang.minting') }}</span>
        <img src="./../../../assets/img/close.svg" @click="handleClose" />
      </li>
      <li>
        {{ $t("lang.successTrasaction"), }}
      </li>
      <li>
        <div class="nft-btn" @click="handleEtherscan">
          {{ $t("lang.etherscan") }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      type: "",
    };
  },
  methods: {
    open( hash) {
      console.log( hash);
      this.hash = hash;
      this.show = true;
    },
    handleEtherscan() {
      if (this.hash) {
        // this.$router.push("mine");
        window.open("https://etherscan.io/tx/" + this.hash);
        location.reload();
      }
    },
    handleClose() {
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.success-page {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 3601;
  width: 100%;
  height: 100%;
  background: #33333399;
  ul {
    width:85%;
    background: #fff;
    padding: 20px 10px 25px;
    border-radius: 10px;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height:40px;
      font-size: 14px;
      .nft-btn {
        text-align: center;
        background: #ffdda9;
        border: #ffdda9 1px solid;
        color: #12022f;
        font-size: 13px;
        padding:5px 30px;
        border-radius: 20px;
        margin-top: 5px;
      }
      img {
        width: 60px;
      }
      &.head {
        justify-content: space-between;
        height: 25px;
        span {
          padding-left: 7%;
          color: #666;
          font-size: 15px;
        }
        img {
          width: 28px;
        }
      }
    }
  }
}
</style>