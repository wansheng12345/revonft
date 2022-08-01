<!-- 裁剪图片 -->
<template>
  <div class="crop-image-page">
    <el-dialog title="图片剪裁" :visible.sync="show" append-to-body :before-close="handleClose" :close-on-click-modal="false">
      <div class="cropper-content">
        <div class="cropper" style="text-align: center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
            :autoCropWidth="option.autoCropWidth"
            :autoCropHeight="option.autoCropHeight"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rotateLeft">↺</el-button>
        <el-button @click="rotateRight">↻</el-button>
        <el-button @click="changeScale(1)">放大</el-button>
        <el-button @click="changeScale(-1)">缩小</el-button>
        <el-button>取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.1, // 裁剪生成图片的质量
        outputType: "jpg", // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth:400, // 默认生成截图框宽度
        autoCropHeight:400, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 7], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
    };
  },
  methods: {
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    changeScale(num) {
      num = num || 0.5;
      this.$refs.cropper.changeScale(num);
    },
    handleSubmit() {
      this.$refs.cropper.getCropData((data) => {
        this.$emit('getImg',data)
      });
    },
    handleClose(){
        this.$emit('close')
    }
  },
};
</script>
<style lang='less' scoped>
.crop-image-page {
} 
// 截图
.cropper-content {
  .cropper {
    width: auto;
    height:400px;
  }
}
</style>