<!-- 测试 -->
<template>
  <div>
    <el-upload
      :show-file-list="false"
      :before-upload="beforeUpload"
      accept=".jpg,.jpeg,.png,.bmp"
      action=""
      :limit="1"
    >
      <el-button size="small"> 上传图片 </el-button>
    </el-upload>
    <cropImage ref="crop" :show="show" @close="handleClose" @getImg="getImg"></cropImage>
    <h2 v-if="url">
        <img :src="url" alt="">
    </h2>
  </div>
</template>

<script>
import cropImage from "@/components/CropImage";
export default {
  components: {
    cropImage,
  },
  data() {
    return {
        url:'',
        show:false,
    };
  },
  methods: {
    beforeUpload(file) {
      this.getBase64(file);
      return false;
    },
    //转base64
    getBase64(file) {
      let reader = new FileReader();
      let fileResult = "";
      reader.readAsDataURL(file); //开始转
      reader.onload = function () {
        fileResult = reader.result;
      }; //转 失败
      reader.onerror = function (error) {
        reject(error);
      };
      reader.onloadend = () => {
        this.$refs.crop.option.img=fileResult;
        this.show=true;
      };
    },
    handleClose(){
        this.show=false;
    },
    getImg(url){
        this.url=url;
        this.handleClose()
    }
  },
};
</script>
<style lang='less' scoped>
img{
    width:400px;
}
</style>