<template>
  <div class="bar-chart-wrapper">
    <bar-chart :data="data" :options="options"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {Bar as BarChart} from 'vue-chartjs'
import {ChartData, ChartOptions} from "chart.js";
import {mergeDeep} from "@/utils.js";

export default defineComponent({
  name: "BaseBarChart",
  components: {BarChart},
  props: {
    chartData: {type: Object as PropType<ChartData>, required: true},
    chartOptions: {type: Object as PropType<ChartOptions>, required: false, default: {}},
    title: {type: String, required: false},
    xLabel: {type: String, required: false},
    yLabel: {type: String, required: false}
  },
  computed: {
    data(): ChartData<"bar"> {
      return this.chartData as ChartData<"bar">
    },
    options(): ChartOptions<"bar"> {
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
.bar-chart-wrapper {
  position: relative;
  min-height: 200px;
  width: 50vw;
}
</style>