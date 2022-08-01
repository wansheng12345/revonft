<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      width="820px"
      custom-class="nft-dialog"
      title="NFT POOL"
      :center="true"
      @close="closeDialog"
      v-if="visible"
    >
      <div class="nft-dialog-body">
        <!-- <div class="subtitle">NFT {{ $t("lang.value") }}</div> -->
        <!-- <div class="nft-nums">
          <img src="@/assets/img/nft.svg" class="nft-icon" />
          <span class="num">{{ item.Price }}</span>
        </div> -->
        <div class="form-container">
          <!--<div class="upload-container">-->
          <el-upload
            v-if="imgBase64 == ''"
            class="upload-container"
            :action="action"
            :show-file-list="false"
            :auto-upload="true"
            accept="image/*,video/*"
            :headers="headers"
            :before-upload="beforeAvatarUpload"
            :on-error="handleUploadError"
            :on-success="handleAvatarSuccess"
          >
            <div class="hd">
              <h3 class="title">{{ $t("lang.UploadFile") }}</h3>
            </div>

            <div class="img-preview"></div>
            <div class="upload-act">
              <div class="nft-btn">{{ $t("lang.ChooseFile") }}</div>
              <div class="tips">{{ $t("lang.maxFile") }}</div>
            </div>
          </el-upload>
          <div v-else class="upload-container image-view">
            <img :src="imgBase64" ref="imgPre" object-fit="cover" />
            <div class="img-action">
              <i class="icon el-icon-delete" @click="removeImage"></i>
            </div>
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
            <div class="row">
              <el-checkbox v-model="checkbox" size=""></el-checkbox>
              <p @click="handlePrivew">
                I have already read and agree the picture ranking rules of the
                platform
              </p>
            </div>
            <div class="input-action">
              <el-button
                class="nft-btn"
                @click="onsubmit"
                :disabled="isDisabled"
                >{{ $t("lang.mint") }}</el-button
              >
            </div>
          </div>
        </div>
      </div>
      <weberr :show="weberr" :closeable="true"></weberr>
      <el-dialog
        width="32%"
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
    </el-dialog>
    <!-- 上传成功 -->
    <el-dialog
      :visible="successed"
      width="30%"
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
import ad from "../../utils/web3Helper.js";
import { BASE_V_API } from "../../config/env";
import request from "@/services/request";
import Weberr from "./weberr";

export default {
  name: "nftpoolDialog",
  data() {
    return {
      visible: false,
      title: "",
      imageUrl: "",
      item: {
        Price: "1",
      },
      tokenid: "",
      action: BASE_V_API + "/file/up-to-ipfs",
      cid: "",
      description: "",
      fileList: [],
      imgBase64: "",
      loading: false,
      url: "",
      id: 0,
      weberr: false,
      checkbox: false,
      successed: false,
      innerVisible: false,
      address:'',
      headers:''
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
  components: {
    Weberr,
  },
  created() {
    this.address = this.$store.getters.address;
    let token = window.sessionStorage.getItem('Token')
    this.headers={
      Authorization:"Bearer " + token
    }
  },
  methods: {
    goMine() {
      this.$router.push("mine");
    },
    handlePrivew() {
      this.innerVisible = true;
    },
    closeSuccessDialog() {
      this.successed = false;
    },
    openDialog() {
      this.weberr = false;
      this.item = JSON.parse(localStorage.getItem("selectPendingImte"));
      console.log("dialog.item", this.item);
      console.log("dialog.item.price", this.item.Price);
      this.visible = true;
    },
    closeDialog() {
      this.imgBase64 = "";
      this.weberr = false;
      this.title = "";
      this.description = "";
      this.visible = false;
      this.checkbox = false;
    },
    handleAvatarSuccess(res, file) {
      console.log(file, res,"file")
      this.imageUrl = URL.createObjectURL(file.raw);
      this.cid = file.response.data.cid;
    },
    handleUploadError(err) {
      this.imageUrl='';
      this.imgBase64 = "";
      let myError = err.toString(); //转字符串
      myError = myError.replace("Error: ", ""); //去掉前面的
      myError = JSON.parse(myError); //转对象

      this.$message.error(myError.msg);
    },
    beforeAvatarUpload(file) {
      let type1 = file.name.substring(file.name.lastIndexOf(".") + 1);
      let type = type1.trim().toLowerCase();
      const isImage =
        type === "jpg" ||
        type === "png" ||
        type === "gif" ||
        type === "jpeg" ||
        type === "JPG" ||
        type === "PNG" ||
        type === "GIF" ||
        type === "JPEG"

      let reader = new FileReader();
      if (isImage) {
        const isLt20M = file.size / 1024 / 1024 < 20;

        if (!isLt20M) {
          this.$message.error(this.$t("lang.maxFile"));
          return false;
        }
        reader.readAsDataURL(file);
        let dataURL = "",
          $this = this;
        reader.onload = function (ev) {
          //文件读取成功完成时触发
          dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
          $this.imgBase64 = dataURL; //将DataURL码赋值给img标签
        };
        return isLt20M;
      } else {
        this.imgBase64 = "";
        this.$message.error(this.$t("lang.fileTypeError"));
      }
    },

    onsubmit() {
      if (this.title.length == 0) {
        this.$message.error(this.$t("lang.TitlePlaceholder"));
        this.$refs["title"].focus();
        return;
      }
      if (this.description.length == 0) {
        this.$message.error(this.$t("lang.DescPlaceholder"));
        this.$refs["description"].focus();
        return;
      }
      request
        .addNft({
          cid: this.cid,
          description: this.description,
          title: this.title,
          owner: this.address,
          token_id: "",
        })
        .then((res) => {
          if (res.code == 200) {
            this.closeDialog();
            this.successed = true;
          }
        });
      // var that = this;
      // var para = {
      //   cid: this.cid,
      //   description: this.description,
      //   owner: this.address,
      //   title: this.title,
      // };
      // this.weberr = true;

      // request.getUrl(para).then((response) => {
      //   if (response.code == 200) {
      //     ad.mintToSelf(
      //       response.data.url,
      //       response.data.id,
      //       this.item.Price,
      //       function (hash) {
      //         console.log(response.data.url, response.data.id);
      //         console.log("mintToSelf.transId:", hash);
      //         that.weberr = false;
      //         that.closeDialog();
      //         that.$emit("offWeberr", hash);
      //       },
      //       function (err) {
      //         console.log("mintToSelf.err", err);
      //         that.weberr = false;
      //         that.visible = false;
      //         that.closeDialog();
      //         var data = {
      //           title: this.$t("lang.transactionFailed"),
      //           desc: this.$t("lang.failedDesc"),
      //         };
      //         that.$emit("fail", data);
      //       }
      //     );
      //   }
      // });
    },
    removeImage() {
      this.imgBase64 = "";
    },
  },
};
</script>

<style lang="less" scoped>
.nft-dialog-success {
  h2 {
    text-align: center;
    line-height: 40px;
    font-size: 28px;
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
/deep/ .info-dialog {
  .el-dialog__title {
    color: #6a05ff;
    font-size: 22px;
    font-weight: 600;
  }
  .info-container {
    & > p {
      color: #594d6d;
      line-height: 22px;
      margin-bottom: 15px;
    }
  }
  ul {
    li {
      color: #12022f;
      line-height: 23px;
      font-weight: 600;
      margin-bottom: 15px;
    }
  }
  .right_text {
    text-align: right;
  }
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
/deep/ .nft-dialog {
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
        font-size: 48px;
        line-height: 65px;
        font-weight: 800;
        margin-left: 15px;
      }
    }

    .form-container {
      display: flex;
      align-items: stretch;
      border-top: #eee 1px solid;
      padding: 30px 0 0;
      margin-top: 30px;

      .upload-container {
        border: #dcdcdc 2px dashed;
        border-radius: 19px;
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

          .img-action {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            opacity: 0;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            color: #ff2929;
            background: rgba(0, 0, 0, 0.3);

            .icon {
              cursor: pointer;
            }
          }

          &:hover {
            .img-action {
              opacity: 1;
            }
          }
        }
      }

      .meta-inputs {
        flex-grow: 1;
        margin-left: 10px;

        .input-group {
          margin-bottom: 30px;

          .item-label {
            font-size: 18px;
            line-height: 34px;
            font-weight: 800;
          }

          .item-desc {
            font-size: 12px;
            line-height: 26px;
            font-weight: 800;
            margin-bottom: 10px;
          }

          .item-field {
            .nft-input {
              background: rgba(231, 229, 234, 0.3);
              min-height: 56px;
              border-radius: 10em;

              /deep/ &.el-input {
                .el-input__inner {
                  background: transparent;
                  border: 0 none;
                  height: 56px;
                  font-size: 16px;
                }
              }

              /deep/ &.el-textarea {
                border-radius: 20px;

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
            display: block;
            width: 100%;
            border: 0 none;
            box-sizing: border-box;
            &.is-disabled {
              opacity: 0.6;
              background: #ffdda9;
              border-color: #ffdda9;
              color: #999;
              cursor: not-allowed;
            }
            i{
              font-size:18px;
            }
          }
        }
      }
    }
  }
}

.upload-container {
  max-width: 400px;

  /deep/ .el-upload {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
}
</style>
