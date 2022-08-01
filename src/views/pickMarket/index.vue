<template>
  <div class="home-index">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="1"></Header>
    </div>
    <div class="home-t">
      <ul>
        <li>
          <span>Filter:</span>
          <el-select v-model="fliterValue" @change="changeFliter">
            <el-option label="All" :value="1"></el-option>
            <el-option label="Active" :value="2"></el-option>
            <el-option label="Closed" :value="3"></el-option>
            <el-option label="Ending Soon" :value="4"></el-option>
            <el-option label="Liked" :value="5"></el-option>
          </el-select>
        </li>
        <li>
          <span>{{ $t("lang.SortedBy") }}:</span>
          <el-select v-model="sortByValue" @change="changeSort">
            <el-option label="Volume:Low to High" :value="1"></el-option>
            <el-option label="Volume:High to Low" :value="2"></el-option>
            <el-option label="Bound Value:Low to High" :value="3"></el-option>
            <el-option label="Bound Value:High to Low" :value="4"></el-option>
            <el-option
              label="Difference in votes:Low to High"
              :value="5"
            ></el-option>
            <el-option
              label="Difference in votes:High to Low"
              :value="6"
            ></el-option>
            <el-option label="Recently listed" :value="7"></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="nodata" v-if="data == null || data.length == 0">
      <img :src="require('@/assets/img/nodata_opting.png')" class="img" />
    </div>
    <div
      class="home-box-3"
      v-loading="loading"
      v-if="data != null && data.length > 0"
    >
      <ul class="card">
        <li v-for="(v, index) in data" :key="'item_' + index">
          <div class="img-container" @click="toDetail(v.TokenID)">
            <!-- <img  :src="base + v.Path" alt="" /> -->
            <el-image
              :src="base + v.Path"
              lazy
              fit="contain"
            ></el-image>
          </div>
          <h4>
            <span>{{ v.Title }}</span>
            <span class="gray">Bound-Value</span>
          </h4>
          <p class="row">
            <span class="Owner">{{
              v.Owner.substr(0, 6) +
              "...." +
              v.Owner.substr(v.Owner.length - 6, 8)
            }}</span>
            <span
              ><img src="@/assets/img/icon.png" alt="" />{{ v.Amount }}</span
            >
          </p>
          <!-- 票数 -->
          <div class="progress-container">
            <p>
              <span>{{ v.ApproveCount }}</span>
              <span class="defuse-count">{{ v.DefuseCount }}</span>
            </p>
            <div class="progress">
              <span
                class="progressing"
                v-bind:style="'width:' + v.Rate * 100 + '%'"
              >
              </span>
            </div>
          </div>
          <!-- 状态，收藏爱心 -->
          <div class="status-Collect">
            <p>
              <span :class="{ closed: Timestatus(v.StartGame) === 'Closed' }">{{
                Timestatus(v.StartGame)
              }}</span>
            </p>
            <img
              @click="addCollect(v)"
              v-if="v.IsCollect"
              src="./../../assets/img/heart-fill.svg"
              alt=""
            />
            <img
              @click="addCollect(v)"
              v-else
              src="./../../assets/img/heart.svg"
              alt=""
            />
          </div>
        </li>
      </ul>
    </div>
    <connectMetamask ref="showMetamask"></connectMetamask>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "../../components/footer.vue";
import request from "../../services/request";
import { BASE_V_API } from "@/config/env";
import ad from "../../utils/web3Helper.js";
import moment from "moment";
import { mapState } from "vuex";
export default {
  name: "home",
  data() {
    return {
      sort: 1, //1: 按价格排序 2：总参与人数 3：阵营差值 4：我收藏的(key 需要传入当前地址) 5；即将结束的 6:价格倒叙
      data: [],
      activeName: "1",
      isCollected: false,
      base: "",
      loading: false,
      fliterValue: 1, //筛选的值
      sortByValue: 2, //排序的值
    };
  },
  computed: {
    ...mapState(["address"]),
  },
  created() {
    this.loadData();
  },
  methods: {
    Timestatus(startTime) {
      let endTime = moment(startTime).valueOf() + 600 * 1000; //游戏结束时间
      let time = endTime - new Date().getTime(); //获取当前时间
      // let time=59141;
      let status;
      if (time < 0) {
        status = "Closed";
      } else {
        let mintue = Math.floor(time / 1000 / 60);
        if (mintue < 1) {
          let second = Math.floor(time / 1000);
          status = second + " second left";
        } else {
          status = mintue + (mintue > 1 ? " mintues " : " mintue ") + "left";
        }
      }
      return status;
    },
    changeFliter(target) {
      this.fliterValue = target;
      this.loadData();
    },
    changeSort(target) {
      this.sortByValue = target;
      this.loadData();
    },
    toDetail(tokenID) {
      console.log("gotoDetail", tokenID);
      this.$router.push({ name: "nftDetail", query: { tokenID: tokenID } });
    },
    addCollect: function (item) {
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        var para = {
          address: this.address,
          token_id: item.TokenID,
        };
        if (item.IsCollect == true) {
          request.delMyCollect(para).then((response) => {
            if (response.code == 200) {
              item.IsCollect = !item.IsCollect;
              // this.loadData();
            }
          });
        } else {
          request.addMyCollect(para).then((response) => {
            if (response.code == 200) {
              item.IsCollect = !item.IsCollect;
              // this.loadData();
            }
          });
        }
      }
    },
    loadData() {
      this.base = BASE_V_API;
      this.loading = true;
      const params = {
        key: this.address || "",
        page: 1,
        page_size: 100,
        typa: this.fliterValue,
        sort: this.sortByValue,
      };
      request.getOpting(params).then((response) => {
        if (response.code == 200) {
          this.data = response.data;
          this.data.forEach((item, index) => {
            this.data[index].Amount = ad.fromWei(this.data[index].Amount);
            var ac = parseInt(item.ApproveCount);
            var dc = parseInt(item.DefuseCount);
            if (ac == 0 && dc == 0) {
              this.data[index].Rate = 0.5;
            } else {
              this.data[index].Rate = ac / (ac + dc);
            }
            this.data[index].UpdatedAt = moment(
              this.data[index].UpdatedAt
            ).format("YYYY-MM-DD");
            let arr = item.Path.split("/");
            let fileName = arr[arr.length - 1];
            let fileSplit = fileName.split(".");
            let suffixType = fileSplit[fileSplit.length - 1];
            if (suffixType == "mp4") {
              item.isVideo = true;
            } else {
              item.isVideo = false;
            }
          });
          this.loading = false;
        } else {
          this.$message.error(response.msg);
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

<style lang="less" scoped>
.home-index {
  min-height: 100%;
  position: relative;
  .home-t {
    width: 1200px;
    margin: auto;
    margin-top: 28px;
    ul {
      display: flex;
      justify-content: flex-end;
      li {
        margin-left: 10px;
        .el-select {
          width: 180px;
        }
      }
    }
    span {
      font-size: 14px;
      font-weight: 400;
      color: #12022f;
      padding: 0 10px;
    }
    div {
      //padding: 9px 22px;
      //margin-right: 16px;
      //border-radius: 6px;
      //border: 1px solid #C4C0CB;
      font-size: 16px;
      text-align: center;
      font-weight: 400;
      color: rgba(196, 192, 203, 1);
      i {
        margin-left: 10px;
      }
    }
    .active {
      color: rgba(115, 36, 254, 1);
      border: 1px solid rgba(115, 36, 254, 1);
    }
    .home-t-b {
      display: flex;
      justify-content: center;
      align-items: center;
      border: #c4c0cb 1px solid;
      padding: 9px 22px;
      border-radius: 6px;
      margin-right: 15px;
      cursor: pointer;
      .text {
        font-weight: 400;
      }
      .sort-flag {
        display: flex;
        margin-left: 10px;
        &:before {
          content: "";
          display: block;
          background: url("~@/assets/img/sort-item-gray.svg") no-repeat center
            center/9px 16px;
          width: 9px;
          height: 16px;
        }
        &:after {
          content: "";
          display: block;
          background: url("~@/assets/img/sort-item-gray.svg") no-repeat center
            center/9px 16px;
          width: 9px;
          height: 16px;
          transform: rotate(180deg);
        }
      }
      &.active,
      &.esc {
        border-color: #7324fe;
        .text {
          color: #7324fe;
        }
        .sort-flag {
          &:before {
            background-image: url("~@/assets/img/sort-item.svg");
          }
        }
      }
      &.active,
      &.desc {
        border-color: #7324fe;
        .text {
          color: #7324fe;
        }
        .sort-flag {
          &:after {
            background-image: url("~@/assets/img/sort-item.svg");
          }
        }
      }
      &:hover {
        border-color: #7324fe;
        .text {
          color: #7324fe;
        }
        .sort-flag {
          &:before,
          &:after {
            background-image: url("~@/assets/img/sort-item.svg");
          }
        }
      }
    }
  }
  .home-box-3 {
    display: flex;
    //justify-content: space-between;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 1200px;
    margin: auto;
    margin-bottom: 93px;
    min-height: calc(100vh - 417px);
    .card {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      margin: 15px 0;
      li {
        width: 24%;
        border-radius: 2px;
        overflow: hidden;
        margin-right: 1.25%;
        margin-bottom: 15px;
        cursor: pointer;
        .img-container {
          height: 288px;
          background: #f5f5f5;
          overflow: hidden;
          .el-image {
            height: 100%;
            width: 100%;
            border-radius: 2px;
            transition: all 0.2s ease;
            &:hover {
              // transform: translateY(-8px);
              transform: scale(1.1);
            }
          }
        }
        &:hover {
          .img-container {
            img {
              transform: translateY(-8px);
            }
          }
        }
        h4 {
          font-size: 15px;
          display: flex;
          justify-content: space-between;
          line-height: 28px;
          & > span:last-child {
            font-size: 13px;
            font-weight: normal;
          }
        }
        .gray {
          color: #666;
        }
        p {
          display: flex;
          justify-content: space-between;
          line-height: 24px;
          & > span {
            display: flex;
            align-items: center;
            font-weight: 600;
            font-size: 14px;
          }
          .Owner {
            color: #666;
            font-weight: 500;
          }
        }
        img {
          width: 20px;
        }
        //票数 进度条
        .progress-container {
          p {
            span {
              color: #0092bf;
              font-size: 16px;
            }
            .defuse-count {
              color: #e16b2e;
            }
          }
          .progress {
            width: 100%;
            display: flex;
            align-items: center;
            background: #e16b2e;
            span {
              height: 7px;
              display: inline-block;
              background: #0092bf;
            }
          }
        }
        //状态和收藏爱心
        .status-Collect {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          img {
            width: 25px;
            transform: translateY(40px);
            transition: all 0.5s ease;
          }
          p {
            span {
              color: #00a000;
              &.closed {
                color: #333;
              }
            }
          }
        }
        &:hover {
          .status-Collect {
            img {
              filter: opacity(0.7);
              transform: translateY(0px);
              &:hover {
                filter: opacity(1);
              }
            }
          }
        }
      }
      li:nth-child(4n + 4) {
        margin-right: 0;
      }
    }
  }
}
.actions {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  .btn {
    border-radius: 10em;
    height: 44px;
    line-height: 24px;
    padding: 10px 20px;
    border: transparent 1px solid;
    text-align: center;
    min-width: 120px;
    cursor: pointer;
    &.nft-btn {
      background: #ffdda9;
      color: #000;
      font-size: 16px;
      border-color: #ffdda9;
    }
    &.nft-btn-default {
      border-color: #dcdcdc;
    }
    &:hover {
      opacity: 0.6;
    }
  }
}
.sell-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  .icon {
    width: 46px;
    height: 46px;
    margin-right: 20px;
  }
  .sellprice {
    background: url("~@/assets/img/shopcart.svg") no-repeat left center/15px
      14px;
    padding-left: 25px;
    font-size: 14px;
  }
  .nft-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .circle-nft {
      background: #f1f1f1 url("~@/assets/img/nft.svg") no-repeat center
        center/60% 60%;
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
    .num {
      font-size: 28px;
      color: #841ae9;
      margin-left: 10px;
    }
  }
}
.nodata {
  min-height: calc(100vh - 300px);
  .img {
    width: 357px;
    height: 281px;
    display: block;
    margin: 0px auto 0;
  }
}
</style>
<style>
.el-select-dropdown__wrap {
  max-height: 380px;
}
</style>