<template>
  <div class="chart-wrapper" v-if="chartData">
    <line-chart :data="chartData" :options="chartOptions"></line-chart>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Line as LineChart} from "vue-chartjs";
import {useVocabStore} from "@/stores/backend/vocabStore.js";

export default defineComponent({
  name: "RecentActivityChart",
  components: {LineChart},
  data() {
    return {
      chartData: null,
      // {
      // labels: ['January',
      //   'February',
      //   'March',
      //   'April',
      //   'May',
      //   'June',
      //   'July'
      // ],
      // datasets: [
      //   {
      //     label: 'English',
      //     data: [65, 59, 80, 81, 56, 55, 40],
      //   }
      // ],
      // },
      chartOptions: {
        plugins: {
          title: {text: "Recent Activity", display: true, font: {size: 24}, align: "start", padding: {bottom: 15}},
          legend: {
            position: "right",
            labels: {boxWidth: 20}
          }
        }
      }
    }
  },
  methods: {
    async fetchSavedVocabsCount() {
      const lastWeek = new Date();
      lastWeek.setDate(new Date().getDate() - 7)
      const rawData = await this.vocabStore.fetchSavedVocabsCount({
        username: "me",
      }, {
        groupBy: "language",
        savedOnFrom: lastWeek.toISOString(),
        savedOnTo: new Date().toISOString(),
        savedOnInterval: "day",
      })
      const languages: any = {};
      for (const row of rawData) {
        if (!(row.language! in languages))
          languages[row.language!] = {label: row.language!, data: []}
        languages[row.language!].data.push({x: row.date, y: row.vocabsCount})
      }
      console.log(Object.values(languages))
      this.chartData = {datasets: Object.values(languages)}
    }
  },
  mounted() {
    this.fetchSavedVocabsCount();
  },
  setup() {
    return {vocabStore: useVocabStore()}
  }
})
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 40vh;
  width: 50vw;
}
</style>