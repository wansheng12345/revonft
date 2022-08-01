<template>
  <div>
    <div v-show="!show">
      <el-dialog
        :visible="visible"
        :close-on-click-modal="false"
        width="500px"
        custom-class="nft-dialog"
        @close="closeDialog"
        :title="$t('lang.saleDetails')"
      >
        <div class="nft-dialog-body">
          <div class="subtitle">{{ $t("lang.flxedPrice") }}</div>
          <div class="desc">{{ $t("lang.soldPrice") }}</div>
          <div class="value-mod">
            <div class="hd">{{ $t("lang.Priced") }}</div>
            <div class="bd">
              <div class="original-value">
                <el-input
                  class="custom-input"
                  :class="{ gray: Price == 0 }"
                  v-model="Price"
                  placeholder="0"
                  @input="checkPrice"
                >
                  <span
                    slot="suffix"
                    style="display: block; color: #606266; margin-top: 10px"
                    >Eth</span
                  >
                </el-input>
                <!-- <div class="value">1</div>
							<div class="unit">Eth</div> -->
              </div>
              <div class="value-item">
                <div class="item-title">{{ $t("lang.nftLevelUp") }} (10%)</div>
                <div class="item-val">
                  -{{ Number(Price / 10).toFixed(4) }} eth
                </div>
              </div>
              <div class="value-item">
                <div class="item-title">{{ $t("lang.fee") }}</div>
                <div class="item-val">-{{ (Price / 20).toFixed(4) }} eth</div>
              </div>
              <div class="value-item">
                <div class="item-title">{{ $t("lang.recieved") }}</div>
                <div class="item-val">
                  <span class="num">{{ (Price * 0.85).toFixed(2) }}</span> eth
                </div>
              </div>
            </div>
            <div class="ft">
              <el-button
                class="btn-nft"
                @click="submit"
                :disabled="isPosting"
                >{{ $t("lang.postListing") }}</el-button
              >
            </div>
          </div>
        </div>
        <weberr :show="weberr" :closeable="true"></weberr>
      </el-dialog>
    </div>
    <!-- 授权步骤 -->
    <el-dialog
      :visible="show"
      :close-on-click-modal="false"
      width="550px"
      custom-class="nft-dialog"
      @close="closeDialog2"
      title="Complete your listing"
    >
      <div class="section">
        <div class="header">
          <div class="left">
            <img :src="base + item.Path" />
            <p>
              <span>{{ item.Title }}</span>
              <span>#{{ item.TokenID }}</span>
            </p>
          </div>
          <div class="right">
            Price <img :src="require('@/assets/img/nft.svg')" class="icon" />
            {{ item.Amount }}
          </div>
        </div>
        <div class="step">
          <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                <div class="row">
                  <i class="el-icon-loading" v-if="!isAuthor"></i>
                  <i class="el-icon-success" v-else></i>
                  Approve NFT
                </div>
              </template>
              <div class="desc">
                In order to transfer the NFT，you must approve this item for
                sale
              </div>
            </el-collapse-item>
            <div class="row rows">
              <i class="el-icon-loading" v-if="isAuthor"></i>
              <span class="number" v-else>2</span>
              Confirm listing
            </div>
          </el-collapse>
        </div>
      </div>
    </el-dialog>
    <MetaMaskError ref="MetaMaskError"></MetaMaskError>
  </div>
</template>

<script>
import request from "../../../services/request";
import ad from "../../../utils/web3Helper";
import market from "../../../utils/market";
import weberr from './../../modules/weberr.vue';
import MetaMaskError from "./../../../components/MetaMaskError.vue";
import { BASE_V_API } from "@/config/env";
export default {
  name: "saledetailDialog",
  data() {
    return {
      visible: false,
      item: {},
      Price: null,
      weberr: false,
      show: false,
      base: "",
      isAuthor: false,
      address: "",
    };
  },
  components: {
    MetaMaskError,
    weberr
  },
  computed: {
    isPosting: function () {
      if (this.Price != null && this.Price != 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    this.base = BASE_V_API;
    this.address =this.$store.getters.address;
  },
  methods: {
    submit() {
      this.show = true;
      // this.weberr = true;
      var that = this;
      this.Price = String(this.Price);
      market.getAuthor(this.item.TokenID, (res) => {
        this.isAuthor = res;
        console.log(res);
        if (res) {
          console.log("已经授权了，直接交易");
          this.send();
        } else {
          market.author(this.item.TokenID, (response) => {
            if (response) {
              this.isAuthor = true;
              console.log("授权后再次发送交易");
              setTimeout(() => {
                this.send();
              }, 3000);
            } else {
              this.$refs.MetaMaskError.show = true;
              this.show = false;
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
          this.$refs.MetaMaskError.open();
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
      console.log(this.item);
      this.visible = true;
    },
    closeDialog() {
      this.Price = '';
      this.visible = false;
    },
    checkPrice(value) {
      value = value.replace(/[^0-9.]/g, "");
      this.Price = value.replace(/^(\-)*(\d+)\.(\d\d\d\d).*$/, "$1$2.$3");
    },
    closeDialog2() {
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.section {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 1px solid #ccc;
    padding-bottom: 15px;
    .left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        line-height: 30px;
        font-size: 16px;
      }
      img {
        width: 40px;
        border-radius: 4px;
        margin-right: 10px;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 12px;
        margin: 0 5px;
      }
    }
  }
  .row {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;

    i {
      font-size: 24px;
      margin-right: 5px;
      // color:rgb(19, 206, 102);
      &.el-icon-success {
        color: rgb(19, 206, 102);
      }
    }
    .number {
      border: 1px solid #ccc;
      border-radius: 100%;
      line-height: 22px;
      padding: 2px 9px;
      margin-right: 5px;
    }
  }
  .rows {
    line-height: 45px;
    color: #888;
  }
  .desc {
    font-size: 14px;
  }
}
/deep/.nft-dialog {
  border-radius: 40px;
  .el-dialog__header {
    padding: 30px 30px 15px;
    .el-dialog__title {
      font-size: 36px;
      font-weight: 800;
      line-height: 50px;
    }
    .el-dialog__headerbtn {
      width: 48px;
      height: 48px;
      .el-dialog__close {
        background: url("~@/assets/img/close.svg") no-repeat center center/cover;
        width: 48px;
        height: 48px;
        transition: all 0.5s;
        cursor: pointer;
        &:before {
          content: "";
        }
        &:hover {
          transform: rotate(180deg);
        }
      }
    }
  }
  .el-dialog__body {
    padding: 10px 40px 40px;
  }

  .nft-dialog-body {
    .subtitle {
      font-weight: 800;
      font-size: 18px;
      line-height: 25px;
      padding: 5px 0;
    }
    .desc {
    }
    .value-mod {
      margin: 25px 0 0;
      padding: 15px 0 0;
      border-top: #dcdcdc 1px solid;
      .hd {
        font-weight: 800;
        font-size: 16px;
        padding: 10px 0 15px;
      }
      .bd {
        .original-value {
          background: rgba(231, 229, 234, 0.3);
          border-radius: 10em;
          height: 56px;
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
        padding: 40px 40px 10px;
        .btn-nft {
          height: 56px;
          border-radius: 10em;
          text-align: center;
          background: #ffdda9;
          border-color: #ffdda9;
          color: #000;
          font-size: 16px;
          line-height: 26px;
          padding: 15px 0;
          cursor: pointer;
          width: 100%;
          box-sizing: border-box;
          &:hover {
            opacity: 0.6;
          }
          &.is-disabled {
            opacity: 0.6;
            color: #999;
          }
        }
      }
    }
  }
}
.custom-input {
  flex-grow: 1;
  /deep/.el-input__inner {
    background: transparent;
    border: 0 none;
    padding: 0 5px;
    text-align: left;
  }
  &.gray {
    /deep/.el-input__inner {
      color: #aaa;
    }
  }
}
</style>
