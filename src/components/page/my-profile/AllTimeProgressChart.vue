<template>
  <div class="all-time-progress-chart">
    <div class="title-bar">
      <h3>All Time Progress</h3>
    </div>
    <LoadingScreen v-if="isLoading" class="loading-screen"/>
    <BaseBarChart v-else-if="chartData"
                  :chart-data="chartData"
                  :chart-options="{plugins:{legend:{display: false}}}"
                  x-label="Language"
                  y-label="Vocabs Known"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import BaseBarChart from "@/components/ui/BaseBarChart.vue";
import {ChartData} from "chart.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import {UserSchema, VocabLevelSchema} from "dzelda-common";

export default defineComponent({
  name: "AllTimeProgressChart",
  components: {LoadingScreen, BaseBarChart},
  props: {user: {type: Object as PropType<UserSchema>, required: true}},
  data() {
    return {
      isLoading: true,
      chartData: null as ChartData<"bar", any> | null,
    };
  },
  methods: {
    async fetchChartData() {
      this.isLoading = true;
      const rawData = await this.vocabStore.fetchSavedVocabsCount({username: this.user.username}, {
        groupBy: "language",
        level: [VocabLevelSchema.LEARNED, VocabLevelSchema.KNOWN]
      });
      this.chartData = {datasets: [{data: rawData.map((r) => ({x: r.language, y: r.vocabsCount}))}]};
      this.isLoading = false;
    }
  },
  mounted() {
    this.fetchChartData();
  },
  setup() {
    return {vocabStore: useVocabStore()};
  }
});
</script>

<style scoped>
h3 {
  font-size: 1.25rem;

}

.title-bar {
  margin-bottom: 1rem;
}
</style>
