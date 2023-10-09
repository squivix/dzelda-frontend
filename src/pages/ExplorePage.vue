<template>
  <base-card class="explore-base-card">
    <template v-slot:all>
      <h2>Explore</h2>
      <ul class="tab-labels">
        <li :class="['tab-label', { 'current-tab': currentTab === ExplorePageTab.RECENT }]">
          <router-link :to="{name:'explore-recent-lessons'}" class="inv-link">Recent</router-link>
        </li>
        <li :class="['tab-label', { 'current-tab': currentTab === ExplorePageTab.POPULAR }]">
          <router-link :to="{name:'explore-popular-lessons'}" class="inv-link">Popular</router-link>
        </li>
      </ul>
      <router-view :queryParams="queryParams"/>
    </template>

  </base-card>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {defineComponent, PropType} from "vue";
import PopularLessonsTab from "@/components/page/explore/PopularLessonsTab.vue";
import RecentLessonsTab from "@/components/page/explore/RecentLessonsTab.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";

enum ExplorePageTab {
  RECENT = "Recent",
  POPULAR = "Popular",
}

export default defineComponent({
  name: "ExplorePage",
  components: {PaginationControls, RecentLessonsTab, PopularLessonsTab, BaseCard},
  props: {
    queryParams: {
      type: Object as PropType<{ page: number, pageSize: number }>,
      required: true
    },
  },
  data() {
    return {
      pageCount: 0,
    };
  },
  computed: {
    currentTab() {
      if (this.$route.name == "explore-recent-lessons")
        return ExplorePageTab.RECENT;
      else if (this.$route.name == "explore-popular-lessons")
        return ExplorePageTab.POPULAR;
      else
        return null;
    }
  },
  methods: {},
  setup() {
    return {
      ExplorePageTab
    };
  },
});
</script>

<style scoped>
.explore-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  width: 70vw;
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}


h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.tab-labels {
  display: flex;
  flex-direction: row;
  margin-bottom: 1rem;
}

.tab-labels .tab-label {
  font-size: 1.2rem;
  padding: 1rem 1rem;
}

.tab-labels .tab-label:hover {
  cursor: pointer;
}

.tab-labels .tab-label.current-tab {
  border-bottom: 3px solid var(--secondary-color);
}
</style>
