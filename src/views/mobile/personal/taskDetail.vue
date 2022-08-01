<!-- 任务详情 移动页面 -->
<template>
  <div class="taskDetail-page">
    <Header custom-active="4-1"></Header>
    <section>
      <div>
        <h4>
          <span>Task detail： </span>
          <span class="recent" @click="handleRecent">Recent</span>
        </h4>
        <div class="container-box">
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
                <span :class="{ active: object.is_publish }"> - Publish</span>
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
          <div class="desc">
            One-time <br />
            You will get interactive reward when tasks（mint/publish/sell）are
            all completed.
          </div>
          <div class="Reward">
            <p>
              <span>Reward：</span>
              <img src="@/assets/img/RTV.png" alt="" />
              <span class="number">+ 10 RTV</span>
            </p>
          </div>
        </div>
        <div class="container-box">
          <div class="title">
            <p>
              <span class="circle"></span>
              <span>Daily reward</span>
            </p>
            <p>{{ object.dalily_can_reward || 0 }}/3</p>
          </div>
          <ul>
            <li>
              <div>
                <span>- number of votes</span>
              </div>
              <div>{{ object.dalily_vote_count || 0 }}/90</div>
            </li>
          </ul>
          <div class="desc">
            Daily <br />
            1 RTV per 30-votes ，no more than 3 RTV everyday.The mission will be
            reset daily！
          </div>
          <div class="Reward">
            <p>
              <span>Reward：</span>
              <img src="@/assets/img/RTV.png" alt="" />
              <span class="number">+ 1 RTV</span>
            </p>
          </div>
        </div>
        <div class="container-box">
          <div
            class="title"
            :class="{
              filed: object.number_of_votes == 1000,
            }"
          >
            <!-- object.number_of_votes == 1000 ? 'filed' : 'success' -->
            <p>
              <span class="circle"></span>
              <span
                >Vote-obtained reach 200 ：<span
                  class="status"
                  v-if="
                    object.number_of_votes == 1000 || object.vote_ranking == 1
                  "
                  >({{ object.number_of_votes == 1000 ? "end" : "" }})</span
                ></span
              >
            </p>
            <p>{{ object.vote_ranking || 0 }}/1</p>
          </div>
          <ul>
            <li>
              <div>
                <span>- number of votes</span>
              </div>
              <div>{{ object.number_of_votes || 0 }}/200</div>
            </li>
          </ul>
          <div class="desc">
            <p>Eligible：{{ object.remain_people || 0 }} addresses</p>
            During the test，When the number of eligible address reach 1000 ,
            we'll close the mission.
          </div>
          <div class="Reward">
            <p>
              <span>Reward：</span>
              <img src="@/assets/img/RTV.png" alt="" />
              <span class="number">+ 100 RTV</span>
            </p>
          </div>
        </div>
        <div class="container-box">
          <div class="title">
            <p>
              <span class="circle"></span>
              <span>Ranking Reward （vote）：</span>
            </p>
            <div class="btn">
              {{ object.ranking_reward ? "ongoing" : "end" }}
            </div>
          </div>
          <div class="title">
            <p>
              <span class="circle"></span>
              <span>Ranking Reward （vote-obtained）：</span>
            </p>
            <div class="btn">
              {{ object.vote_obtained ? "ongoing" : "end" }}
            </div>
          </div>
          <div class="desc">
            The final award shall be subject to the final ranking.
          </div>
        </div>
        <div class="container-box">
          <div class="title">
            <p>
              <span class="circle"></span>
              <span>BUG/Suggestions reward：</span>
            </p>
            <div class="btn contact" @click="open">contact us</div>
          </div>
        </div>
      </div>
    </section>
    <Footer></Footer>
    <!-- Recent -->
    <el-drawer
      custom-class="sort-drawers"
      :visible.sync="visible"
      direction="btt"
      :size="240"
      :with-header="false"
    >
      <div class="table-container">
        <ul class="thader">
          <li>Date</li>
          <li>Type</li>
        </ul>
        <ul class="tbody" v-if="list.length>0">
          <li v-for="(v, i) in list" :key="i">
            <div>{{ v.CreatedAt }}</div>
            <div>{{ v.Operation }}</div>
          </li>
        </ul>
        <ul class="no-data">
          <li>
            暂无数据
          </li>
        </ul>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import request from "@/services/request";
import moment from "moment";
import ad from "@/utils/web3Helper.js";
export default {
  data() {
    return {
      object: {
        vote_ranking: 0,
      },
      visible: false,
      list: [],
    };
  },
  computed: {
    account() {
      return this.$store.getters.address;
    },
  },
  mounted(){
     let token = sessionStorage.getItem("Token");
    if (!token) {
      Object.assign(this.$data, this.$options.data());
      sessionStorage.setItem("iSsignature", false);
      this.getSign();
    } else {
      this.getList();
    }
  },
  methods: {
    moment,
    open() {
      window.open("https://forms.gle/uYTAKKWgrZNJzkKx6");
    },
    handleRecent() {
      this.visible = true;
    },
    getList() {
      request
        .getTaskDetail({
          address: this.account,
        })
        .then((res) => {
          if (res.code == 200) {
            this.object = res.data;
            this.getRecent();
          }
        });
    },
    getRecent() {
      request
        .getRecent({
          address: this.account,
        })
        .then((res) => {
          if (res.code == 200) {
            this.list = res.data;
          }
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
.taskDetail-page {
  section {
    width: 95%;
    margin: 10px auto;
    & > div {
      width: 100%;
      & > h4 {
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 40px;
        color: #3c4897;
        .recent {
          font-size: 16px;
          text-decoration: underline;
          color: #333;
          cursor: pointer;
        }
      }
      .container-box {
        padding: 10px 0;
        border-bottom: 1px solid #d9d9d9;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          line-height: 35px;
          p {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: #333;
            font-weight: 600;
            span {
              color: #3c4897;
              font-size: 13px;
              .status {
                font-weight: 400;
                font-size: 14px;
              }
            }
            .circle {
              background: #3c4897;
              width: 12px;
              height: 12px;
              display: inline-block;
              border-radius: 6px;
              margin-right: 5px;
            }
          }
          .btn {
            color: #12022f;
            font-size: 14px;
            border: 1px solid #12022f;
            padding: 0 12px;
            line-height: 22px;
            border-radius: 2px;
          }
          .contact {
            cursor: pointer;
          }
        }
        .success {
          p {
            color: #00a60a;
            span {
              color: #00a60a;
            }
            .circle {
              background: #00a60a;
            }
          }
        }
        .filed {
          p {
            color: #df0023;
            span {
              color: #df0023;
            }
            .circle {
              background: #df0023;
            }
            &:last-child {
              color: #333;
            }
          }
        }
        ul {
          padding-left: 15px;
          li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 35px;
            font-size: 14px;
            color: #666;
            i {
              margin-left: 5px;
              color: #35a330;
              font-size: 20px;
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
          }
        }
        .desc {
          padding: 10px;
          background: #f9f9f9;
          font-size: 13px;
          color: #888;
          line-height: 20px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        .Reward {
          display: flex;
          justify-content: flex-end;
          line-height: 35px;
          margin-top: 5px;
          p {
            background: #e2e6ff;
            border-radius: 4px;
            font-weight: 600;
            font-size: 14px;
            padding: 0 15px;
            display: flex;
            align-items: center;
            img {
              width: 10px;
              margin-right: 5px;
            }
            .number {
              color: #3c4897;
            }
          }
        }
      }
    }
  }
}
.table-container {
  padding: 10px 15px;
  ul {
    width: 100%;
    li {
      width: 100%;
      line-height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > div {
        width: 70%;
        color: #666666;
        font-size: 14px;
        line-height: 35px;
        &:nth-child(2) {
          width: 25%;
        }
      }
    }
    &.thader {
      display: flex;
      align-items: center;
      justify-content: space-between;
      li {
        width: 75%;
        font-weight: 700;
        font-size: 16px;
        color: #333333;
        line-height: 40px;
        border-bottom: 1px solid #ececec;
        margin-bottom: 10px;
        &:nth-child(2) {
          width: 25%;
        }
      }
    }
    &.tbody {
      height: 160px;
      overflow: auto;
    }
    &.no-data{
      li{
        display:flex;
        justify-content:center;
        line-height: 50px;
        font-size:16px;
        color:#666;
      }
    }
  }
}
</style>