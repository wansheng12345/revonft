<!-- 移动端取消销售-->
<template>
  <div class="tooltip" v-if="ShowTooltip" @click.self="CloseTooltip">
    <div class="content">
      <h2>
        <span></span>
        <span>{{ $t("lang.cancel") }}</span>
        <i></i>
      </h2>
      <p>{{ $t("lang.cancelDesc") }}</p>
      <div class="footer">
        <div class="btns" @click="CloseTooltip">{{ $t("lang.think") }}</div>
        <div class="btns" @click="cancel">{{ $t("lang.cacelListing") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import market from "@/utils/market";
export default {
  props: {
    ShowTooltip: {
      type: Boolean,
      default: false,
    },
    TradeId:{
      type: String,
      default: '',
    }
  },
  data() {
    return {};
  },
  methods: {
    CloseTooltip() {
      this.$emit("closeTooltip")
    },
    cancel() {
      console.log(this.TradeId)
        let token = sessionStorage.getItem("Token");
        if (!token) {
          sessionStorage.setItem("iSsignature", false);
          this.getSign();
        } else {
          market.cancelSell(
            this.TradeId,
            (result) => {
              this.CloseTooltip();
              setTimeout(() => {
                location.reload();
              }, 3000);
            },
            (err) => {
              console.log(555)
              this.CloseTooltip();
              // this.$refs.failed.openDialog();
            }
          );
          
        }
    },
  },
};
</script>
<style lang='less' scoped>
//弹窗样式
.tooltip {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 15;
  background: #33333388;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 75%;
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    h2 {
      display: flex;
      align-content: center;
      justify-content: center;
      line-height: 25px;
      font-size: 16px;
      margin-bottom: 5px;
      color: #666;
    }
    p {
      font-weight: 600;
      line-height: 25px;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      border-bottom: #dcdcdc solid 1px;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 8px 0;
      div {
        width: 48%;
        line-height: 30px;
        font-size: 12px;
        border: 1px solid #dcdcdc;
        border-radius: 25px;
        text-align: center;
        color: #12022f;
        &:last-child {
          background: #ffdda9;
          border-color: #ffdda9;
        }
      }
    }
  }
}
</style>