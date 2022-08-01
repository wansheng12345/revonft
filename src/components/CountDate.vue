<template>
  <div class="page">
    <div class="count-content" v-if="show">
      <i class="el-icon-alarm-clock" v-if="size=='big'"></i><span>{{ hourString }}</span
      >:<span>{{ minuteString }}</span
      >:<span>{{ secondString }}</span>
    </div>
    <div v-else @click="Sell">
        Sell
    </div>
  </div>
</template>

<script>
export default {
  props: {
    remainTime: {
      // 倒计时间总秒数
      type: Number,
      default: 0,
    },
    size:{
      type: String,
      default:'big',
    }
  },
  data() {
    return {
      hour: "",
      minute: "",
      second: "",
      promiseTimer: "",
      show:true,
    };
  },
  computed: {
    hourString() {
      return this.formatNum(this.hour);
    },
    minuteString() {
      return this.formatNum(this.minute);
    },
    secondString() {
      return this.formatNum(this.second);
    },
  },
  mounted() {
    if (this.remainTime > 0) {
      this.hour = Math.floor((this.remainTime / 1000 / 3600) % 24);
      this.minute = Math.floor((this.remainTime / 1000 / 60) % 60);
      this.second = Math.floor((this.remainTime / 1000) % 60);
      this.countDowm();
    }
  },
  methods: {
    Sell(){
      this.$emit('sell')
    },
    countDowm() {
      var self = this;
      clearInterval(this.promiseTimer);
      this.promiseTimer = setInterval(function () {
        if (self.hour === 0) {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59;
            self.minute -= 1;
          } else if (self.minute === 0 && self.second === 0) {
            self.second = 0;
            self.$emit("countDowmEnd", true);
            clearInterval(self.promiseTimer);
          } else {
            self.second -= 1;
          }
        } else {
          if (self.minute !== 0 && self.second === 0) {
            self.second = 59;
            self.minute -= 1;
          } else if (self.minute === 0 && self.second === 0) {
            self.hour -= 1;
            self.minute = 59;
            self.second = 59;
          } else {
            self.second -= 1;
          }
        }
        if (self.hour == 0 && self.minute == 0 && self.second == 0) {
          self.show=false;
        }
      }, 1000);
    },
    formatNum(num) {
      return num < 10 ? "0" + num : "" + num;
    },
  },
};
</script>
<style scoped lang="less">
.count-content {
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 16px;
    margin-right: 4px;
  }
}
</style>
