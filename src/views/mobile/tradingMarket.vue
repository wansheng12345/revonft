<template>
  <div class="mobile-container">
    <Header custom-active="2"></Header>
    <div class="list-container">
      <div class="tools">
        <div class="result">{{ data.length }} {{ $t("lang.results") }}</div>
        <div class="sort" @click="sortBy">
          <span>{{ sortList[sort].name }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <ul class="list-wrapper">
        <li class="item" v-for="(item, index) in data" :key="'item_' + index">
          <div class="item-thumbnail">
            <img
              class="img"
              @click="toDetail(item.TokenID)"
              :src="base + item.Path"
            />
          </div>
          <div class="item-info">
            <h4>
              <span class="bold">{{ item.Title }}</span>
              <span class="gray">Bound-Value</span>
            </h4>
            <p class="row">
              <span class="Owner">{{
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
            <div class="hr"></div>
            <ul class="price-btn">
              <li>
                <!-- 价格 -->
                <div class="sell-price">
                  <span>Sell Price :</span>
                  <p>
                    <img src="@/assets/img/icon.png" alt="" />
                    <span>{{ item.Price }}</span>
                  </p>
                </div>
              </li>
              <li>
                <span
                  class="btns"
                  @click="handleClick(item)"
                  :class="{ cancel: item.isSame }"
                  >{{ item.isSame ? "Cancel" : "Buy Now" }}</span
                >
              </li>
            </ul>
          </div>
        </li>
        <li v-if="data == null || data.length == 0" class="noData">
          <img :src="require('@/assets/img/nodata_market.png')" class="img" />
        </li>
      </ul>
    </div>
    <Footer></Footer>
    <select-popover
      @close="handleClose"
      @change="handleChange"
      :show="visible"
      :List="sortList"
      :active="sort"
      size="200px"
      :name="true"
    ></select-popover>
    <!-- 取消销售 -->
    <Cancel
      :ShowTooltip="ShowCancel"
      :TradeId="TradeId"
      @closeTooltip="closeTooltip"
    ></Cancel>
    <connectMetamask ref="showMetamask"></connectMetamask>
  </div>
</template>
<script>
import Header from "@/components/mobile/header";
import Footer from "@/components/mobile/footer";
import request from "../../services/request";
import { BASE_V_API } from "@/config/env";
import ad from "../../utils/web3Helper.js";
import selectPopover from "@/components/mobile/select-popover.vue";
import Cancel from "@/components/mobile/cancel.vue";
import market from "@/utils/market";
import { mapState } from "vuex";
export default {
  name: "tradingMarket-m",
  data() {
    return {
      data: [],
      sortList: [
        {
          name: "Recently Listed",
          id: 5,
        },
        {
          name: "Price: Low to High",
          id: 1,
        },
        {
          name: "Price: High to Low",
          id: 2,
        },
        {
          name: "Bound Value: Low to High",
          id: 3,
        },
        {
          name: "Bound Value: High to Low",
          id: 4,
        },
      ],
      base: "",
      sort: 0,
      visible: false,
      loading: false,
      ShowCancel: false,
      TradeId: "",
    };
  },
  components: {
    Header,
    Footer,
    selectPopover,
    Cancel,
  },
  created() {
    this.loadData();
  },
  computed: {
    ...mapState(["address"]),
  },
  methods: {
    //关闭弹窗
    closeTooltip() {
      this.ShowCancel = false;
    },
    handleClick(item) {
      let token = this.getStorageToken();
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        if (item.isSame) {
          //isSame 是自己的就取消出售
          this.TradeId = item.TradeId;
          this.ShowCancel = true;
        } else {
          //不是自己的就购买
           this.showLoading()
          market.buy(
            item.TradeId,
            item.Price,
            (result) => {
              this.loading.close();
              setTimeout(() => {
                location.reload();
              }, 3000);
            },
            (err) => {
              this.loading.close();
              console.log(err);
            }
          );
        }
      }
    },
    handleClose() {
      this.visible = false;
    },
    handleChange(i) {
      this.sort = i;
      this.loadData();
      this.visible = false;
    },
    sortBy() {
      this.visible = true;
    },
    toDetail(tokenID) {
      this.$router.push({ name: "nftDetail-m", query: { tokenID: tokenID } });
    },
    loadData() {
      this.showLoading()
      this.base = BASE_V_API;
      const params = {
        key: this.address || "",
        page: 1,
        page_size: 100,
        typa: 1,
        sort: this.sortList[this.sort].id,
      };
      request.getMarket(params).then((response) => {
        if (response.code == 200) {
          this.loading.close();
          this.data = response.data || [];
          this.data.forEach((item, index) => {
            this.data[index].Price = ad.fromWei(this.data[index].Price);
            this.data[index].Amount = ad.fromWei(this.data[index].Amount);
            if (item.Owner.toLowerCase() == this.address.toLowerCase()) {
              item.isSame = true;
            } else {
              item.isSame = false;
            }
          });
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
    padding: 20px 20px 15px;
    .filters {
    }
    .settings {
      .icon {
        width: 24px;
        height: 24px;
      }
    }
  }
}
.sort {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  span {
    margin-right: 5px;
    color: #666;
  }
}
.list-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  padding: 0 5px 20px;
  .item {
    width: 48%;
    .item-thumbnail {
      position: relative;
      width: 100%;
      height: 261px;
      box-sizing: border-box;
      .img {
        display: block;
        border-radius: 2px;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .trunk-num {
        position: absolute;
        font-size: 12px;
        color: #841ae9;
        z-index: 1;
        right: 4px;
        bottom: 1px;
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 45%;
        line-height: 22px;
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
      .hr {
        margin: 6px 0;
        height: 1px;
        width: 100%;
        background: #ebebeb;
      }
      .price-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        li {
          line-height: 30px;
        }
        .sell-price {
          display: flex;
          font-size: 12px;
          align-items: center;
          margin-bottom: 2px;
          span {
            color: #333333;
          }
          p {
            display: flex;
            align-items: center;
            img {
              width: 16px;
            }
            span {
              font-size: 14px;
              color: #264bae;
              font-weight: 700;
            }
          }
        }
        .btns {
          background: #ffdda9;
          color: #12022f;
          padding: 4px 6px;
        }
        .cancel {
          background: #999;
          color: #fff;
        }
      }
    }
  }

  .noData {
    width: 100%;
    height: calc(100vh - 350px);
    text-align: center;
    img {
      width: 50%;
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