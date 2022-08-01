<template>
  <div>
    <el-dialog
      :visible="visible"
      width="620px"
      custom-class="nft-dialog"
      :title="$t('lang.cancel')"
      :center="true"
      @close="closeDialog"
    >
      <div class="nft-dialog-body">
        <div class="subtitle">
          {{ $t("lang.cancelDesc") }}
        </div>
        <!-- <div class="desc">Increasing Prosperity With Positive Thinking</div> -->
      </div>
      <template slot="footer">
        <div class="nft-dialog-footer">
          <div class="nft-btn-default" @click="closeDialog">
            {{ $t("lang.think") }}
          </div>
          <div class="nft-btn" @click="cancelList">
            {{ $t("lang.cacelListing") }}
          </div>
        </div>
      </template>
      <weberr :show="weberr" :closeable="true"></weberr>
    </el-dialog>
  </div>
</template>

<script>
import ad from "../../utils/web3Helper";
import market from '../../utils/market';
import Weberr from "./weberr";
export default {
  name: "cancelDialog",
  data() {
    return {
      visible: false,
      email: "",
      description: "",
      TradeId: "",
      weberr: false,
    };
  },
  components: {
    Weberr,
  },
  mounted() {},
  methods: {
    cancelList() {
      this.weberr = true;
      var that = this;
      market.cancelSell(
        this.TradeId,
        function (result) {
          that.weberr = false;
          that.closeDialog();
          that.timer = setTimeout(that.callEmit, 3 * 1000);
        },
        function (err) {
          var data = {
            title: that.$t("lang.failed"),
            desc: that.$t("lang.failedDesc"),
          };
          console.log("cancelSell.err", err);
          that.weberr = false;
          that.$emit("fail", data);
        }
      );
    },
    callEmit() {
      location.reload();
      // this.$emit("offWeberr");
    },
    openDialog() {
      this.visible = true;
    },
    closeDialog() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
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
      font-size: 20px;
      line-height: 25px;
      border-bottom: #dcdcdc 1px solid;
      padding: 0 0 30px;
      word-wrap: normal !important;
    }
    .desc {
      text-align: center;
    }
  }
}
/deep/.el-dialog__footer {
  padding: 0px 50px 40px;
  .nft-dialog-footer {
    display: flex;
    justify-content: space-between;
  }
}
.nft-btn {
  height: 56px;
  border-radius: 10em;
  text-align: center;
  background: #ffdda9;
  color: #000;
  font-size: 16px;
  line-height: 26px;
  padding: 15px 60px;
  cursor: pointer;
  display: inline-block;
  font-weight: 800;
  &:hover {
    opacity: 0.6;
  }
  &.disabled,
  &.is-disabled,
  &.is-disabled:hover {
    opacity: 0.6;
    background: #ffdda9;
    color: #999;
    border-color: #ffdda9;
  }
}
.nft-btn-default {
  height: 56px;
  border-radius: 10em;
  border: #dcdcdc 1px solid;
  text-align: center;
  color: #000;
  font-size: 16px;
  line-height: 26px;
  padding: 15px 55px;
  cursor: pointer;
  display: inline-block;
  font-weight: 800;
}
</style>
