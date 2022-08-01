
<template>
  <!-- 调用matemask失败 组件 -->
  <div class="failed-page" v-show="show" @click.self="handleClose">
    <ul>
      <li class="head">
        <img src="./../../../assets/img/close.svg" @click="handleClose" />
      </li>
      <li>
        <img src="./../../../assets/img/circle_warning.png" alt="" />
      </li>
      <li>
        <div class="title">{{ $t("lang.failed") }}</div>
      </li>
      <li>
        <div class="desc">{{ $t("lang.failedDesc") }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    openDialog() {
      this.show = true;
    },
    handleClose(){
        this.show = false;
    }
  },
};
</script>

<style lang="less" scoped>
.failed-page {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index:3600;
  width: 100%;
  height: 100%;
  background: #33333399;
  ul {
    width:70%;
    background: #fff;
    padding: 10px 10px 20px;
    border-radius:10px;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width:35px;
      }
      .title{
          font-size:18px;
          color:#12022f;
          font-weight: 600;
          line-height:40px;
      }
      .desc{
        font-size:14px;
      }
      &.head {
        justify-content: flex-end;
        height:25px;
        img {
          width: 28px;
        }
      }
    }
  }
}
</style>