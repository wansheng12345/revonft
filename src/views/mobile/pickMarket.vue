<template>
  <div class="mobile-container">
    <Header custom-active="1"></Header>
    <div class="list-container">
      <div class="tools">
        <div @click="handleFilter">
          <span>{{ FilterList[Filter].name }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div @click="Sorted">
          <span>{{ sortList[sort].name }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <div class="list-wrapper">
        <div class="item" v-for="(item, index) in data" :key="'item_' + index">
          <div class="item-thumbnail">
            <el-image
              :src="base + item.Path"
              class="img"
              lazy
              fit="cover"
              @click="toDetail(item.TokenID)"
            ></el-image>
            <!-- <div class="progress-container">
              <div class="progress-wrapper">
                <div class="progress-look look-smile"></div>
                <div class="progress-box">
                  <div class="progress-text">
                    <div class="text left">{{ item.ApproveCount }}</div>
                    <div class="text right">{{ item.DefuseCount }}</div>
                  </div>
                  <div class="progress">
                    <div
                      class="progress-bar"
                      v-bind:style="'width:' + item.Rate * 100 + '%'"
                    ></div>
                  </div>
                </div>
                <div class="progress-look look-angry"></div>
              </div>
            </div> -->
          </div>
          <div class="item-info">
            <h4>
              <span class="bold">{{ item.Title }}</span>
              <span class="gray">Bound-Value</span>
            </h4>
            <p class="row">
              <span>{{
                item.Owner.substr(0, 6) +
                "...." +
                item.Owner.substr(item.Owner.length - 6, 8)
              }}</span>
              <span class="bold"
                ><img src="@/assets/img/icon.png" alt="" />{{
                  item.Amount
                }}</span
              >
            </p>
            <!-- 投票占比 -->
            <div class="progress-container">
              <p>
                <span>{{ item.ApproveCount }}</span>
                <span class="defuse-count">{{ item.DefuseCount }}</span>
              </p>
              <div class="progress">
                <span
                  class="progressing"
                  v-bind:style="'width:' + item.Rate * 100 + '%'"
                >
                </span>
              </div>
            </div>
            <!-- 是否关闭 -->
            <div class="status">
              <span
                :class="{ closed: Timestatus(item.StartGame) === 'Closed' }"
                >{{ Timestatus(item.StartGame) }}</span
              >
            </div>
          </div>
        </div>
        <div class="nodata" v-if="data == null || data.length == 0">
          <img :src="require('@/assets/img/nodata_opting.png')" class="img" />
        </div>
      </div>
    </div>
    <Footer></Footer>
    <select-popover
      @close="handleClose"
      @change="handleChange"
      :show="visible"
      :List="isFilter ? FilterList : sortList"
      :active="isFilter ? Filter : sort"
      :size="isFilter ? '200px' : '280px'"
      :name="true"
    ></select-popover>
  </div>
</template>
<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import request from "../../services/request";
import { BASE_V_API } from "@/config/env";
import ad from "../../utils/web3Helper.js";
import moment from "moment";
import selectPopover from "@/components/mobile/select-popover.vue";
import { mapState } from "vuex";
export default {
  name: "pickMarket-m",
  data() {
    return {
      Filter: 0, //1: 按价格排序 2：总参与人数 3：阵营差值 4：我收藏的(key 需要传入当前地址) 5；即将结束的
      FilterList: [
        { name: "All", value: 1 },
        { name: "Active", value: 2 },
        { name: "Closed", value: 3 },
        { name: "Ending Soon", value: 4 },
        { name: "Liked", value: 5 },
      ],
      sort: 1,
      sortList: [
        { name: "Volume:Low to High", value: 1 },
        { name: "Volume:High to Low", value: 2 },
        { name: "Bound Value:Low to High", value: 3 },
        { name: "Bound Value:High to Low", value: 4 },
        { name: "Difference in votes:Low to High", value: 5 },
        { name: "Difference in votes:High to Low", value: 6 },
        { name: "Recently listed", value: 7 },
      ],
      data: [],
      activeName: "1",
      base: "",
      loading: false,
      visible: false,
      isFilter: true,
    };
  },
  computed: {
    ...mapState(["address"]),
  },
  components: {
    Header,
    Footer,
    selectPopover,
  },
  created() {
    this.loadData();
  },
  methods: {
    Timestatus(startTime) {
      let endTime = moment(startTime).valueOf() + 600 * 1000; //游戏结束时间
      let time = endTime - new Date().getTime(); //获取当前时间
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
    handleFilter() {
      this.visible = true;
      this.isFilter = true;
    },
    Sorted() {
      this.visible = true;
      this.isFilter = false;
    },
    handleClose() {
      this.visible = false;
    },
    showDrawer() {
      if (this.data.length == 0) return;
      this.visible = true;
    },
    handleChange(i) {
      if (this.isFilter) {
        this.Filter = i;
      } else {
        this.sort = i;
      }
      this.visible = false;
      this.loadData();
    },
    toDetail(tokenID) {
      this.$router.push({ name: "nftDetail-m", query: { tokenID: tokenID } });
    },
    loadData() {
      this.base = BASE_V_API;
      this.showLoading()
      const params = {
        key: this.address || "",
        page: 1,
        page_size: 100,
        typa: 3,
        typa: this.Filter + 1,
        sort: this.sort + 1,
      };
      request.getOpting(params).then((response) => {
        if (response.code == 200) {
          this.loading.close();
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
          });
        } else {
          this.loading.close();
          this.$message.error(response.msg);
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
};
</script>
<style lang="less" scoped>
.list-container {
  min-height: calc(100vh - 260px);
  .tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 10px 15px;
    div {
      width: 48%;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid #ccc;
      span {
        margin-right: 5px;
        color: #666;
      }
    }
  }
  .list-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 0 5px 20px;
    .item {
      padding: 4px;
      width: 50%;
      .item-thumbnail {
        position: relative;
        width: 100%;
        padding: 3px;
        height: 261px;
        border-radius: 8px;
        box-sizing: border-box;
        .el-image {
          height: 100%;
          width: 100%;
          border-radius: 2px;
          transition: all 0.2s ease;
        }
        // .img {
        //   height: 100%;
        //   // width: 98%;
        //   border-radius: 8px;
        //   object-fit: cover;
        // }
        .img-wrap {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 100%;
          object-fit: cover;
          width: 100%;
        }
        .trunk-num {
          position: absolute;
          font-size: 12px;
          color: #841ae9;
          z-index: 1;
          right: 10px;
          bottom: 3px;
          text-align: right;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 45%;
        }
        .progress-container {
          //padding:20px 0;
          position: absolute;
          background: #fff;
          border-radius: 4px;
          left: 10%;
          right: 10%;
          bottom: 10%;
          padding: 5px;
          .progress-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .progress-look {
              width: 21px;
              height: 21px;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: contain;
              &.look-smile {
                background-image: url("~@/assets/img/icon-sm.svg");
              }
              &.look-angry {
                background-image: url("~@/assets/img/icon-k.svg");
              }
            }
            .progress-box {
              flex-grow: 1;
              margin: 0 5px;
              .progress-text {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 2px;
                .text {
                  font-size: 10px;
                  position: relative;
                  padding-bottom: 2px;
                  &:before {
                    content: "";
                    display: block;
                    width: 6px;
                    height: 2px;
                    border-radius: 10em;
                    position: absolute;
                    bottom: 0;
                  }
                  &.left {
                    color: #841ae9;
                    &:before {
                      background: #e9daff;
                    }
                  }
                  &.right {
                    color: #fbad34;
                    &:before {
                      background: #ffe8c3;
                      right: 0;
                    }
                  }
                }
              }
              .progress {
                background: #fbad34;
                height: 3px;
                .progress-bar {
                  background: #841ae9;
                  height: 3px;
                  position: relative;
                  &:after {
                    content: "";
                    width: 1px;
                    height: 5px;
                    top: -1px;
                    background: #000;
                    position: absolute;
                    right: 0;
                    display: block;
                  }
                }
              }
            }
          }
        }
      }
      .item-info {
        font-size: 12px;
        color: #666;
        h4 {
          font-weight: 400;
        }
        .bold {
          font-size: 13px;
          color: #000;
          font-weight: 700;
          display: flex;
          align-items: center;
          img {
            width: 20px;
          }
        }
        .row,
        h4 {
          line-height: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        //票数 进度条
        .progress-container {
          p {
            display: flex;
            align-items: center;
            justify-content: space-between;
            line-height: 24px;
            span {
              color: #0092bf;
              font-size: 14px;
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
              height: 5px;
              display: inline-block;
              background: #0092bf;
            }
          }
        }
        .status {
          line-height:25px;
          span {
            color: #00a000;
            font-weight: 600;
            font-size: 13px;
            &.closed {
              color: #333;
            }
          }
        }
      }
    }
  }
  .nodata {
    height: calc(100vh - 350px);
  }
}
/deep/.sort-drawer {
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

.btn {
  display: inline-block;
  border: #ccc 1px solid;
  font-size: 16px;
  line-height: 26px;
  padding: 8px 20px;
  border-radius: 4px;
  color: #000;
  text-align: center;
  min-width: 130px;
  &.btn-rounded {
    border-radius: 10em;
  }
  &.btn-nft {
    background: #ffdda9;
    border-color: #ffdda9;
    color: #000;
  }
}
</style>
<style>
.el-loading-spinner i {
  color: #dadce6;
  font-size: 30px;
}
.el-loading-spinner .el-loading-text {
  color: #dadce6;
  margin-top: 5px;
}
</style>