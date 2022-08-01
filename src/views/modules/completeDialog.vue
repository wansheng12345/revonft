<template>
  <div>
    <el-dialog
      :visible="visible"
      width="580px"
      custom-class="nft-dialog"
      :center="true"
      @close="closeDialog"
    >
      <div class="nft-dialog-body">
        <div class="icon">
          <img
            :src="require('@/assets/img/icon-sm.svg')"
            class="img"
            v-if="type == 1"
          />
          <img
            :src="require('@/assets/img/icon-k.svg')"
            class="img"
            v-if="type == 2"
          />
        </div>
        <div class="title">{{ $t("lang.votingSuccess") }}</div>
        <div class="desc">{{ $t("lang.votingSuccessLater") }}</div>
      </div>
      <template slot="footer">
        <div class="nft-dialog-footer">
          <div class="nft-btn" @click="handleEtherscan">
            {{ $t("lang.etherscan") }}
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "completeDialog",
  data() {
    return {
      visible: false,
      type: 1,
      hash: null,
    };
  },
  methods: {
    openDialog(hash) {
      this.hash = hash;
      this.visible = true;
    },
    closeDialog() {
      this.$emit("reload", true);
      this.visible = false;
    },
    handleEtherscan() {
      console.log(this.hash);
      if (this.hash) {
        // this.$router.push("mine");
        window.open("https://etherscan.io/tx/" + this.hash);
        this.visible = false;
      }
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
    .icon {
      .img {
        width: 140px;
        height: 140px;
        display: block;
        margin: 0 auto;
      }
    }
    .title {
      font-weight: 800;
      font-size: 18px;
      line-height: 22px;
      padding: 20px 0 10px;
      text-align: center;
      color: #12022f;
    }
    .desc {
      text-align: center;
      color: #12022f;
      line-height: 22px;
      font-size: 18px;
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
