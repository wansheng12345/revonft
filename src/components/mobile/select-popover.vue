<!-- 移动端的选择弹窗  -->
<template>
  <el-drawer
    custom-class="select-popover-page"
    :visible.sync="show"
    direction="btt"
    :with-header="false"
    :size="size"
    :before-close="handleClose"
  >
    <div class="sort-mod">
      <ul>
        <li
          v-for="(v, i) in List"
          :key="i"
          :class="{ active: active == i }"
          @click="changeSort(i)"
        >
          {{ name?v.name:v }}
        </li>
      </ul>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    List: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: "30%",
    },
    active: {
      type: Number,
      default: 0,
    },
    name: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    //changge 事件,返回选中数据
    changeSort(i) {
      if (this.active == i) return;
      this.$emit("change", i);
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style lang='less' scoped>
/deep/.select-popover-page {
  .sort-mod {
    padding: 10px 20px;
    ul {
      li {
        text-align: center;
        font-size: 14px;
        border-bottom: 1px solid #eee;
        line-height: 35px;
        color: #333;
        &.active {
          color: #841ae9;
          font-weight: 600;
          font-size: 15px;
        }
      }
    }
  }
}
</style>