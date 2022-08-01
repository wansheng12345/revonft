<!-- 头部菜单，下拉组件 -->
<template>
  <div class="downMenu-page">
    <h4>
      <div>
        <span>{{
          account.substr(0, 6) + "...." + account.substr(account.length - 4, 8)
        }}</span>
        <i
          class="el-icon-copy-document"
          v-clipboard:copy="account"
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
          <img src="./../assets/img/icon.png" alt="" />
          <div>
            <span>Balance</span>
            <h4>
              <img src="./../assets/img/ETH.png" alt="" />
              <span :title="Balance.ETH">{{ Balance.ETH }}</span>
            </h4>
          </div>
        </li>
        <li>
          <img src="./../assets/img/favicon.png" alt="" />
          <div>
            <h4>
              <img src="./../assets/img/RTV.png" alt="" />
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
      <!-- <div class="container-box">
        <div class="title">
          <p>
            <span class="circle"></span>
            <span>Voting ranking</span>
          </p>
          <p>{{ object.vote_ranking }}/1</p>
        </div>
        <ul>
          <li>
            <div>
              <span>- number of votes</span>
            </div>
            <div>{{ object.number_of_votes }}/200</div>
          </li>
          <li class="desc">
            <span>{{ object.remain_people }}</span>
            people who have completed the top 1000 Awards
          </li>
        </ul>
        <div class="Reward">
          <p>
            <span>Reward：</span>
            <span class="number"
              >200
              RTV</span
            >
          </p>
        </div>
      </div> -->
    </section>
  </div>
</template>

<script>
import request from "@/services/request";
export default {
  data() {
    return {
      account: "",
      showCopy: false,
      status: 1,
      object: {},
      Balance: {},
    };
  },
  created() {},
  methods: {
    getList() {
      this.getTask();
      this.getBalance();
    },
    getTask() {
      request
        .getTaskDetail({
          address:this.$store.getters.address,
        })
        .then((res) => {
          if (res.code == 200) {
            this.object = res.data;
          }
        });
    },
    getBalance() {
      request.getBalance({ address:this.$store.getters.address }).then((res) => {
        if (res.code == 200) {
          this.Balance = res.data;
        }
      });
    },
    handleTask() {
      let urlName = this.$route.name;
      if (urlName == "task") {
        this.$emit('close')
      } else {
      this.$router.push({
        name: "task",
      });
      }
    },
    handleClick() {
      sessionStorage.setItem("scroll", "false");
      console.log(this.$route);
      let urlName = this.$route.name;
      if (urlName == "personal") {
        this.$emit('close')
      } else {
        this.$router.push({
          name: "personal",
        });
      }
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
  },
};
</script>
<style lang='less' scoped>
.downMenu-page {
  border: 1px solid #ccc;
  border-radius: 2px;
  background: #fff;
  width:280px;
  padding: 10px 10px;
  & > h4 {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
    cursor: pointer;
    i {
      margin-left: 6px;
      font-size: 20px;
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
          width: 40px;
          margin-right: 25px;
        }
        div {
          span {
            display: inline-block;
            font-size: 15px;
            color: #666;
          }
          h4 {
            font-size: 20px;
            line-height: 45px;
            display: flex;
            align-items: center;
            padding-right: 4px;
            img {
              width: 12px;
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
        padding: 0 15px;
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
</style>