
<template>
  <div class="banner">
    <el-carousel
      :autoplay="true"
      :interval="5000"
      :initial-index="Index"
      arrow="never"
      ref="carousel"
      @change="onCarouselChange"
    >
      <el-carousel-item v-for="(v, i) of banner" :key="i">
        <div class="box" v-if="i == 0">
          <h2>Recruit global partners</h2>
          <div class="btn" @click="handleApply">Apply</div>
        </div>
        <img class="imgs" :src="v.src" alt="" @click="handleClick(i)" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import "@/assets/fonts/fonts.css";
import request from "../services/request";
export default {
  name: "SubNavGuide",
  data: function () {
    return {
      banner: [
        {
          src: require("./../assets/img/bg1.png"),
        },
        {
          src: require("./../assets/img/bg2.png"),
        },
        {
          src: require("./../assets/img/bg3.png"),
        },
      ],
      Index: 0,
      bannerHeight: "",
      screenWidth: document.body.clientWidth, // 屏幕宽
    };
  },
  mounted() {
    this.setSize();
  },
  methods: {
    handleApply() {
      window.open("https://forms.gle/ULd1LZQjnQeUXGCZ6");
    },
    handleClick(i) {
      if (i == 1) {
        window.open("https://computecoin.network");
      }
    },
    onCarouselChange() {},
    setSize() {
      this.bannerHeight = (this.screenWidth / 1920) * 754;
      if (this.bannerHeight > 740) this.bannerHeight = 740;
      if (this.bannerHeight < 360) this.bannerHeight = 360;
    },
  },
};
</script>

<style lang="less" scoped>
.imgs {
  width: 100vw;
  object-fit: cover;
  height: 100%;
}
.box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -20%);
  z-index: 10;
  text-align: center;
  color: #fff;
  h2 {
    font-size: 30px;
    line-height: 45px;
    font-weight: 500;
  }
  .btn {
    width: 120px;
    line-height: 40px;
    border-radius: 4px;
    background: #3c4897;
    margin: 15px auto 0;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background: #5862a3;
    }
  }
}
</style>
<style>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__container{
  min-height:460px;
}
</style>
