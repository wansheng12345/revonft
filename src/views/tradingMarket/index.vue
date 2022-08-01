<template>
  <div class="home-index">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="2"></Header>
    </div>
    <div class="nodata" v-if="data == null || data.length == 0">
      <img :src="require('@/assets/img/nodata_market.png')" class="img" />
    </div>
    <div class="home-1" v-if="data.length > 0">
      <div class="home-n">
        {{ resultsInit(results) }} <span>{{ $t("lang.results") }}</span>
      </div>
      <div class="home-t">
        <span>{{ $t("lang.SortedBy") }}:</span>
        <div class="home-t-b">
          <el-select
            placeholder="Select"
            v-model="sort"
            @change="selectChanged"
          >
            <el-option label="Recently Listed" :value="5"></el-option>
            <el-option label="Price: Low to High" :value="1"></el-option>
            <el-option label="Price: High to Low" :value="2"></el-option>
            <el-option label="Bound Value: Low to High" :value="3"></el-option>
            <el-option label="Bound Value: High to Low" :value="4"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div
      class="home-box-3"
      v-loading="loading"
      v-if="data != null && data.length > 0"
    >
      <ul class="card">
        <li v-for="(v, index) in data" :key="'item_' + index">
          <div class="img-container" @click="toDetail(v.TokenID)">
            <el-image :src="base + v.Path" lazy fit="contain"></el-image>
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
          <div class="hr"></div>
          <!-- 价格 -->
          <div class="sell-price">
            <span>Sell Price :</span>
            <p>
              <img src="@/assets/img/icon.png" alt="" />
              <span>{{ v.Price }}</span>
            </p>
          </div>
          <!-- 收藏 -->
          <div class="Collect">
            <p>
              <span @click="handleClick(v)">{{
                v.isSame ? "Cancel" : "Buy Now"
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
    <cancel-dialog
      ref="cancelDialog"
      @fail="openFail"
      @offWeberr="offWeberr"
    ></cancel-dialog>
    <purchaseDialog
      ref="purchaseDialog"
      @fail="openFail"
      @offWeberr="offWeberr"
      @reload="reload"
    ></purchaseDialog>
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
import purchaseDialog from "./../modules/purchaseDialog.vue";
import cancelDialog from "@/views/modules/cancelDialog";
import moment from "moment";
import { mapState } from "vuex";
export default {
  name: "home",
  data() {
    return {
      loading: false,
      data: [],
      results: "",
      base: "",
      select: "",
      sort: 5,
    };
  },
  computed: {
    ...mapState(["address"]),
  },
  created() {
    this.loadData();
  },
  methods: {
    moment,
    handleClick(item) {
      let token = sessionStorage.getItem("Token");
      if (this.address == "") {
        this.$refs.showMetamask.show = true;
      } else if (!token) {
        sessionStorage.setItem("iSsignature", false);
        this.getSign();
      } else {
        if (item.isSame) {
          //isSame 是自己的就取消出售
          this.$refs.cancelDialog.TradeId = item.TradeId;
          this.$refs.cancelDialog.openDialog();
        } else {
          //不是自己的就购买
          this.$refs.purchaseDialog.TradeId = item.TradeId;
          this.$refs.purchaseDialog.title = item.Title;
          this.$refs.purchaseDialog.price = item.Price;
          this.$refs.purchaseDialog.path = this.base + item.Path;
          this.$refs.purchaseDialog.isVideo = item.isVideo;
          this.$refs.purchaseDialog.openDialog();
        }
      }
    },
    resultsInit(number) {
      let nf = new Intl.NumberFormat("en-US");
      return nf.format(number);
    },
    selectChanged(value) {
      this.sort = value;
      this.loadData();
    },
    toDetail(tokenID) {
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
        var that = this;
        if (item.IsCollect == true) {
          request.delMyCollect(para).then((response) => {
            if (response.code == 200) {
              item.IsCollect = !item.IsCollect;
              // that.loadData();
            }
          });
        } else {
          request.addMyCollect(para).then((response) => {
            if (response.code == 200) {
              item.IsCollect = !item.IsCollect;
              // that.loadData();
            }
          });
        }
      }
    },
    loadData() {
      this.loading = true;
      this.base = BASE_V_API;
      const params = {
        key: this.address || '',
        page: 1,
        page_size: 100,
        typa: 1,
        sort: this.sort,
      };
      request.getMarket(params).then((response) => {
        if (response.code == 200) {
          this.data = response.data;
          this.data.forEach((item, index) => {
            this.data[index].Price = ad.fromWei(this.data[index].Price);
            this.data[index].Amount = ad.fromWei(this.data[index].Amount);
            if (item.Owner.toLowerCase() == this.address) {
              item.isSame = true;
            } else {
              item.isSame = false;
            }
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
          console.log(this.data);
          this.results = this.data.length;
          this.loading = false;
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    openFail(data) {
      this.weberr = false;
      console.log("data", data);
      this.$refs.failDialog.title = data.title;
      this.$refs.failDialog.descriptionText = data.desc;
      this.$refs.failDialog.openDialog();
    },
    reload(data) {
      // if (data == true) {
      //   this.userVoted = data;
      //   console.log("userVoted: " + this.userVoted);
      // }
      location.reload();
    },
    offWeberr() {
      location.reload();
    },
  },
  components: {
    Header,
    Footer,
    purchaseDialog,
    cancelDialog,
  },
};
</script>

<style lang="less" scoped>
.home-index {
  min-height: 100%;
  position: relative;

  .home-1 {
    display: flex;
    width: 1200px;
    margin: auto;
    justify-content: space-between;
    margin-top: 28px;

    .home-n {
      padding: 9px 0;
      font-size: 20px;
      color: #12022f;
      font-weight: 700;
      span {
        font-size: 16px;
        font-weight: 400;
      }
    }

    .home-t {
      display: flex;
      justify-content: flex-end;

      // width: 1200px;
      // margin: auto;
      // margin-top: 28px;
      span {
        font-size: 14px;
        font-weight: 400;
        color: #12022f;
        padding: 9px 22px;
      }
    }
  }

  .home-box-3 {
    display: flex;
    //justify-content: space-between;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    width: 1200px;
    margin: 0 auto;
    min-height: calc(100vh - 328px);
    .card {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      margin: 15px 0;
      width: 100%;
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
              transform: scale(1.1);
            }
          }
          // img {
          //   object-fit: cover;
          //   height: 100%;
          //   width: 100%;
          //   border-radius: 2px;
          //   transition: all 0.2s ease;
          // }
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
        .hr {
          margin: 6px 0;
          height: 1px;
          width: 100%;
          background: #ebebeb;
        }
        .sell-price {
          display: flex;
          font-size: 14px;
          align-items: center;
          margin-bottom: 2px;
          span {
            color: #333333;
          }
          p {
            display: flex;
            align-items: center;
            img {
              width: 20px;
              margin: 0 5px;
            }
            span {
              font-size: 18px;
              color: #264bae;
            }
          }
        }
        .Collect {
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform: translateY(23px);
          transition: all 0.2s ease;
          color: #2d4dbd;
          span {
            &:hover {
              color: #30407c;
            }
          }
          img {
            width: 25px;
            filter: opacity(0.7);
            &:hover {
              filter: opacity(1);
            }
          }
        }
        &:hover {
          .Collect {
            transform: translateY(0px);
          }
        }
      }
      li:nth-child(4n + 4) {
        margin-right: 0;
      }
    }
  }
}

.nodata {
  min-height: calc(100vh - 235px);
  .img {
    width: 208px;
    height: 239px;
    display: block;
    margin: 1.5% auto 0;
  }
}
</style>
