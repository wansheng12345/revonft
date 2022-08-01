<template>
  <nav :class="navClass">
    <div class="nav-inner" @mouseleave="handleMouseOut">
      <div class="row">
        <h1 class="logo">
          <img src="../assets/img/logo.svg" alt="" @click="routerpush('/')" />
        </h1>
        <div class="action-box">
          <ul class="menu" :class="{ ja: Language == 'ja' }">
            <li
              class="menu-item"
              v-for="(v, i) of menuList"
              :class="{ active: activeMenuIndex == i }"
              :key="i"
              @click="routerpush(v.src)"
            >
              <span href="#">{{ v.name }}</span>
            </li>
            <li class="menu-item" :class="{ active: activeMenuIndex == '4' }">
              <el-dropdown placement="bottom" @command="command">
                <span class="el-dropdown-link">
                  Airdrop<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="Tasks" :disabled="token"
                    >Tasks</el-dropdown-item
                  >
                  <el-dropdown-item command="Ranking" :disabled="token"
                    >Ranking</el-dropdown-item
                  >
                  <el-dropdown-item command="RTV" :disabled="token"
                    >Claim $RTV</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li
              class="menu-item doc"
              @click="open('https://revonft.gitbook.io/')"
            >
              <img src="./../assets/img/Doc.svg" alt="" />
              <!-- <i class="el-icon-top-right"></i> -->
              <!-- <div v-show="expand" class="menu-item-trigger"></div> -->
            </li>
          </ul>
        </div>
      </div>
      <div class="row right-row">
        <div class="wallet-connect" @click="connectX" v-if="account == ''">
          <div class="icon"></div>
          <div class="info">Connect wallet</div>
        </div>
        <div
          class="account"
          @click="handleShow"
          :class="{ activeAccount: active }"
          v-else
        >
          <div class="account-info">
            <img
              src="./../assets/img/account-icon.png"
              alt=""
              class="avatar-default"
            />
            <a class="text">{{ account }}</a>
          </div>
        </div>
        <div class="lang">
          <el-select v-model="Language" size="small" @change="handleChange">
            <el-option label="English" value="en"></el-option>
            <el-option label="日本語" value="ja"></el-option>
            <el-option label="한국어" value="ko"></el-option>
            <el-option label="繁體中文" value="cn"></el-option>
          </el-select>
        </div>
        <!-- 下拉组件 -->
        <div class="downmenu" :class="{ show: active }">
          <downMenu ref="downMenu" @close="handleMouseOut"></downMenu>
        </div>
      </div>
    </div>
    <connectMetamask ref="showMetamask"></connectMetamask>
  </nav>
</template>
<script>
import util from "../lib/util.js";
import ad from "../utils/web3Helper.js";
import downMenu from "./downMenu.vue";
export default {
  props: {
    activeMenuIndex: {
      type: String,
      default: "0",
    },
  },
  components: { downMenu },
  data() {
    return {
      accountShot: "",
      expand: false,
      scrollDirection: "down",
      pageScroll: 0,
      Language: "en",
      active: false,
      address: "",
    };
  },
  watch: {
    "$store.state.ShowDownMenu"(val, oldVal) {
      if (val == 3) {
        this.active = false;
      }
    },
  },
  computed: {
    token() {
      return this.getStorageToken() == null ? true : false;
    },
    account() {
      let address = this.$store.getters.address;
      if (address) {
        return (
          address.substr(0, 5) + "...." + address.substr(address.length - 4, 4)
        );
      } else {
        return false;
      }
    },
    menuList() {
      return [
        {
          name: this.$t("lang.home"),
          src: "/",
        },
        {
          name: this.$t("lang.opting"),
          src: "/pickMarket",
        },
        {
          name: this.$t("lang.market"),
          src: "/tradingMarket",
        },
        {
          name: this.$t("lang.mine"),
          src: "/mine",
        },
      ];
    },
    navClass() {
      if (this.pageScroll < 30) {
        if (this.expand) {
          return "white-nav white-nav-expand";
        } else {
          return "transparent-nav";
        }
      } else if (this.pageScroll >= 30 && this.pageScroll < 50) {
        return "white-nav";
      } else {
        if (this.scrollDirection == "down") {
          this.active = false;
          return "white-nav hide-nav";
        } else {
          return "white-nav";
        }
      }
    },
  },
  created() {
    let address;
    if (window.ethereum) {
      address = window.ethereum.selectedAddress;
    }
    this.address = this.$store.getters.address || address;
    let lang = sessionStorage.getItem("Language");
    if (lang) {
      this.Language = lang;
    }
    this.handleScroll();
    ad.init()
  },
  methods: {
    command(v) {
      if (v == "Tasks") {
        this.$router.push({
          name: "task",
        });
      } else if (v == "Ranking") {
        this.$router.push({
          name: "rank",
        });
      } else {
        sessionStorage.setItem("scroll", "true");
        this.$router.push({
          name: "personal",
        });
      }
    },
    handleMouseOut() {
      // this.active = false;
    },
    handleShow() {
      let token = this.getStorageToken();
      console.log(token)
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.$refs.downMenu.account = this.address;
        this.$refs.downMenu.getList();
        this.active = !this.active;
        if (this.active) {
          this.$store.commit("SetShowDownMenu", 1);
        }
      }
    },
    open(url) {
      window.open(url);
    },
    handleChange() {
      this.$i18n.locale = this.Language;
      sessionStorage.setItem("Language", this.Language);
    },
    connectX() {
      //没有安装小狐狸
      // if (!window.ethereum || this.address=='') {
      //   return this.$refs.showMetamask.show=true;
      // }
      this.$refs.showMetamask.show=true;
      
    },
    routerpush(to) {
      this.$router.push(to);
      // document.getElementById('active')
      // 跳转之后，记得关闭菜单（在屏幕宽度小于800的时候才生效）
    },
    handleScroll() {
      window.addEventListener("scroll", (event) => {
        let scrollTop = util.getPageScrollY();
        if (scrollTop > this.pageScroll) {
          this.scrollDirection = "down";
        } else {
          this.scrollDirection = "up";
        }

        this.pageScroll = scrollTop;
      });
    },
  },
};
</script>
<style lang="less" scoped>
nav {
  position: fixed;
  top: 0;
  left: 0px;
  width: 100%;
  z-index: 999;
  width: 100%;
  height: 90px;
  transition: all 0.2s;
  min-width: 1200px;
}
.lang {
  width: 113px;
  margin-left: 1%;
  .el-select {
    width: 100%;
    /deep/ .el-input__inner {
      background: transparent;
      color: #333;
      padding-right: 30px;
      height: 36px;
      border-color: #ccc;
    }
  }
}
.nav-inner {
  width: 75%;
  height: 100%;
  margin: 0px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 99;
  min-width: 1250px;
  .row {
    display: flex;
    align-items: flex-end;
  }
  .right-row {
    position: relative;
    align-items: flex-end;
    height: 60px;
    .downmenu {
      position: absolute;
      top: 50px;
      left: -34%;
      height: 0;
      overflow: hidden;
      z-index: 10000;
      transition: all 0.3s;
      padding-top: 20px;
    }
    .show {
      height: 630px;
    }
  }
}

.logo {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  min-width: 157px;
  img {
    width: 100%;
    cursor: pointer;
  }
  // a {
  //   display: block;
  //   width: 157px;
  //   height: 49px;
  //   background-size: 100% 100%;
  // }
  // .version {
  //   color: #12022f;
  //   background: #f43a3a;
  //   border-radius: 4px;
  //   width: 54px;
  //   height: 26px;
  //   line-height: 26px;
  //   text-align: center;
  // }
}

.action-box {
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 3%;
}

.menu {
  height: 100%;
  display: flex;
  .menu-item {
    height: 100%;
    padding: 0px 0 10px;
    width: 125px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
    cursor: pointer;
    font-size: 20px;
    color: #12022f;
    border-right: 1px solid #e1e1e1;
    & > span {
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 4px;
        position: absolute;
        bottom: -8px;
        left: 0px;
        background-color: #000;
        opacity: 0;
        transform-origin: 50% 0%;
        transform: scaleX(0);
        transition: all 0.2s;
      }
    }
    &.active {
      span {
        color: #3c4897;
        font-weight: 600;
      }
    }
    .el-dropdown {
      color: #12022f;
    }
    .el-dropdown .el-dropdown-link {
      display: flex;
      align-items: center;
      i {
        margin-top: 5px;
        font-size: 14px;
      }
    }
  }
  .doc {
    img {
      width: 44px;
      margin-bottom: 3px;
    }
    // i {
    //   color: #000;
    //   font-size: 16px;
    //   margin-left: 4px;
    // }
  }
}
.ja {
  .menu-item {
    width: 140px;
    padding: 0px 5px 10px;
  }
}
.menu-item:hover {
  span {
    color: #3c4897;
  }
}
.doc:hover {
  span {
    color: #f400ff;
  }
}
// .menu-item:hover > span::after {
//   opacity: 1;
//   transform: scaleX(1);
// }
// .doc:hover > span::after{
//     opacity:0;
// }
.menu-item-trigger {
  width: 100%;
  height: 348px;
  position: absolute;
  top: 100%;
  left: 0px;
  z-index: 1;
}

.lang-box {
  a {
    opacity: 0.7;
  }

  i {
    font-size: 12px;
    opacity: 0.7;
    margin: 0px 3px;
  }

  .current {
    opacity: 1;
  }
}

.white-nav {
  background: #fff;
  border-bottom: 1px solid #ccc;
  .logo {
    a {
      background-image: url(../assets/img/logo.png);
    }
  }
  .menu-item > a {
    color: #12022f;
  }
  .lang-box {
    color: #12022f;
  }
}
.white-nav-expand {
  background-color: transparent;
}
.transparent-nav {
  background-color: transparent;
  .menu-item > a {
    color: #12022f;
  }
  .lang-box {
    color: #12022f;
  }
}

.hide-nav {
  top: -90px;
}

.account {
  color: #333;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 20px;
  .account-info {
    border: #ccc 1px solid;
    border-radius: 2em;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 4.5px 13px;
    cursor: pointer;
    position: relative;
    .account-icon {
      width: 22px;
      height: 22px;
      margin-right: 10px;
    }
    .avatar-default {
      width: 24px;
      margin-top: 1px;
    }
    .nft-avatar {
      .avatar-inner {
        width: 100%;
        height: 100%;
      }
      .avatar-default {
        height: 50%;
      }
    }
    .text {
      text-decoration: underline;
      font-size: 16px;
      line-height: 22px;
      margin-left: 5px;
    }
    .dropdown {
      position: absolute;
      left: -1px;
      right: -1px;
      top: 42px;
      background: rgba(0, 0, 0, 0.5);
      padding: 10px 0;
      border-radius: 0 0 22px 22px;
      border: #979797 1px solid;
      border-top: 0;
      display: none;
      .inner {
        li {
          a {
            display: block;
            padding: 5px 20px;
            font-size: 16px;
            &:hover {
              opacity: 0.6;
            }
          }
        }
      }
    }
  }
}
.activeAccount {
  color: #fff;
  .account-info {
    background: #3c4897;
  }
}
.wallet-connect {
  color: #000;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  width: 175px;
  .icon {
    background: url("~@/assets/img/wallet.svg") no-repeat center center/50% 50%;
    width: 38px;
    height: 38px;
    margin-right: 5px;
    border-radius: 50%;
  }
  .info {
    font-size: 16px;
    text-decoration: underline;
    line-height: 22px;
  }
}
.el-dropdown-link {
  font-size: 20px;
}
</style>
<style lang="less">
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background: #efefef;
  color: #12022f;
}
</style>