<template>
  <div id="app" :class="{overflow:ethereumAddress == 'pc'}" @click="handleClick">
    <!-- pc -->
    <div v-if="ethereumAddress == 'pc'">
      <Pnetwork></Pnetwork>
    </div>
    <!-- mobile    -->
    <div v-if="ethereumAddress == 'mobile'">
      <Mnetwork />
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Pnetwork from "./components/message/error-network";
import Mnetwork from "./components/mobile/error-network.vue";
import { mapState } from "vuex";
export default {
  name: "app",
  data() {
    return {
      timers: null,
      test: 0,
    };
  },
  components: {
    Pnetwork,
    Mnetwork,
  },
  computed: {
    ...mapState(["ethereumAddress","address"]),
  },
  watch: {
    // "$store.state.address"(val, oldVal) {
    //   console.log(191919)
    //   if (val !== oldVal) {
    //     let token = sessionStorage.getItem("Token");
    //     if (!token) {
    //       sessionStorage.setItem("iSsignature", false);
    //       this.getSign();
    //     }
    //   }
    // },
  },
  beforeMount() {
  },
  mounted() {
    // if (!isPc() && !window.ethereum) {
    //   alert("Looks like you need a Dapp browser to get started. 111");
    //   alert("Consider installing MetaMask!");
    // }
  },
  methods: {
    handleClick() {
      var step = this.$store.state.ShowDownMenu;
      this.$store.commit("SetShowDownMenu", ++step);
    },
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
#app {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-size:14px;
}
.overflow{
  overflow: hidden;
}
body {
  font-family: "Microsoft YaHei", Arial, Helvetica, sans-serif, "宋体";
}
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
.nodata {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nodata img {
  width: 85%;
}
.header {
  height: 90px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
</style>