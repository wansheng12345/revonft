
<template>
  <!-- 调用matemask失败 组件 -->
  <div class="success-page" v-show="show" @click.self="handleClose">
    <ul>
      <li class="head">
        <span>{{ title }}</span>
        <img src="./../../../assets/img/close.svg" @click="handleClose" />
      </li>
      <li>
        <img
          :src="require('@/assets/img/icon-sm.svg')"
          class="img"
          v-if="type == 1"
        />
        <img
          :src="require('@/assets/img/icon-k.svg')"
          class="img"
          v-if="type == 2"
        />
      </li>
      <li>
        {{ $t("lang.votingSuccessLater") }}
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
      title: "OPTING COMPLETE",
      hash: "",
      type: "",
    };
  },
  methods: {
    open(title, hash, type) {
      console.log(title, hash);
      this.title = title;
      this.type = type;
      this.hash = hash;
      this.show = true;
    },
    handleEtherscan() {
      if (this.hash) {
        // this.$router.push("mine");
        window.open("https://etherscan.io/tx/" + this.hash);
        this.handleClose()
      }
    },
    handleClose() {
      location.reload();
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
      line-height: 25px;
      font-size: 14px;
      .nft-btn {
        text-align: center;
        background: #ffdda9;
        border: #ffdda9 1px solid;
        color: #12022f;
        font-size: 13px;
        padding: 2px 20px;
        border-radius: 20px;
        margin-top: 5px;
      }
      img {
        width: 60px;
      }
      &.head {
        justify-content:center;
        height: 25px;
        position: relative;
        span {
          color: #666;
          font-size: 15px;
        }
        img {
          width: 28px;
          position:absolute;
          right:0px;
          top:-10px;
        }
      }
    }
  }
}
</style>