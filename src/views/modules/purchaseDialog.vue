<template>
  <div>
    <el-dialog
      :visible="visible"
      width="580px"
      custom-class="nft-dialog"
      :title="null"
      :center="true"
      @close="closeDialog"
    >
      <div class="nft-dialog-body">
        <div class="thumbnail">
          <img :src="path" class="img" v-if="!isVideo" />
          <video v-else :src="path" class="img" autoplay></video>
        </div>
        <div class="info">
          <div class="metas">
            <div class="title">{{ title }}</div>
            <div class="price">
              <div class="icon-nft"></div>
              <div class="num">{{ price }}</div>
            </div>
          </div>
          <div class="action">
            <el-button class="nft-btn" @click="submit">{{
              $t("lang.Purchase")
            }}</el-button>
          </div>
        </div>
      </div>
      <weberr :show="weberr" :closeable="true"></weberr>
    </el-dialog>
  </div>
</template>

<script>
import ad from "../../utils/web3Helper";
import market from "../../utils/market";
import Weberr from "./weberr";

export default {
  name: "purchaseDialog",
  props: {},
  components: {
    Weberr,
  },
  data() {
    return {
      visible: false,
      TradeId: 0,
      title: "",
      price: 0,
      path: "",
      weberr: false,
      isVideo: false,
    };
  },
  methods: {
    submit() {
      this.weberr = true;
      var that = this;
      market.buy(
        this.TradeId,
		this.price,
        (result) => {
          location.reload()
          // console.log("buy.success", result);
          // that.weberr = false;
          // that.$emit("offWeberr");
          // that.closeDialog();
        },
        (err) => {
          console.log("buy.err", err);
          var data = {
            title: that.$t("lang.failed"),
            desc: that.$t("lang.failedDesc"),
          };
          that.weberr = false;
          that.closeDialog();
          that.$emit("fail", data);
        }
      );
      // ad.buy(this.TokenID,this.price,function (result){
      // 	console.log("buy.success",result);
      // 	that.weberr = false;
      // 	that.$emit('offWeberr');
      // 	that.closeDialog();
      // },function (err){
      // 	console.log("buy.err",err);
      // 	var data = {
      // 		title:that.$t("lang.failed"),
      // 		desc:that.$t("lang.failedDesc"),
      // 	}
      // 	that.weberr = false;
      // 	that.closeDialog();
      // 	that.$emit('fail',data);
      // });
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
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    .thumbnail {
      .img {
        width: 200px;
        height: 274px;
        object-fit: cover;
        border-radius: 8px;
      }
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      margin-left: 30px;
      .metas {
        .title {
          font-size: 20px;
          line-height: 32px;
          font-weight: 600;
          padding-bottom: 20px;
        }
        .price {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .icon-nft {
            background: #e6e6e6 url("~@/assets/img/nft.svg") no-repeat center
              center/60% 60%;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            margin-right: 20px;
          }
          .num {
            font-size: 46px;
            line-height: 57px;
            color: #841ae9;
            font-weight: 400;
          }
        }
      }
      .action {
        .nft-btn {
          min-width: 280px;
        }
      }
    }
  }
}
/deep/.el-dialog__footer {
  padding: 0px 50px 40px;
  .nft-dialog-footer {
    display: flex;
    justify-content: center;
    border-top: #e6e6e6 1px solid;
    padding: 20px 0 0;
    .nft-btn {
      min-width: 220px;
    }
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
  font-weight: 500;
  border-color: #ffdda9;
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
