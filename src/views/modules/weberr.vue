<template>
  <div class="web_error" v-if="show">
    <div class="loading">
      <div class="icon-loading"></div>
      <div class="loading-text">{{ $t("lang.confirmation") }}</div>
      <div class="loading-desc">{{ desc }}</div>
      <div class="close" v-if="closeable" @click="handleClose"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "weberr",
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    closeable: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      desc: "",
    };
  },
  components: {},
  mounted() {},
  methods: {
    handleClose() {
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.web_error {
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
      font-size: 42px;
      font-weight: 600;
      padding: 10px 0 20px;
    }
    .loading-desc {
      font-size: 20px;
      letter-spacing: 0.3em;
    }
    .close {
      width: 48px;
      height: 48px;
      background: url("~@/assets/img/close.svg") no-repeat center center/contain;
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
</style>
