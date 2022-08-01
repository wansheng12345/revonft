<template>
	<div>
		<v-chart class="chart" :option="dataOption" :style="'height:'+height" />
	</div>
</template>

<script>
	import { use } from "echarts/core";
	import { CanvasRenderer } from "echarts/renderers";
	import { PieChart } from "echarts/charts";
	import {
		TitleComponent,
		TooltipComponent,
		LegendComponent
	} from "echarts/components";
	import VChart, { THEME_KEY } from "vue-echarts";
	use([
		CanvasRenderer,
		PieChart,
		TitleComponent,
		TooltipComponent,
		LegendComponent
	]);
	export default {
		name: 'pieChart',
		props:{
			height:{
				default:'260px',
				type:String
			},
      		dataOption:{
				default:function(){
					return {}
				},
				type:Object,
			},
		},
		watch: {
			// dataOption: {
			// 	handler (val, oldVal) {
			// 	console.log('dataOption to:',val);
			// 	console.log('dataOption from:',oldVal);
			// 	},
			// 	deep: true,
			// 	immediate: true
			// }
		},
		data() {
			return {

			}
		},
		components: {
			VChart
		},
		provide: {
			[THEME_KEY]: "light"
		},
		mounted() {},
		methods: {
			
		},
	}
</script>

<style lang="less" scoped>
.chart {
  width:100%;
}
</style>
