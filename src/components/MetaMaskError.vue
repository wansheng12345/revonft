<!-- 小狐狸报错统一信息 -->
<template>
  <div>
    <div>
      <el-dialog
        :visible="show"
        width="620px"
        custom-class="nft-dialog"
        :title="null"
        :center="true"
        @close="handleClose"
      >
        <div class="nft-dialog-body">
          <div class="circle-warning"></div>
          <div class="title">MetaMask Tx Signature</div>
          <div class="desc">User denied transaction signature</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    closeable: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
        show:false,
    };
  },
  methods: {
      open(){
          this.show=true;
      },
    handleClose() {
      this.show=false;
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
      font-size:30px;
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
    .circle-warning {
      background: url("~@/assets/img/circle_warning.png") no-repeat center
        center/cover;
      width: 122px;
      height: 122px;
      margin: 0 auto 20px;
    }
    .title {
      font-weight: 800;
      font-size:26px;
      line-height: 44px;
      padding: 0 0 20px;
      text-align: center;
      text-transform: uppercase;
      color: #12022f;
    }
    .desc {
      text-align: center;
      color: #12022f;
      line-height:24px;
      font-size: 18px;
      padding: 0 0 20px;
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
