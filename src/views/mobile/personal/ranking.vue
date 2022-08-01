<!-- rank -->
<template>
  <div class="rank-page">
    <Header custom-active="4-2"></Header>
    <section>
      <h2>Ranking</h2>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Votes obtained" name="0">
          <ul class="theader">
            <li>Ranking</li>
            <li>Quantity</li>
            <li>Address</li>
            <li>Reward(RTV)</li>
          </ul>
          <ul class="title" v-if="get_voteNum !== ''">
            <li>{{ get_voteNum }}</li>
            <li>{{ get_votes || "-" }}</li>
            <li :title="address">
              {{
                address.substr(0, 8) +
                "...." +
                address.substr(address.length - 6, 6)
              }}
            </li>
            <li v-if="get_votes != '0'">
              {{
                get_voteNum > "50"
                  ? "0"
                  : get_voteNum == 0
                  ? 100
                  : get_voteNum == 1
                  ? 50
                  : get_voteNum == 2
                  ? 25
                  : 10
              }}
            </li>
            <li v-else>-</li>
          </ul>
          <ul class="tbody">
            <li v-for="(v, i) in get_voteList" :key="i">
              <div :class="{ blod: i < 3 }">
                <span v-if="i < 3">#</span>{{ i + 1 }}
              </div>
              <div>{{ v.number_of_get_votes }}</div>
              <div :title="v.address">
                {{
                  v.address != "undefined"
                    ? v.address.substr(0, 8) +
                      "..." +
                      v.address.substr(v.address.length - 6, 6)
                    : "-"
                }}
              </div>
              <div v-if="v.number_of_get_votes != '0'">
                {{ i == 0 ? 100 : i == 1 ? 50 : i == 2 ? 25 : 10 }}
              </div>
              <div v-else>-</div>
            </li>
            <li class="no-data" v-if="get_voteList.length == 0">暂无数据</li>
          </ul>
        </el-tab-pane>
        <el-tab-pane label="Vote" name="1">
          <ul class="theader">
            <li>Ranking</li>
            <li>Quantity</li>
            <li>Address</li>
            <li>Reward(RTV)</li>
          </ul>
          <ul class="title" v-if="voteNum !== ''">
            <li>{{ voteNum }}</li>
            <li>{{ votes || "-" }}</li>
            <li :title="address">
              {{
                address != "undefined"
                  ? address.substr(0, 8) +
                    "..." +
                    address.substr(address.length - 6, 6)
                  : "-"
              }}
            </li>
            <li v-if="votes != '0'">
              {{
                voteNum > "50"
                  ? "0"
                  : voteNum == 0
                  ? 100
                  : voteNum == 1
                  ? 50
                  : voteNum == 2
                  ? 25
                  : 10
              }}
            </li>
            <li v-else>-</li>
          </ul>
          <ul class="tbody">
            <li v-for="(v, i) in voteList" :key="i">
              <div :class="{ blod: i < 3 }">
                <span v-if="i < 3">#</span>{{ i + 1 }}
              </div>
              <div>{{ v.number_of_votes }}</div>
              <div :title="v.address">
                {{
                  v.address != "undefined"
                    ? v.address.substr(0, 8) +
                      "..." +
                      v.address.substr(v.address.length - 6, 6)
                    : "-"
                }}
              </div>
              <div v-if="v.number_of_votes != '0'">
                {{ i == 0 ? 100 : i == 1 ? 50 : i == 2 ? 25 : 10 }}
              </div>
              <div v-else>-</div>
            </li>
            <li class="no-data" v-if="voteList.length == 0">暂无数据</li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import request from "@/services/request";
import ad from "@/utils/web3Helper.js";
export default {
  data() {
    return {
      activeName: "0",
      list: [],
      voteList: [],
      voteNum: "",
      votes: "",
      get_voteList: [],
      get_voteNum: "",
      get_votes: "",
      loading: null,
    };
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
  },
  created() {
    let token = sessionStorage.getItem("Token");
    if (!token) {
      Object.assign(this.$data, this.$options.data());
      sessionStorage.setItem("iSsignature", false);
      this.getSign();
    } else {
      this.showLoading();
      this.voteData();
      this.getVoteData();
    }
  },
  methods: {
    handleClick() {},
    voteData() {
      request.voteRank({ address: this.address }).then((res) => {
        if (res.code == 200) {
          this.voteList = res.data.res;
          this.voteNum = res.data.num;
          this.votes = res.data.votes;
        }
      });
      this.loading.close();
    },
    getVoteData() {
      request.getVoteRank({ address: this.address }).then((res) => {
        if (res.code == 200) {
          this.get_voteList = res.data.res;
          this.get_voteNum = res.data.num;
          this.get_votes = res.data.votes;
        }
      });
    },
    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: this.$t("lang.please"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.6)",
      });
    },
  },
  components: {
    Header,
    Footer,
  },
};
</script>
<style lang='less' scoped>
.rank-page {
  section {
    padding: 10px 5px;
    & > h2 {
      font-size: 22px;
      color: #3c4897;
      line-height: 40px;
      margin: 10px 0;
    }
    .theader,
    .title {
      display: flex;
      align-items: center;
      line-height: 45px;
      color: #666666;
      li {
        width: 19%;
        font-size: 13px;
        &:nth-child(1) {
          padding-left: 10px;
        }
        &:nth-child(3) {
          width: 36%;
        }
        &:last-child {
          width: 23%;
          margin-left: 2%;
        }
      }
    }
    .title {
      background: #3c4897;
      color: #fff;
      li {
        font-size: 14px;
      }
      li:last-child {
        font-weight: 700;
      }
    }
    .tbody {
      min-height: 35vh;
      li {
        display: flex;
        align-items: center;
        line-height: 35px;
        background: #eeeded;
        color: #333;
        &:first-child {
          padding-left: 0;
        }
        &:nth-child(odd) {
          background: #f7f6f6;
        }
        .blod {
          font-weight: 600;
        }
        & > div {
          width: 19%;
          font-size: 14px;
          &:first-child {
            padding-left: 10px;
          }
          &:nth-child(3) {
            width: 36%;
          }
          &:last-child {
            width: 23%;
            font-weight: 700;
            margin-left: 2%;
          }
        }
      }
      .no-data {
        color: #666;
        line-height: 50px;
        justify-content: center;
      }
    }
  }
}
</style>
<style>
.el-tabs__active-bar {
  background-color: #3c4897;
  height: 4px;
}
.el-tabs__item.is-active,
.el-tabs__item:hover {
  color: #333333;
  font-weight: 700;
}
</style>