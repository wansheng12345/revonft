<!-- 底部 -->
<template>
  <div class="footer">
    <ul>
      <li class="row1">
        <div>
          <img src="./../assets/img/pole labs.svg" alt="" />
          <span>Designed by Pole Labs</span>
        </div>
        <span>Community & Partnerships</span>
      </li>
      <li class="row2">
        <div>
          <img :src="require('@/assets/img/telegram.svg')" @click="handleClick('https://t.me/revolutionNFT')" />
          <img :src="require('@/assets/img/social02.svg')" @click="handleClick('https://twitter.com/NFTRevo')" />
          <img :src="require('@/assets/img/reddit.svg')" @click="handleClick('https://www.reddit.com/r/RevoNFT/')" />
          <img :src="require('@/assets/img/youtube.svg')" @click="handleClick('https://www.youtube.com/channel/UCAVilc5UTUNkVAF3gfeqVIw')" />
          <img :src="require('@/assets/img/social04.svg')" @click="handleClick('https://revonft.gitbook.io/')" />
        </div>
        <img src="./../assets/img/computecoin.svg" alt="" />
      </li>
      <li class="Copyright">Copyright 2021 Revolution,All rights Reserved</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleClick(src){
        if(src){
          window.open(src);
        }
    }
  },
};
</script>
<style lang='less' scoped>
.footer {
  background: #0c1a4b;
  color: rgb(255, 255, 255);
  font-size:14px;
  padding: 10px 0;
  ul {
    li {
      margin:5px auto 0;
      width: 1000px;
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        display: flex;
        align-items: center;
      }
      &.row1 {
        img {
          width: 110px;
          margin-right: 15px;
        }
        & > span {
          color: #fff;
          // font-weight:600;
        }
      }
      &.row2 {
        & > div {
          img {
            width: 24px;
            height: 24px;
            margin-right: 24px;
            cursor: pointer;
          }
        }
      }
      &.Copyright {
        justify-content: center;
        margin-top: 15px;
        width: 100%;
        line-height: 40px;
        border-top: 1px solid #273a79;
      }
    }
  }
}
</style>