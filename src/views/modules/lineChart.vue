<template>
  <div class="line-chart-page">
    <v-chart
      class="chart"
      :option="dataOption"
      :style="'height:' + height "
    />
  </div>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
export default {
  name: "lineChart",
  props: {
    height: {
      default: "260px",
      type: String,
    },
    dataOption: {
      default: function () {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {};
  },
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: "light",
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.chart {
  // width: 100%;
  width:660px;
  & > div {
    width:100%;
  }
}
@media only screen and (max-width: 800px) {
  .chart {
  width:100%;
  & > div {
    width:100%;
  }
}
}
</style>
