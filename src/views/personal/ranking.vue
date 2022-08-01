<!--  -->
<template>
  <div class="rank-page">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="4"></Header>
    </div>
    <div class="banner">
      <img src="./../../assets/img/personal-banner.png" alt="" />
    </div>
    <section>
      <h2>Ranking</h2>
      <div class="main">
        <div class="obtained">
          <h3>Votes obtained</h3>
          <ul class="theader">
            <li>Ranking</li>
            <li>Quantity</li>
            <li>Address</li>
            <li>Reward(RTV)</li>
          </ul>
          <ul class="title">
            <li>{{ get_voteNum + 1 }}</li>
            <li>{{ get_votes || '-' }}</li>
            <li :title="address" >
              {{
                address.substr(0, 14) +
                "...." +
                address.substr(
                  address.length - 8,
                  8
                )
              }}
            </li>
            <li v-if="get_votes!='0'">
              {{
                get_voteNum > "50"
                  ? "0"
                  : get_voteNum == 0 ? 100 : get_voteNum == 1 ? 50 : get_voteNum == 2 ? 25 : 10
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
                  v.address!='undefined'? v.address.substr(0, 14) +
                  "...." +
                  v.address.substr(v.address.length - 8, 8):'-'
                }}
              </div>
              <div v-if="v.number_of_get_votes!='0'">{{ i == 0 ? 100 : i == 1 ? 50 : i == 2 ? 25 : 10 }}</div>
              <div v-else>-</div>
            </li>
          </ul>
        </div>
        <div class="vote">
          <h3>Vote</h3>
          <ul class="theader">
            <li>Ranking</li>
            <li>Quantity</li>
            <li>Address</li>
            <li>Reward(RTV)</li>
          </ul>
          <ul class="title" v-if="voteNum !== ''">
            <li>{{ voteNum + 1 }}</li>
            <li>{{ votes || '-' }}</li>
            <li :title="address">
              {{
                address.substr(0, 14) +
                "...." +
                address.substr(
                  address.length - 8,
                  8
                )
              }}
            </li>
            <li  v-if="votes!='0'">
              {{ voteNum > "50" ? "0"
                  : voteNum == 0 ? 100 : voteNum == 1 ? 50 : voteNum == 2 ? 25 : 10 }}
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
                  v.address!='undefined'? v.address.substr(0, 14) +
                  "...." +
                  v.address.substr(v.address.length - 8, 8):'-'
                }}
              </div>
              <div v-if="v.number_of_votes!='0'">{{ i == 0 ? 100 : i == 1 ? 50 : i == 2 ? 25 : 10 }}</div>
              <div v-else>-</div>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "../../components/footer.vue";
import request from "@/services/request";
export default {
  data() {
    return {
      list: [],
      voteList: [],
      voteNum: "",
      votes: "",
      get_voteList: [],
      get_voteNum: "",
      get_votes: "",
    };
  },
  components: {
    Header,
    Footer,
  },
  computed: {
    address() {
      return this.$store.getters.address;
    },
  },
  beforeMount() {
    let token = sessionStorage.getItem("Token");
    if (!token) {
      Object.assign(this.$data, this.$options.data());
      sessionStorage.setItem("iSsignature", false);
      this.getSign();
    } else {
      this.voteData();
      this.getVoteData();
    }
  },
  methods: {
    voteData() {
      request.voteRank({ address: this.address }).then((res) => {
        if (res.code == 200) {
          this.voteList = res.data.res;
          this.voteNum = res.data.num;
          this.votes = res.data.votes;
        }
      });
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
  },
};
</script>
<style lang='less' scoped>
.rank-page {
  .banner {
    width: 100%;
    img {
      width: 100%;
    }
  }
  section {
    width: 1200px;
    margin: 20px auto;
    h2 {
      text-align: center;
      color: #3c4897;
      font-size: 26px;
      margin: 20px 0;
    }
    .main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      & > div {
        width: 49%;
        border: 1px solid #ccc;
        h3 {
          line-height: 40px;
          border-bottom: 1px solid #333;
          color: #333;
          font-size: 17px;
          padding-left: 15px;
        }
        .theader,
        .title {
          display: flex;
          align-items: center;
          line-height: 45px;
          li {
            width: 17%;
            font-size: 14px;
            &:nth-child(3) {
              width: 48%;
            }
            &:last-child {
              font-weight: 700;
            }
          }
        }
        .theader {
          color: #666;
          li {
            font-size: 15px;
            &:last-child {
              font-weight: 500;
            }
          }
        }
        .title {
          background: #3c4897;
          color: #fff;
        }
        ul {
          li {
            &:first-child {
              padding-left: 15px;
            }
          }
        }
        .tbody {
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
              width: 17%;
              font-size: 14px;
              &:first-child {
                padding-left: 15px;
              }
              &:nth-child(3) {
                width: 48%;
              }
              &:last-child {
                font-weight: 700;
              }
            }
          }
        }
      }
    }
  }
}
</style>