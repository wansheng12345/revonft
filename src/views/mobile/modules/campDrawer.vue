<template>
  <el-drawer
    :visible.sync="visible"
    direction="btt"
    custom-class="custom-drawer"
    :with-header="false"
  >
    <div class="camp-container">
      <div class="hd">
        <div class="title">{{ $t("lang.chooseCamp") }}</div>
      </div>
      <div class="bd">
        <div class="price">
          <div class="item-title">{{ $t("lang.ticketPrice") }}:</div>
          <div class="item-value">
            <div class="icon-nft"></div>
            <div class="num">{{ Price }}</div>
          </div>
        </div>
        <div class="choose-container">
          <div
            class="choose-item item-smile"
            @click="activeSmile"
            :class="{ active: isSmile }"
          ></div>
          <div class="choose-or">{{ $t("lang.or") }}</div>
          <div
            class="choose-item item-angry"
            @click="activeAngry"
            :class="{ active: isAngry }"
          ></div>
        </div>
        <div class="choose-actions">
          <div class="btn btn-rounded btn-block btn-nft" @click="submit">
            {{ $t("lang.Confirm") }}
          </div>
        </div>
      </div>
      <!-- 失败弹窗 -->
      <Fail ref="failed"></Fail>
    </div>
  </el-drawer>
</template>
<script>
import ad from "@/utils/web3Helper";
import Fail from "./Failed.vue";
export default {
  name: "campDrawer",
  data() {
    return {
      visible: false,
      typa: 0,
      isSmile: false,
      isAngry: false,
      TokenID: "",
      Price: "0.1",
    };
  },
  components: { Fail },
  created() {},
  mounted() {},
  methods: {
    openDialog(TokenID) {
      if (!TokenID || TokenID == "") return;
      this.TokenID = TokenID;
      this.visible = true;
    },
    activeSmile() {
      if (this.isSmile == false) {
        this.isSmile = true;
        this.isAngry = false;
        this.typa = 1;
      } else {
        this.isSmile = false;
      }
    },
    activeAngry() {
      if (this.isAngry == false) {
        this.isAngry = true;
        this.isSmile = false;
        this.typa = 2;
      } else {
        this.isAngry = false;
      }
    },
    submit() {
      var _this = this;
      if (this.typa != 1 && this.typa != 2) {
        this.$message({
          message:this.$t("lang.chooseCamp"),
          type: "error",
        });
      }
      ad.vote(
        this.TokenID,
        this.Price,
        this.typa,
        (hash) => {
          console.log("vote.success", hash);
          _this.visible = false;
          _this.$emit("updata",{hash,typa:this.typa})
        },
        (err) => {
          // _this.visible = false;
          this.$refs.failed.openDialog();
          console.log("sell.err", err);
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.custom-drawer {
  height: 330px !important;
}
.camp-container {
  //height:400px;
  padding: 20px 0 0;
  .hd {
    padding: 0 0 10px;
    .title {
      font-size: 18px;
      text-align: center;
      line-height: 25px;
      color: #12022f;
    }
  }
  .bd {
    .price {
      text-align: center;
      .item-title {
        color: #12022f;
        line-height: 17px;
        padding-bottom: 8px;
      }
      .item-value {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-nft {
          background: url("~@/assets/img/nft.svg") no-repeat center
            center/contain;
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
        .num {
          font-size: 18px;
        }
      }
    }
  }
}
.choose-container {
  border: #979797 2px dashed;
  border-radius: 10px;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 30px;
  .choose-item {
    border: #dcdcdc 1px solid;
    border-radius: 10px;
    width: 76px;
    height: 76px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 60px 60px;
    cursor: pointer;
    transition: all 0.1s;
    &.item-smile {
      background-image: url("~@/assets/img/icon-sm-gray.svg");
    }
    &.item-angry {
      background-image: url("~@/assets/img/icon-k-gray.svg");
    }
    &.item-smile:hover,
    &.active.item-smile {
      border: #000 2px solid;
      background-image: url("~@/assets/img/icon-sm.svg");
    }
    &.item-angry:hover,
    &.active.item-angry {
      border: #000 2px solid;
      background-image: url("~@/assets/img/icon-k.svg");
    }
  }
  .choose-or {
    border: #ababab 1px solid;
    border-radius: 10em;
    padding: 3px 10px;
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
}
</style>
