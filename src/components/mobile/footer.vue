<template>
  <footer class="footer">
    <div class="hd">
      <div class="logo-wrap">
        <img class="img" :src="require('@/assets/img/ft_logo.png')" />
        <div class="designed">Designed by Pole Labs</div>
      </div>
      <div class="social-contact">
        <img
          :src="require('@/assets/img/telegram.svg')"
          @click="handleClick('https://t.me/revolutionNFT')"
        />
        <img
          :src="require('@/assets/img/social02.svg')"
          @click="handleClick('https://twitter.com/NFTRevo')"
        />
        <img
          :src="require('@/assets/img/reddit.svg')"
          @click="handleClick('https://www.reddit.com/r/RevoNFT/')"
        />
        <img
          :src="require('@/assets/img/youtube.svg')"
          @click="
            handleClick(
              'https://www.youtube.com/channel/UCAVilc5UTUNkVAF3gfeqVIw'
            )
          "
        />
        <img
          :src="require('@/assets/img/social04.svg')"
          @click="handleClick('https://revonft.gitbook.io/')"
        />
      </div>
    </div>
    <!-- <div class="bd">
            <div class="footer-links">
                <dl class="link">
                    <dt>Products</dt>
                    <dd><a>UI Kits</a></dd>
                    <dd><a>Wireframe Kits</a></dd>
                    <dd><a>Icon Sets</a></dd>
                    <dd><a>Themes & Templates</a></dd>
                </dl>
                <dl class="link">
                    <dt>Company</dt>
                    <dd><a>Support</a></dd>
                    <dd><a>Open a Shop</a></dd>
                    <dd><a>Licensing & Terms</a></dd>
                    <dd><a>Technology</a></dd>
                </dl>
                <dl class="link">
                    <dt>Support</dt>
                    <dd><a>Getting started</a></dd>
                    <dd><a>Help center</a></dd>
                    <dd><a>Suggest a feature</a></dd>
                    <dd><a>Report a bug</a></dd>
                </dl>
            </div>
        </div> -->
    <div class="Community">
      <p>Community & Partnerships</p>
      <div>
        <img src="@/assets/img/computecoin.png" alt="" />
      </div>
    </div>
    <div class="copyright">
      &copy; Copyright 2021 Revolution,All rights Reserved
    </div>
  </footer>
</template>
<script>
export default {
  name: "mobileFooter",
  props: {},
  data() {
    return {};
  },
  components: {},
  created() {},
  mounted() {},
  methods: {
    handleClick(url) {
      if(url){
          window.open(url);
        }
    },
  },
};
</script>
<style lang="less" scoped>
.footer {
  background: #0c1a4b;
  color: rgba(255, 255, 255, 0.5);
  padding: 25px 0 0;
  .hd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    .logo-wrap {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      .designed {
        color: #ccc;
        font-size:13px;
      }
      img {
        width: 105px;
        margin-bottom: 5px;
      }
    }
    .social-contact {
      img {
        width: 21px;
        height: 21px;
        margin-right:16px;
      }
    }
  }
  .bd {
    padding: 0 25px;
    .footer-links {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 20px;
      padding: 20px 0 15px;
      font-size: 10px;
      .link {
        dt {
          color: #fff;
          margin: 3px 0;
        }
        dd {
          margin: 3px 0;
        }
      }
    }
  }
  .copyright {
    text-align: center;
    padding: 10px 0 20px;
  }
  .Community {
    border-top: #333e66 1px solid;
    text-align: center;
    color: #fff;
    p {
      margin: 15px 0;
    }
  }
}
</style>