<template>
  <div class="home-index">
    <div class="header" style="background: #fff">
      <Header activeMenuIndex="0"></Header>
    </div>
    <!-- <div class="box">
			<div class="box-hea">
				Have you ever finally just gave in to the temptation and read your horoscope in the newspaper on Sunday morning?
				Sure, we all have. For most of us, it’s a curiosity, an amusement to see what they say our day will be like based
				on the sign of the zodiac that we were b
			</div>
		</div> -->
    <div class="title">
      NEW<i>{{ h }}</i
      >:<i>{{ m }}</i
      >:<i>{{ s }}</i>
    </div>
    <div class="awesome">
      <div
        class="awesome-m"
        v-for="(item, index) in pendingList"
        :key="'item_' + index"
        @click="open(index)"
      >
        <div class="thumbnail">
          <img :src="require('@/assets/img/t.svg')" />
          <div class="price">{{ item.Price }}</div>
        </div>
        <div class="price">
          <div>
            <div class="block"></div>
          </div>
          <div>Price</div>
        </div>
        <div class="crypto">
          <div><div class="block"></div></div>
          <div class="con"><i></i>{{ item.Price }}</div>
        </div>
      </div>
      <div class="nodata" v-if="pendingList.length==0">
        <img src="./../../assets/img/nodata_participated.png" alt="">
      </div>
    </div>
    <Footer></Footer>
    <nftpool-dialog ref="nftpoolDialog" @offWeberr="offWeberr"></nftpool-dialog>
    <minting-dialog ref="MintingDialog"></minting-dialog>
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "../../components/footer.vue";
import nftpoolDialog from "@/views/modules/nftpoolDialog";
import MintingDialog from "./../modules/mintingDialog.vue";
import request from "@/services/request";
import moment from "moment";
export default {
  name: "home",
  data() {
    return {
      activeName: "1",
      pendingList: [],
      h: "0",
      m: "0",
      s: "0",
    };
  },
  created() {
    this.getNtfPendingList();
    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  methods: {
    //获取nft池子
    getNtfPendingList() {
      var para = {
        page: 1,
        page_size: 1000,
      };
      var that = this;
      request.getNftPending(para).then(
        (response) => {
          if (response.code == "200") {
            that.pendingList = response.data;
            console.log(response);
          } else {
            that.$message.error(response.mesg);
          }
        },
        (err) => {
          console.log(err, "err");
        }
      );
    },
    offWeberr(hash) {
      this.weberr = false;
      this.$refs.MintingDialog.openDialog(hash);
    },
    open(index) {
      console.log("open.select", index);
      var selectPendingItem = this.pendingList[index];
      localStorage.setItem(
        "selectPendingImte",
        JSON.stringify(selectPendingItem)
      );
      if (this.checkAccountToken() == true) {
        this.$refs.nftpoolDialog.openDialog();
      } else {
        alert(this.$t("lang.MateMask"));
      }
    },
    getTime() {
      this.h = moment().format("HH");
      this.m = moment().format("mm");
      this.s = moment().format("ss");
    },
    moment,
  },
  components: {
    Header,
    Footer,
    nftpoolDialog,
    MintingDialog,
  },
};
</script>

<style lang="less" scoped>
.home-index {
  min-height: 100%;
  position: relative;
  .nodata{
    img{
      width:auto;
    }
  }
  .box {
    width: 100%;
    height: 178px;
    background: #4173ea;
    padding: 39px 0;

    .box-hea {
      width: 771px;
      height: 100px;
      margin: auto;
      font-size: 18px;
      font-weight: 600;
      color: #ffffff;
      line-height: 25px;
    }
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    color: #000000;
    display: flex;
    width: 343px;
    justify-content: space-between;
    line-height: 67px;
    margin: auto;
    margin-top: 29px;

    i {
      display: block;
      width: 67px;
      height: 67px;
      background: #000000;
      border-radius: 6px;
      font-size: 29px;
      line-height: 67px;
      text-align: center;
      font-weight: 400;
      color: #ffffff;
    }
  }

  .awesome {
    width: 1226px;

    margin: auto;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // margin-top: 20px;
    margin-bottom: 122px;
    min-height: calc(100vh - 454px);

    .awesome-m {
      width: 290px;
      height: 453px;
      margin-top: 36px;

      // img {
      // 	width: 100%;
      // 	height: 394px;
      // }
      .thumbnail {
        position: relative;
        img {
          width: 100%;
          height: 394px;
        }
        .price {
          color: #fff;
          position: absolute;
          left: 35px;
          top: 6px;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .price {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(89, 77, 109, 1);
        padding: 9px 11px;
        .block {
          background: #c0c0c0;
          height: 15px;
          width: 98px;
          border-radius: 10em;
        }
      }

      .metas {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
        .meta-item {
          .rounded-rectangle {
            height: 15px;
            border-radius: 10em;
          }
          .item-title {
            color: #594d6d;
            margin-bottom: 5px;
            &.right {
              text-align: right;
            }
            .rounded-rectangle {
              width: 95px;
              background: #c0c0c0;
              margin: 10px 0 3px;
            }
          }
          .item-value {
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 25px;
            .rounded-rectangle {
              width: 154px;
              height: 18px;
              background: #414141;
            }
            .icon-nft {
              background: url("~@/assets/img/nft.svg") no-repeat center
                center/contain;
              width: 18px;
              height: 18px;
              margin-right: 5px;
            }
            .num {
              font-size: 14px;
            }
          }
        }
      }

      .crypto {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 11px;

        span {
          font-size: 14px;
          font-weight: 400;
          color: #12022f;
        }
        .block {
          background: #414141;
          height: 18px;
          width: 154px;
          border-radius: 10em;
        }

        .con {
          font-size: 16px;
          font-weight: bold;
          color: #12022f;
          display: block;
          display: flex;
          align-items: center;

          i {
            display: block;
            width: 24px;
            height: 24px;
            background: url(../../assets/img/icon.png) no-repeat;
            background-size: 100% 100%;
            margin-right: 10px;
          }
        }
      }
    }
    .meta-item {
      .rounded-rectangle {
        height: 15px;
        border-radius: 10em;
      }
      .item-title {
        color: #594d6d;
        margin-bottom: 5px;
        &.right {
          text-align: right;
        }
        .rounded-rectangle {
          width: 95px;
          background: #c0c0c0;
          margin: 10px 0 3px;
        }
      }
      .item-value {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 25px;
        .rounded-rectangle {
          width: 154px;
          height: 18px;
          background: #414141;
        }
        .icon-nft {
          background: url("~@/assets/img/nft.svg") no-repeat center
            center/contain;
          width: 18px;
          height: 18px;
          margin-right: 5px;
        }
        .num {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
