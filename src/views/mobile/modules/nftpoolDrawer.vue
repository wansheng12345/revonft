<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      direction="btt"
      size="70%"
      custom-class="custom-drawer"
      :with-header="false"
    >
      <div class="nft-container">
        <div class="hd">
          <div class="title">NFT POOL</div>
        </div>
        <div class="bd">
          <!-- <div class="desc">
          <div class="item-title">NFT {{$t('lang.value')}}</div>
          <div class="item-content">
            Increasing Prosperity With Positive Thinking
          </div>
        </div> -->
          <!-- <div class="nft-nums">
            <img src="@/assets/img/nft.svg" class="icon-nft" />
            <span class="num">{{ item.Price }}</span>
          </div> -->
          <div class="form-container">
            <div class="upload-container-wrapper">
              <el-upload
                class="upload-container"
                :action="action"
                :show-file-list="false"
                :headers="headers"
                :on-error="handleUploadError"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <div v-if="imgBase64 == ''">
                  <div class="hd">
                    <h3 class="title">{{ $t("lang.UploadFile") }}</h3>
                    <!-- <div class="desc">Make a secure payment online with a PayPal account</div> -->
                  </div>
                  <div class="img-preview"></div>
                  <div class="upload-act">
                    <div class="nft-btn">{{ $t("lang.ChooseFile") }}</div>
                    <div class="tips">{{ $t("lang.maxFile") }}</div>
                  </div>
                </div>

                <div v-if="imgBase64 != ''" class="image-view">
                  <!-- <div class="gass">
                <i class="el-icon-delete"></i>
              </div> -->
                  <img :src="imgBase64" ref="imgPre" object-fit="cover" />
                </div>
              </el-upload>
            </div>
            <div class="meta-inputs">
              <div class="input-group">
                <div class="item-label">{{ $t("lang.Title") }}</div>
                <div class="item-field">
                  <el-input
                    type="text"
                    ref="title"
                    v-model="title"
                    :maxlength="16"
                    class="nft-input"
                    :placeholder="$t('lang.TitlePlaceholder')"
                  />
                </div>
              </div>
              <div class="input-group">
                <div class="item-label">{{ $t("lang.Description") }}</div>
                <div class="item-field">
                  <el-input
                    type="textarea"
                    ref="description"
                    v-model="description"
                    :rows="3"
                    :maxlength="360"
                    class="nft-input"
                    :placeholder="$t('lang.DescPlaceholder')"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <el-checkbox v-model="checkbox" size=""></el-checkbox>
              <p @click="handlePrivew">
                I have already read and agree the picture ranking rules of the
                platform
              </p>
            </div>
          </div>
        </div>
        <div class="drawer-action">
          <div
            class="btn btn-rounded btn-block btn-nft"
            :class="{ disabled: isDisabled }"
            @click="onsubmit"
          >
            {{ $t("lang.mint") }}
          </div>
        </div>
      </div>
      <!-- 同意须知 -->
      <el-dialog
        width="90%"
        title="REVONFT audit policy"
        custom-class="info-dialog"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="info-container">
          <p>
            For the good development of the platform and compliance with
            national laws and regulations,
          </p>
          <p>
            We have formulated a set of restrictions on pictures uploaded by
            users on the revonft platform by combining the film classification
            systems of various countries
          </p>
          <ul>
            <li>
              Level G (general): <br />
              Suitable for everyone to watch (100% approved)
            </li>
            <li>
              Level M (medium) <br />
              Exposed / bloody / sexual works of Art (including but not limited
              to cartoon / hand drawing / synthesis / 3D, etc.) (it shall be
              approved according to the circumstances. If it is rejected, the
              user's appeal and there are sufficient reasons can be modified to
              be approved)
            </li>
            <li>
              Level R (restricted):<br />
              It contains exposure, blood, terror, drugs, sex, politics and
              religion Note: especially the realistic photos / screenshots /
              videos, etc. (the review cannot be passed and the decision from
              failure to pass cannot be modified)
            </li>
          </ul>
          <div class="right_text">Final interpretation is owned by REVONFT</div>
        </div>
      </el-dialog>
    </el-drawer>
    <!-- 上传成功 -->
    <el-dialog
      :visible="successed"
      width="90%"
      custom-class="nft-dialog"
      :center="true"
      @close="closeSuccessDialog"
    >
      <div class="nft-dialog-success">
        <h2>UPLOAD SECCEEDED</h2>
        <p>
          After passing the audit,you can mint <br />
          immediately in “MY NFT”
        </p>
        <div class="view_button" @click="goMine">VIEW</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ad from "@/utils/web3Helper";
import { BASE_V_API } from "@/config/env";
import request from "@/services/request";
export default {
  name: "nftpoolDrawer",
  data() {
    return {
      visible: false,
      title: "",
      description: "",
      action: BASE_V_API + "/file/up-to-ipfs",
      imgBase64: "",
      item: {
        Price: "1",
      },
      checkbox: false,
      innerVisible: false,
      address: "",
      successed: false, //上传成功后的弹窗
      headers:'',
    };
  },
  computed: {
    isDisabled: function () {
      if (
        this.imgBase64 != "" &&
        this.title.length > 0 &&
        this.description.length > 0 &&
        this.checkbox
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  created() {
    this.address = this.$store.getters.address;
    let token = window.sessionStorage.getItem('Token')
    this.headers={
      Authorization:"Bearer " + token
    }
  },
  mounted() {},
  methods: {
    closeSuccessDialog() {
      this.successed = false;
    },
    goMine() {
      this.$router.push("mine-m");
    },
    //预览同意的文档
    handlePrivew() {
      this.innerVisible = true;
    },
    openDialog() {
      this.closeDialog();
      this.item = JSON.parse(localStorage.getItem("selectPendingImte"));
      this.visible = true;
    },
    closeDialog() {
      this.imgBase64 = "";
      this.title = "";
      this.description = "";
      this.visible = false;
      this.checkbox = false;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      console.log("imageUrl", this.imageUrl);
      this.cid = file.response.data.cid;
      console.log("cid", this.cid);
    },
    handleUploadError(err) {
      console.log(err, "err");
      let myError = err.toString(); //转字符串
      myError = myError.replace("Error: ", ""); //去掉前面的
      myError = JSON.parse(myError); //转对象
      this.imgBase64 = "";
      this.$message.error(myError.msg);
    },
    beforeAvatarUpload(file) {
      console.log("beforeAvatarUpload", file);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let dataURL = "",
        $this = this;
      reader.onload = function (ev) {
        //文件读取成功完成时触发
        dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
        $this.imgBase64 = dataURL; //将DataURL码赋值给img标签
      };

      const isLt2M = file.size / 1024 / 1024 < 20;

      if (!isLt2M) {
        //maxFile
        this.$message.error(this.$t("lang.maxFile"));
      }
      return isLt2M;
    },
    //添加商品
    addnfts(tokenID) {
      var data = {
        cid: this.cid,
        token_id: tokenID,
        owner: this.address,
        title: this.title,
        description: this.description,
      };
      var that = this;
      ad.init(function (flag) {
        console.log("addnfts.para", data);
        request.addnft(data).then(
          (response) => {
            console.log("addnfts.response", response);
            if (response.code == "200") {
              that.$message({
                message: "添加成功",
                type: "success",
              });
              that.closeDialog();
              that.$router.push("mine");
            } else {
              that.$message.error(response.mesg);
            }
          },
          (err) => {
            console.log(err, "err");
          }
        );
      });
    },
    queryTokenID() {
      var that = this;
      ad.queryTokenByOwner(this.address, function (token) {
        console.log("queryTokenByOwner.token_id:", token);
        that.addnfts(token);
      });
    },
    onsubmit() {
      // if (this.isDisabled) return;
      // if (this.title.length == 0) {
      //   this.$message.error(this.$t("lang.TitlePlaceholder"));
      //   this.$refs["title"].focus();
      //   return;
      // }
      // if (this.description.length == 0) {
      //   this.$message.error(this.$t("lang.DescPlaceholder"));
      //   this.$refs["description"].focus();
      //   return;
      // }
      this.showLoading();
      request
        .addNft({
          cid: this.cid,
          description: this.description,
          title: this.title,
          owner: this.address,
          token_id: "",
        })
        .then((res) => {
          this.loading.close();
          if (res.code == 200) {
            this.closeDialog();
            this.successed = true;
          }
        });
      // request.getUrl(para).then((res) => {
      //   if (res.code == 200) {
      //     ad.mintToSelf(
      //       res.data.url,
      //       res.data.id,
      //       this.item.Price,
      //       function (hash) {
      //         console.log("success", hash);
      //         that.$emit("success", hash);
      //         // that.$message.success("success");
      //         that.closeDialog();
      //       },
      //       function () {
      //         // that.$emit("fail");
      //         that.visible = false;
      //         that.closeDialog();
      //       }
      //     );
      //   }
      //   this.loading.close();
      // });
    },
    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: this.$t("lang.please"),
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.6)",
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-drawer__body{
  overflow:auto;
}
/deep/ .nft-dialog {
  border-radius: 15px;

  .el-dialog__header {
    .el-dialog__title {
      font-size: 22px;
      font-weight: 800;
      line-height: 50px;
    }

    .el-dialog__headerbtn {
      width: 35px;
      height: 35px;

      .el-dialog__close {
        background: url("~@/assets/img/close.svg") no-repeat center center/cover;
        width: 35px;
        height: 35px;
        &:before {
          content: "";
        }
      }
    }
  }
}
.nft-dialog-success {
  h2 {
    text-align: center;
    line-height: 40px;
    font-size: 24px;
    margin-bottom: 15px;
    color: #12022f;
  }
  p {
    text-align: center;
    line-height: 25px;
    color: #12022f;
    font-size: 14px;
  }
  .view_button {
    width: 40%;
    margin: 0 auto;
    background: #ffdda9;
    text-align: center;
    font-size: 16px;
    margin-top: 15px;
    line-height: 40px;
    border-radius: 20px;
    cursor: pointer;
  }
}
.nft-container {
  padding: 30px 0 48px;
  position: relative;
  .hd {
    padding: 0 15px 15px;
    .title {
      font-size: 30px;
      line-height: 25px;
      color: #12022f;
      text-align: center;
    }
  }
  .bd {
    .desc {
      padding: 0 15px;
      .item-title {
        color: #12022f;
        text-align: center;
        font-weight: 800;
        font-size: 18px;
        line-height: 25px;
      }
    }
  }
  .drawer-action {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 4px 20px;
    background: #fff;
  }
}
.subtitle {
  text-align: center;
  font-weight: 800;
  font-size: 18px;
  line-height: 25px;
}
.desc {
  text-align: center;
}
.nft-nums {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .num {
    font-size: 35px;
    line-height: 50px;
    font-weight: 800;
    margin-left: 15px;
  }
}
.form-container {
  border-top: #eee 1px solid;
  padding: 10px 20px 0;
  margin-top: 10px;
  .upload-container-wrapper {
    padding: 15px 20px;
  }
  .upload-container {
    border: #dcdcdc 2px dashed;
    border-radius: 6px;
    flex-grow: 1;
    margin-right: 10px;
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .hd {
      .title {
        font-size: 18px;
        font-weight: 800;
        line-height: 25px;
        text-align: center;
      }
    }
    .desc {
      font-size: 12px;
      line-height: 26px;
      font-weight: 800;
    }
    .img-preview {
      background: url("~@/assets/img/plus.svg") no-repeat center center/40px
        40px;
      width: 120px;
      height: 120px;
      margin: 0 auto;
      flex-grow: 1;
    }
    .upload-act {
      .nft-btn {
        background: #e9daff;
        color: #6a05ff;
        font-size: 12px;
        line-height: 17px;
        font-weight: 800;
        text-align: center;
        border-radius: 10em;
        padding: 8px 0 9px;
        width: 172px;
        margin: 0 auto;
      }
      .tips {
        color: #9d9d9d;
        font-size: 12px;
        line-height: 17px;
        font-weight: 800px;
        padding-top: 18px;
        text-align: center;
      }
    }
    &.image-view {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      .gass {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background: rgba(0, 0, 0, 0.3);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        i {
          font-size: 22px;
          color: #f00;
        }
      }
    }
  }
  .meta-inputs {
    //flex-grow:1; margin-left:10px;
    .input-group {
      margin: 10px 0 20px;
      .item-label {
        font-size: 14px;
        line-height: 34px;
      }
      .item-desc {
        font-size: 12px;
        line-height: 26px;
        font-weight: 800;
        margin-bottom: 10px;
        display: none;
      }
      .item-field {
        .nft-input {
          background: #eee;
          min-height: 40px;
          border-radius: 10em;
          /deep/&.el-input {
            .el-input__inner {
              background: transparent;
              border: 0 none;
              height: 40px;
              font-size: 16px;
            }
          }
          /deep/&.el-textarea {
            border-radius: 10px;
            .el-textarea__inner {
              background: transparent;
              border: 0 none;
              font-size: 16px;
              line-height: 32px;
            }
          }
        }
      }
    }
    .input-action {
      .nft-btn {
        height: 56px;
        border-radius: 10em;
        text-align: center;
        background: #ffdda9;
        color: #000;
        font-size: 16px;
        line-height: 26px;
        padding: 15px 0;
        cursor: pointer;
      }
    }
  }
  .row {
    display: flex;
    align-items: center;
    margin: 10px 0;
    .el-checkbox {
      transform: scale(1.5);
    }
    p {
      margin-left: 15px;
      cursor: pointer;
      text-decoration: underline;
    }
  }
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
  &.disabled {
    opacity: 0.6;
    background: #ffdda9;
    border-color: #ffdda9;
    color: #999;
    cursor: not-allowed;
  }
  &:hover {
    opacity: 0.6;
  }
}
</style>
<style>
.el-loading-spinner i {
  color: #dadce6;
  font-size: 30px;
}
.el-loading-spinner .el-loading-text {
  color: #dadce6;
  margin-top: 5px;
}
.info-dialog .el-icon-close {
  font-size: 24px;
  color: #000;
}
.info-dialog .el-dialog__body {
  padding: 10px 20px;
  line-height: 24px;
}
</style>