<template>
  <div class="recent-activity-chart">
    <div class="title-bar">
      <h3>Recent Activity</h3>
      <select v-model="period" :disabled="isLoading">
        <option :value="RecentActivityPeriod.LAST_WEEK">Last week</option>
        <option :value="RecentActivityPeriod.LAST_MONTH">Last month</option>
        <option :value="RecentActivityPeriod.LAST_6_MONTHS">Last 6 months</option>
        <option :value="RecentActivityPeriod.LAST_YEAR">Last year</option>
        <option :value="RecentActivityPeriod.ALL_TIME">All time</option>
      </select>
    </div>
    <LoadingScreen v-if="isLoading" class="loading-screen"/>
    <BaseLineChart v-else-if="chartData"
                   :chart-data="chartData"
                   :x-label="xLabel"
                   y-label="New vocabs"
                   :legend-position="windowWidth>=750?'right':'bottom'"
                   :chart-options="{scales: {y: {ticks: {precision:0}}}}"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {Line as LineChart} from "vue-chartjs";
import {useVocabStore} from "@/stores/backend/vocabStore.js";
import BaseLineChart from "@/components/ui/BaseLineChart.vue";
import {LanguageSchema, UserSchema, VocabLevel} from "dzelda-common";
import {ChartData, ChartDataset} from "chart.js";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import {daysToMs, toSentenceCase} from "@/utils.js";
import {useWindowSize} from "@vueuse/core";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

enum RecentActivityPeriod {
  LAST_WEEK = "last-week",
  LAST_MONTH = "last-month",
  LAST_6_MONTHS = "last-6-months",
  LAST_YEAR = "last-year",
  ALL_TIME = "all-time"
}

export default defineComponent({
  name: "RecentActivityChart",
  components: {LoadingScreen, BaseLineChart, LineChart},
  props: {
    user: {type: Object as PropType<UserSchema>, required: true},
    languages: {type: Array as PropType<LanguageSchema[]>, required: false}
  },
  data() {
    return {
      period: RecentActivityPeriod.LAST_WEEK,
      isLoading: true,
      chartData: null as ChartData<"line"> | null,
      xLabel: undefined as string | undefined,
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
  watch: {
    period() {
      this.fetchChartData();
    }
  },
  methods: {
    async fetchChartData() {
      this.isLoading = true;
      const to = new Date();
      let from = new Date(Date.now() - 5000), interval: "day" | "month" | "year" | undefined;
      if (this.period == RecentActivityPeriod.LAST_WEEK) {
        from.setDate(to.getDate() - 6);
        interval = "day";
      } else if (this.period == RecentActivityPeriod.LAST_MONTH) {
        from.setDate(to.getDate() - 30);
        interval = "day";
      } else if (this.period == RecentActivityPeriod.LAST_6_MONTHS) {
        from.setMonth(to.getMonth() - 6);
        interval = "month";
      } else if (this.period == RecentActivityPeriod.LAST_YEAR) {
        from.setFullYear(to.getFullYear() - 1);
        interval = "month";
      } else if (this.period == RecentActivityPeriod.ALL_TIME) {
        const userLanguages = [...(await this.languageStore.fetchUserLanguages())];
        from = new Date(userLanguages[0].startedLearningOn);
        for (const language of userLanguages) {
          const startedLearningOn = new Date(language.startedLearningOn);
          if (startedLearningOn.getTime() < from.getTime())
            from = startedLearningOn;
        }
        const daysBetween = (to.getTime() - from.getTime()) / daysToMs(1);
        if (daysBetween <= 30)
          interval = "day";
        else if (daysBetween <= 30 * 24)
          interval = "month";
        else
          interval = "year";
      }
      const rawData = await this.vocabStore.fetchSavedVocabsCountTimeSeries({
        username: this.user.username,
      }, {
        groupBy: "language",
        savedOnFrom: from.toISOString(),
        savedOnTo: to.toISOString(),
        savedOnInterval: interval,
        level: [VocabLevel.LEVEL_1, VocabLevel.LEVEL_2, VocabLevel.LEVEL_3, VocabLevel.LEVEL_4]
      });

      const languages: { [k: string]: ChartDataset<"line", { x: any, y: any }[]> } = {};
      for (const row of rawData) {
        if (!(row.language! in languages))
          languages[row.language!] = {
            label: row.language!,
            data: [],
            backgroundColor: this.languageMap[row.language!].color,
            borderColor: this.languageMap[row.language!].color
          };
        languages[row.language!].data.push({x: this.formatDate(row.date!), y: row.vocabsCount});
      }
      this.chartData = {datasets: Object.values(languages)};
      this.xLabel = toSentenceCase(interval!);
      this.isLoading = false;
    },
    formatDate(date: string) {
      // TODO deal with timezone mess: currently graph is confusing because utc is returned from serverside but presentation should be made local
      if (this.period == RecentActivityPeriod.LAST_WEEK)
        return new Date(date).toLocaleString("en-us", {weekday: "long"});
      else if (this.period == RecentActivityPeriod.LAST_MONTH)
        return new Date(date).toLocaleString("en-us", {day: "numeric", month: "short"});
      else if (this.period == RecentActivityPeriod.LAST_6_MONTHS || this.period == RecentActivityPeriod.LAST_YEAR)
        return new Date(date).toLocaleString("en-us", {year: "numeric", month: "long"});
      else
        return date;
    }
  },
  async mounted() {
    await this.fetchChartData();
  },
  setup() {
    const {width: windowWidth, height: windowHeight} = useWindowSize();
    return {
      windowWidth,
      windowHeight,
      vocabStore: useVocabStore(),
      languageStore: useLanguageStore(),
      RecentActivityPeriod
    };
  }
});
</script>

<style scoped>
.loading-screen {
  height: 200px;
  width: 50vw;
}

.title-bar {
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.25rem;
}

.title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
