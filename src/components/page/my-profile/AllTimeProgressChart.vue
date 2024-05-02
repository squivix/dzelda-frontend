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
import {LanguageSchema, UserSchema, VocabLevel} from "dzelda-common";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default defineComponent({
  name: "AllTimeProgressChart",
  components: {LoadingScreen, BaseBarChart},
  props: {
    user: {type: Object as PropType<UserSchema>, required: true},
    languages: {type: Array as PropType<LanguageSchema[]>, required: false}
  },
  data() {
    return {
      isLoading: true,
      chartData: null as ChartData<"bar", any> | null,
    };
  },
  computed: {
    languageMap() {
      const map: Record<string, LanguageSchema> = {};
      if (!this.languages)
        return map;
      for (const language of this.languages)
        map[language.name] = language;
      return map;
    }
  },
  methods: {
    async fetchChartData() {
      this.isLoading = true;
      const rawData = await this.vocabStore.fetchSavedVocabsCount({username: this.user.username}, {
        groupBy: "language",
        level: [VocabLevel.LEARNED, VocabLevel.KNOWN]
      });
      this.chartData = {
        datasets: [{
          data: rawData.map((r) => ({x: r.language, y: r.vocabsCount})),
          backgroundColor: rawData.map((r) => this.languageMap[r.language!].color),
          borderColor: rawData.map((r) => this.languageMap[r.language!].color),
        }]
      };
      this.isLoading = false;
    }
  },
  async mounted() {
    await this.fetchChartData();
  },
  setup() {
    return {
      vocabStore: useVocabStore(),
      languageStore: useLanguageStore(),
    };
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
