
<template>
  <div>
    <wc-swiper
      :duration="300"
      :pagination="false"
      class="swiper"
      :autoplay="true"
      :interval="5000"
      @transitionend="transitionend"
    >
      <wc-slide v-for="(item, key) in banner" :key="key" @click="handleClick(key)">
        <div class="box">
          <img :src="item.bannerPath" alt="" />
          <div class="text" v-show="key == 1">
            <div>
              <h3>Community & Partnerships</h3>
              <p>
                is a self-evolving internet computer designed to power the
                metaverse by serving as infrastructure for metaverse
                applications.
              </p>
              <p>
                CCN provides rich, low-cost, low-latency, and trustworthy
                computing and storage power for Web.3 pioneers: VR/AR
                developers, AI engineers & teams, metaverse end users, NFT
                collectors, DeFi platforms, and the list goes on.
              </p>
            </div>
          </div>
        </div>
      </wc-slide>
    </wc-swiper>
  </div>
</template>

<script>
import request from "./../../services/request";
export default {
  data: function () {
    return {
      selectIndex: 0,
      banner: [
        {
          bannerPath: require("@/assets/img/mobile/banner1.png"),
          bannerName: 1,
        },
        {
          bannerPath: require("@/assets/img/mobile/banner2.png"),
          bannerName: 2,
        },
        {
          bannerPath: require("@/assets/img/mobile/banner3.png"),
          bannerName:3,
        },
      ],
      bannerHeight: "",
      imgActiveIndex: 0,
      screenWidth: document.body.clientWidth, // 屏幕宽
    };
  },
  created() {},
  mounted() {
    this.setSize();
  },
  watch: {
    lang() {
      //this.getTime();
    },
  },
  computed: {
    lang() {
      return this.$i18n.locale;
    },
  },
  methods: {
    handleClick(i) {
      if(i==0){
        window.open("https://forms.gle/ULd1LZQjnQeUXGCZ6");
      }
      if (i == 1) {
        window.open("https://computecoin.network");
      }
    },
    transitionend(slide) {
      this.selectIndex = slide;
    },
    setSize() {
      console.log("screenWidth：" + this.screenWidth);
      this.bannerHeight = (this.screenWidth / 1920) * 754;
      // if (this.bannerHeight > 740) this.bannerHeight = 740
      // if (this.bannerHeight < 360) this.bannerHeight = 360
    },
  },
};
</script>

<style lang="less" scoped>
.bannerImg {
  width: 100%;
  height: 100%;
}
.swiper {
  height: 184px;
  .box {
    width: 100%;
    height: 100%;
    position: relative;
    .text {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 90%;
      color: #eee;
      z-index: 1;
      display:flex;
      align-items:center;
      line-height:18px;
      p{
        margin-top:8px;
      }
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}

// 大于800px
@media only screen and (min-width: 800px) {
  /deep/ .el-carousel__container {
    height: 958px;
  }

  img {
    width: 100%;
    height: auto;
  }
}

// 小于800px
@media only screen and (max-width: 800px) {
  ._subnavcontainer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 110px;
    width: 100%;
    background-color: rgb(249, 249, 250);
    overflow-x: scroll;

    div {
    }
  }
}
</style>
