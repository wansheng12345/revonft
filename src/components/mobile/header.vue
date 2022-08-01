<template>
  <div class="header-container">
    <header class="header-m">
      <div class="logo" @click="toggleCollapse">
        <img :src="require('@/assets/img/logo-m.svg')" class="logo-img" />
        <i class="el-icon el-icon-arrow-down"></i>
      </div>
      <div class="right-container">
        <div class="account" @click="handleShow" v-if="address">
          <div class="icon">
            <img :src="require('@/assets/img/nft.svg')" class="default-img" />
          </div>
          <div class="text">{{ account }}</div>
        </div>
        <div class="lang" @click="LanguageChange">
          <span>{{ langList[Language].name }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </header>
    <nav class="custom-nav" :class="{ collapse: isShow }">
      <el-menu
        :default-active="customActive"
        @select="handleOpen"
        background-color="rgba(50,50,50,.8)"
        text-color="#fff"
      >
        <div v-show="menu1">
          <el-menu-item index="0" route="home-m">{{
            $t("lang.home")
          }}</el-menu-item>
          <el-menu-item index="1" route="pickMarket-m">{{
            $t("lang.opting")
          }}</el-menu-item>
          <el-menu-item index="2" route="tradingMarket-m">{{
            $t("lang.market")
          }}</el-menu-item>
          <el-menu-item index="3" route="mine-m">{{
            $t("lang.mine")
          }}</el-menu-item>
          <el-menu-item
            index="4"
            :class="{
              'is-active':
                customActive == '4-1' ||
                customActive == '4-2' ||
                customActive == '4-3',
            }"
            >Airdrop</el-menu-item
          >
          <el-menu-item index="5">{{ $t("lang.whitePaper") }}</el-menu-item>
        </div>
        <div v-show="!menu1">
          <el-menu-item
            index="4-1"
            :class="{ 'is-active': customActive == '4-1' }"
            >Task</el-menu-item
          >
          <el-menu-item
            index="4-2"
            :class="{ 'is-active': customActive == '4-2' }"
            >Ranking</el-menu-item
          >
          <el-menu-item
            index="4-3"
            :class="{ 'is-active': customActive == '4-3' }"
            >Claim $RTV</el-menu-item
          >
        </div>
      </el-menu>
    </nav>
    <el-drawer
      custom-class="sort-drawers"
      :visible.sync="visible"
      direction="btt"
      :size="165"
      :with-header="false"
    >
      <div class="sort-mod">
        <ul>
          <li
            v-for="(v, i) in langList"
            :key="i"
            :class="{ active: Language == i }"
            @click="handleSort(i)"
          >
            {{ v.name }}
          </li>
        </ul>
      </div>
    </el-drawer>
    <!-- 任务弹窗 -->
    <el-drawer
      custom-class="sort-drawers"
      :visible.sync="showDrawer"
      direction="btt"
      :size="365"
      :with-header="false"
    >
      <div class="box">
        <h4>
          <div>
            <span v-if="address && address.length > 10">{{
              address.substr(0, 8) +
              "...." +
              address.substr(address.length - 6, 8)
            }}</span>
            <i
              class="el-icon-copy-document"
              v-clipboard:copy="address"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            ></i>
          </div>
          <span class="Copied" v-if="showCopy"
            >Copied<i class="el-icon-check"></i
          ></span>
        </h4>
        <div class="nav">
          <ul>
            <li>
              <img src="@/assets/img/icon.png" alt="" />
              <div>
                <span>Balance</span>
                <h4>
                  <img src="@/assets/img/ETH.png" alt="" />
                  <span :title="Balance.ETH">{{ Balance.ETH }}</span>
                </h4>
              </div>
            </li>
            <li>
              <img src="@/assets/img/favicon.png" alt="" />
              <div>
                <h4>
                  <img src="@/assets/img/RTV.png" alt="" />
                  <span :title="Balance.RTV">{{ Balance.RTV }}</span>
                </h4>
              </div>
            </li>
          </ul>
          <div class="Dashboard" @click="handleClick">Dashboard</div>
        </div>
        <!-- 任务列表 -->
        <section>
          <h4>
            <span>Task detail： </span>
            <span class="more" @click="handleTask">More tasks</span>
          </h4>
          <div class="order-by">
            <div
              class="container-box"
              :class="{ mintBox: object.dalily_can_reward == 3 }"
            >
              <div class="title">
                <p>
                  <span class="circle"></span>
                  <span>Interactive reward</span>
                </p>
                <p>{{ object.complete ? "1" : "0" }}/1</p>
              </div>
              <ul>
                <li>
                  <div>
                    <span :class="{ active: object.is_mint }">- Mint</span>
                    <i class="el-icon-check" v-show="object.is_mint"></i>
                  </div>
                  <div class="success" v-show="object.is_mint"></div>
                </li>
                <li>
                  <div>
                    <span :class="{ active: object.is_publish }">
                      - Publish</span
                    >
                    <i class="el-icon-check" v-show="object.is_publish"></i>
                  </div>
                  <div class="success" v-show="object.is_publish"></div>
                </li>
                <li>
                  <div>
                    <span :class="{ active: object.is_sell }">- Sell</span>
                    <i class="el-icon-check" v-show="object.is_sell"></i>
                  </div>
                  <div class="success" v-show="object.is_sell"></div>
                </li>
              </ul>
              <div class="Reward">
                <p>
                  <span>Reward：</span>
                  <span class="number">10 RTV</span>
                </p>
              </div>
            </div>
            <div class="container-box">
              <div class="title">
                <p>
                  <span class="circle"></span>
                  <span>Daily reward</span>
                </p>
                <p>{{ object.dalily_can_reward }}/3</p>
              </div>
              <ul>
                <li>
                  <div>
                    <span>- number of votes</span>
                  </div>
                  <div>{{ object.dalily_vote_count }}/30</div>
                </li>
              </ul>
              <div class="Reward">
                <p>
                  <span>Reward：</span>
                  <span class="number">1 RTV</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import ad from "@/utils/web3Helper.js";
import request from "@/services/request";
import { mapState } from "vuex";
export default {
  name: "mobileHeader",
  props: {
    customActive: {
      default: "0",
      type: String,
    },
  },
  data() {
    return {
      isShow: false,
      visible: false,
      langList: [
        // {name:"中文",value:"zh"},
        { name: "English", value: "en" },
        { name: "日本語", value: "ja" },
        { name: "한국어", value: "ko" },
        { name: "繁體中文", value: "cn" },
      ],
      Language: "0",
      menu1: true,
      showDrawer: false,
      showCopy: false,
      Balance: {},
      object: {},
    };
  },
  computed: {
    ...mapState(["address"]),
    account() {
      let address = this.address;
      if (address && address.length > 10) {
        return (
          address.substr(0, 5) + "...." + address.substr(address.length - 4, 4)
        );
      } else {
        return false;
      }
    },
    ethereumAddress() {
      return this.$store.state.ethereumAddress;
    },
  },
  created() {
    if (window.ethereum) {
      setTimeout(() => {
        console.log(this.ethereumAddress);
        let token = sessionStorage.getItem("Token");
        if (!token && this.ethereumAddress.toString() == "true") {
          sessionStorage.setItem("iSsignature", false);
          this.getSign();
        }
      }, 1000);
      ad.init();
    }
    let lang = sessionStorage.getItem("Language");
    if (lang) {
      this.langList.forEach((item, index) => {
        if (item.value == lang) {
          this.Language = index;
        }
      });
    }
  },
  mounted() {
    // document.addEventListener("click", (e) => {
    //   if (!this.$el.contains(e.target)) {
    //     this.isShow = false;
    //   }
    // });
  },
  methods: {
    handleClick() {
      sessionStorage.setItem("scroll", "false");
      let urlName = this.$route.name;
      if (urlName == "personal") {
        this.$emit("close");
      } else {
        this.$router.push({
          name: "personal-m",
        });
      }
    },
    handleTask() {
      let urlName = this.$route.name;
      if (urlName == "task") {
        this.$emit("close");
      } else {
        this.$router.push({
          name: "task",
        });
      }
    },
    getList() {
      this.getTask();
      this.getBalance();
    },
    getTask() {
      request
        .getTaskDetail({
          address: this.address,
        })
        .then((res) => {
          if (res.code == 200) {
            this.object = res.data;
          }
        });
    },
    getBalance() {
      request.getBalance({ address: this.address }).then((res) => {
        if (res.code == 200) {
          this.Balance = res.data;
        }
      });
    },
    onCopy(e) {
      this.showCopy = true;
      setTimeout(() => {
        this.showCopy = false;
      }, 2000);
      // this.$message.success(this.$t("lang.copy"));
    },
    onError(e) {
      // this.$message.error(this.$t("lang.copyError"));
    },
    handleShow() {
      let token = sessionStorage.getItem("Token");
      if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        this.getList();
        this.visible = false; //关闭其他的弹窗
        this.showDrawer = true;
      }
    },
    handleOpen(i) {
      if (i == 0) {
        this.$router.push("home-m");
      }
      if (i == 1) this.$router.push("pickMarket-m");
      if (i == 2) this.$router.push("tradingMarket-m");
      if (i == 3) this.$router.push("mine-m");
      if (i == 4) this.menu1 = false;
      if (i == 5) {
        window.open("https://revonft.gitbook.io/");
        this.toggleCollapse();
      }
      if (i == "4-1") {
        this.$router.push({
          name: "task-m",
        });
      }
      if (i == "4-2") {
        this.$router.push({
          name: "rank-m",
        });
      }
      if (i == "4-3") {
        this.$router.push({
          name: "personal-m",
        });
      }
      console.log(i);
    },
    LanguageChange() {
      this.visible = true;
    },
    handleSort(i) {
      this.Language = i;
      let lang = this.langList[i].value;
      this.$i18n.locale = lang;
      sessionStorage.setItem("Language", lang);
      this.visible = false;
    },
    toggleCollapse() {
      if (this.isShow) {
        this.menu1 = true;
      }
      this.isShow = !this.isShow;
    },
    hideMenu() {},
  },
};
</script>
<style lang="less" scoped>
.header-container {
  .header-m {
    background: #3c4897;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    position: relative;
    z-index: 9;
    .logo {
      color: #fff;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .logo-img {
        width: 104px;
      }
      .el-icon {
        font-size: 17px;
        margin-left: 4px;
        margin-top: 4px;
      }
    }
    .right-container {
      display: flex;
      align-items: center;
      .lang {
        color: #fff;
        margin-left: 10px;
        border: 1px solid #fff;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 13px;
        i {
          margin-left: 2px;
        }
      }
    }
    .account {
      background: rgba(224, 224, 224, 0.27);
      height: 30px;
      border-radius: 10em;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 0 12px;
      font-size: 14px;
      .icon {
        width: 18px;
        background: #fff;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 5px;
        .default-img {
          width: 60%;
          height: 60%;
        }
        .custom-img {
          width: 100%;
          height: 100%;
        }
      }
      .text {
        color: #fff;
        text-decoration: underline;
      }
    }
  }
  /deep/ .sort-drawers {
    .sort-mod {
      padding: 10px 20px;
      ul {
        li {
          text-align: center;
          font-size: 14px;
          border-bottom: 1px solid #eee;
          line-height: 35px;
          color: #333;
          &.active {
            color: #841ae9;
            font-weight: 600;
            font-size: 15px;
          }
        }
      }
    }
  }
  .custom-nav {
    height: 0;
    overflow: hidden;
    transition: all 0.5s;
    position: absolute;
    z-index: 8;
    left: 0;
    right: 0;
    top: 40px;
    &.collapse {
      height: 340px;
    }
    .el-menu-item {
      margin: 0;
      border-radius: 0;
      width: auto;
      &.is-active {
        color: #fff;
        line-height: 56px;
        height: 56px;
        background: linear-gradient(45deg, #326cdf 0%, #1d2b85 100%);
      }
    }
  }
  .box {
    padding: 10px 10px 0;
    & > h4 {
      width: 100%;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #333;
      cursor: pointer;
      i {
        margin-left: 8px;
        font-size: 18px;
        color: #888;
      }
      .Copied {
        font-size: 13px;
        color: #35a330;
        display: flex;
        align-items: center;
        i {
          color: #35a330;
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
    .nav {
      ul {
        background: #f7f6f6;
        margin: 10px 0;
        padding: 10px;
        li {
          display: flex;
          align-items: flex-start;
          color: #333;
          padding-top: 5px;
          &:first-child {
            border-bottom: 1px solid #e7e7e7;
          }
          img {
            width: 35px;
            margin-right: 25px;
          }
          div {
            span {
              display: inline-block;
              font-size: 14px;
              color: #666;
            }
            h4 {
              font-size: 16px;
              line-height: 40px;
              display: flex;
              align-items: center;
              padding-right: 4px;
              img {
                width: 10px;
                margin-right: 6px;
              }
              span {
                display: inline-block;
                max-width: 170px;
                font-size: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #333;
              }
            }
          }
        }
      }
      .Dashboard {
        margin: 0 auto;
        background: #3c4897;
        line-height: 38px;
        font-size: 15px;
        text-align: center;
        color: #fff;
        cursor: pointer;
        border-radius: 4px;
        &:hover {
          box-shadow: 0 0 15px 0px #ccc;
          background: #5461bb;
        }
      }
    }
    section {
      margin: 10px 0;
      h4 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #333;
        font-size: 14px;
        .more {
          color: #666;
          font-size: 13px;
          text-decoration: underline;
          cursor: pointer;
          &:hover {
            color: #444;
          }
        }
      }
      .order-by {
        display: flex;
        flex-direction: column;
      }
      .container-box {
        margin: 10px 0;
        order: 2;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 40px;
          p {
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #333;
            font-weight: 600;
            span {
              color: #3c4897;
            }
            .circle {
              background: #3c4897;
              width: 16px;
              height: 16px;
              display: inline-block;
              border-radius: 8px;
              margin-right: 5px;
            }
          }
        }
        ul {
          padding: 5px 10px;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 30px;
            font-size: 13px;
            color: #666;
            i {
              margin-left: 5px;
              color: #35a330;
              font-size: 18px;
              font-weight: 600;
            }
            .success {
              color: #35a330;
              font-weight: 600;
            }
            span.active {
              color: #333;
              font-weight: 600;
            }
            &.desc {
              color: #666;
              line-height: 22px;
              display: block;
              span {
                font-weight: 600;
                color: #333;
                display: inline-block;
                margin-right: 2px;
              }
            }
          }
        }
        .Reward {
          display: flex;
          justify-content: flex-end;
          line-height: 35px;
          margin-top: 5px;
          p {
            background: #e2e6ff;
            text-align: center;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            padding: 0 15px;
            .number {
              color: #3c4897;
            }
          }
        }
      }
      .mintBox {
        order: 3;
      }
    }
  }
}
// /deep/.el-drawer__wrapper {z-index:8 !important;}
// /deep/.custom-drawer.ttb {top:50px;}
</style>