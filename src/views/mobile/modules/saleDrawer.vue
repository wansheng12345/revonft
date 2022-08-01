<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      direction="btt"
      custom-class="custom-drawer"
      :with-header="false"
    >
      <div class="sale-container">
        <div class="hd">
          <div class="title">{{ $t("lang.saleDetails") }}</div>
        </div>
        <div class="bd">
          <div class="desc">
            <div class="item-title">{{ $t("lang.flxedPrice") }}</div>
            <div class="item-content">{{ $t("lang.soldPrice") }}</div>
          </div>
          <div class="value-mod">
            <div class="hd">{{ $t("lang.Priced") }}</div>
            <div class="bd">
              <div class="original-value">
                <el-input
                  class="custom-input"
                  v-model="Price"
                  placeholder="please enter the number"
                  @input="checkPrice"
                  maxlength="8"
                >
                  <span
                    slot="suffix"
                    style="display: block; margin-top: 10px; color: #606266"
                    >Eth</span
                  >
                </el-input>
              </div>
              <div class="value-item">
                <div class="item-title">{{ $t("lang.nftLevelUp") }}(10%)</div>
                <div class="item-val">-{{ (Price * 0.1).toFixed(2) }} eth</div>
              </div>
              <div class="value-item">
                <div class="item-title">{{ $t("lang.fee") }}</div>
                <div class="item-val">-{{ (Price * 0.05).toFixed(2) }} eth</div>
              </div>
              <div class="value-item">
                <div class="item-title">{{ $t("lang.recieved") }}</div>
                <div class="item-val">
                  <span class="num">{{ (Price * 0.85).toFixed(2) }}</span> eth
                </div>
              </div>
            </div>
            <div class="ft">
              <div
                class="btn btn-rounded btn-block btn-nft"
                :class="{ disable: !Price }"
                @click="submit"
              >
                {{ $t("lang.postListing") }}
              </div>
            </div>
          </div>
        </div>
        <!-- 失败弹窗 -->
        <Fail ref="failed"></Fail>
      </div>
    </el-drawer>
    <el-drawer
      :visible.sync="showStep"
      direction="btt"
      custom-class="step"
      :with-header="false"
    >
      <section>
        <h2>Complete your listing</h2>
        <div class="img-box">
          <img :src="base + item.Path" />
          <ul>
            <li><span>Title：</span>{{ item.Title }}</li>
            <li><span>TokenID：</span>#{{ item.TokenID }}</li>
            <li>
              <span>Value：</span>
              <p>
                <img :src="require('@/assets/img/nft.svg')" class="icon" />
                {{ item.Amount }}
              </p>
            </li>
          </ul>
        </div>
        <!-- 步骤 -->
        <div class="step-container">
          <div class="row">
            <i class="el-icon-loading" v-if="!isAuthor"></i>
            <i class="el-icon-success" v-else></i>
            Approve NFT
          </div>
          <p>
            In order to transfer the NFT，you must approve this item for sale
          </p>
          <div class="row">
            <i class="el-icon-loading" v-if="isAuthor"></i>
            <span class="number" v-else>2</span>
            Confirm listing
          </div>
        </div>
      </section>
    </el-drawer>
  </div>
</template>
<script>
import ad from "@/utils/web3Helper";
import market from "@/utils/market";
import Fail from "./Failed.vue";
import request from "../../../services/request";
import { BASE_V_API } from "@/config/env";
export default {
  name: "saleDrawer",
  data() {
    return {
      visible: false,
      base: "",
      Price: "",
      item: {},
      isAuthor: false,
      address: "",
      showStep: false,
    };
  },
  components: {
    Fail,
  },
  created() {
    this.base = BASE_V_API;
    this.address = this.$store.getters.address;
  },
  mounted() {},
  methods: {
    checkPrice(value) {
      value = value.replace(/[^0-9.]/g, "");
      this.Price = value.replace(/^(\-)*(\d+)\.(\d).*$/, "$1$2.$3");
    },
    submit() {
      if (!this.Price) return;
      this.showStep = true;
      this.Price = String(this.Price);
      market.getAuthor(this.item.TokenID, (res) => {
        this.isAuthor = res;
        console.log(res);
        if (res) {
          console.log("已经授权了，直接交易");
          this.send();
        } else {
          market.author(this.item.TokenID, (response) => {
            console.log(response);
            if (response) {
              this.isAuthor = true;
              console.log("授权后再次发送交易");
              setTimeout(() => {
                this.send();
              }, 3000);
            } else {
              console.log(response, 555);
              this.showStep = false;
            }
          });
        }
      });
    },
    send() {
      market.sell(
        this.item.TokenID,
        this.Price,
        (data) => {
          setTimeout(() => {
            location.reload();
          }, 2000);
          // that.$emit("offWeberr");
        },
        (err) => {
          this.$refs.failed.openDialog();
          this.show = false;
          // console.log(err)
          // var data = {
          //   title: that.$t("lang.failed"),
          //   desc: that.$t("lang.failedDesc"),
          // };
          // // that.weberr = false;
          // that.$emit("fail", data);
          // that.closeDialog();
        }
      );
    },
    openDialog() {
      this.visible = true;
    },
    closeDialog() {
      this.Price = "";
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .step {
  height: 460px !important;
  section {
    padding: 4px 8px;
    h2 {
      line-height: 40px;
      font-size: 22px;
      text-align: center;
    }
    .img-box {
      text-align: center;
      margin: 10px 0;
      display: flex;
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
      img {
        width: 40%;
        border-radius: 6px;
        margin-right: 5%;
        max-height: 200px;
      }
      ul {
        width: 50%;
        li {
          line-height: 40px;
          font-size: 15px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #eee;
          span {
            font-weight: 600;
          }
          p {
            display: flex;
            align-items: center;
            img {
              width: 16px;
            }
          }
        }
      }
    }
    .step-container {
      .row {
        display: flex;
        align-items: center;
        font-size: 16px;
        line-height: 45px;
        font-weight: 600;
        i {
          font-size: 24px;
          margin-right: 5px;
          &.el-icon-success {
            color: rgb(19, 206, 102);
          }
        }
      }
      p {
        font-size: 13px;
        color: #999;
        text-indent: 2em;
        margin-bottom: 10px;
      }
      .number {
        border: 1px solid #ccc;
        border-radius: 100%;
        line-height: 22px;
        padding: 2px 9px;
        margin-right: 5px;
      }
    }
  }
}
/deep/.custom-drawer {
  height: 460px !important;
}
.sale-container {
  padding: 30px 0 0;
  .hd {
    padding: 0 15px 10px;
    .title {
      font-size: 25px;
      line-height: 25px;
      font-weight: 600;
      color: #12022f;
    }
  }
  .bd {
    .desc {
      padding: 0 15px;
      .item-title {
        color: #12022f;
        line-height: 22px;
        font-weight: 600;
      }
    }
  }
}
.value-mod {
  margin: 25px 0 0;
  padding: 15px 15px 0;
  border-top: #dcdcdc 1px solid;
  .hd {
    font-weight: 800;
    padding: 10px 0 15px;
  }
  .bd {
    .original-value {
      background: #f5f5f5;
      border-radius: 25px;
      height: 50px;
      padding: 10px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 500;
      margin: 5px 0 10px;
    }
    .value-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      font-weight: 500;
      .num {
        font-size: 32px;
      }
    }
  }
  .ft {
    padding: 10px 0 10px;
    .btn-nft {
    }
  }
}
.custom-input {
  /deep/.el-input__inner {
    background: transparent;
    border: 0 none;
    padding: 0 5px;
  }
}
.choose-actions {
  padding: 0 30px 10px;
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
  &.btn-outline {
    background: transparent;
    &.btn-default {
      color: #fff;
    }
  }
  &.btn-block {
    display: block;
  }
  &.btn-nft {
    background: #ffdda9;
    border-color: #ffdda9;
    color: #000;
  }
  &.disable {
    background: #ccc;
    border-color: #bbb;
    color: #666;
  }
}
</style>
