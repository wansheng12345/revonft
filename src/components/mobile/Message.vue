<!-- 移动端信息弹窗 -->
<template>
  <div>
    <div class="mobile-message-page" v-if="show">
      <div class="message-container">
        <h4>{{ msg }}</h4>
        <p class="close" @click="handleClose">Confirm</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "",
      show:false,
    };
  },
  methods: {
      handleClose(){
          this.show=false
      },
  },
};
</script>
<style lang='less' scoped>
.mobile-message-page {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 99999;
  background: #00000066;
  .message-container {
    width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 4px;
    padding: 15px 20px 10px;
    text-align: center;
    h4 {
      font-size: 15px;
      color: #333333;
      border-bottom: 1px solid #e7e7e7;
      padding-bottom: 10px;
      line-height:22px;
    }
    .close {
      font-size: 14px;
      line-height: 35px;
      color: #666;
      &:active {
        background: #eee;
      }
    }
  }
}
</style>