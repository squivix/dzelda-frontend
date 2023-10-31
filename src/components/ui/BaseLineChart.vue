<template>
  <div class="line-series-chart-wrapper" v-if="chartData">
    <line-chart :data="data" :options="options"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {Line as LineChart} from "vue-chartjs";
import {mergeDeep} from "@/utils.js";
import {ChartData, ChartOptions, Point} from "chart.js";

export default defineComponent({
  name: "BaseLineChart",
  components: {LineChart},
  props: {
    chartData: {type: Object as PropType<ChartData>, required: true},
    chartOptions: {type: Object as PropType<ChartOptions>, required: false, default: {}},

    title: {type: String, required: false},
    xLabel: {type: String, required: false},
    yLabel: {type: String, required: false}
  },
  computed: {
    data(): ChartData<"line", (number | Point | null)[], unknown> {
      return this.chartData as ChartData<"line", (number | Point | null)[], unknown>
    },
    options(): ChartOptions<"line"> {
      const defaultOptions = {
        maintainAspectRatio: false,
        scales: {
          x: {title: {text: this.xLabel, display: !!this.xLabel}},
          y: {title: {text: this.yLabel, display: !!this.yLabel},}
        },
        plugins: {
          title: {text: this.title, display: !!this.title},
          legend: {
            position: "right",
            labels: {boxWidth: 20}
          }
        },
      }
      return mergeDeep(defaultOptions, this.chartOptions)
    }
  },
})
</script>

<style scoped>
.line-series-chart-wrapper {
  position: relative;
  min-height: 200px;
  width: 50vw;
}
</style>