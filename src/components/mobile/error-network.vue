<!-- 网络错误提示 -->
<template>
  <div class="error-network-page">
    <div class="main">
      <i class="el-icon-loading"></i>
      <div class="loading-text">WRONG NETWORK</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang='less' scoped>
.error-network-page {
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
    background: #ffffffaa;
    padding: 10px;
    width: 90%;
    margin: 0 auto;
    font-size: 20px;
    text-align: center;
    color: #333;
    i {
      font-size: 32px;
    }
  }
}
</style>