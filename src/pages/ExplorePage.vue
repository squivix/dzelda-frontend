<template>
  <base-card class="explore-base-card">
    <template v-slot:all>
      <h2>Explore</h2>
      <base-tabbed-view
          :tabs="[{id:ExplorePageTab.RECENT, label:'Recent'},{id:ExplorePageTab.POPULAR, label:'Popular'}]">
        <template v-slot:[ExplorePageTab.RECENT]>
          <recent-lessons-tab/>
        </template>
        <template v-slot:[ExplorePageTab.POPULAR]>
          <popular-lessons-tab/>
        </template>
      </base-tabbed-view>
    </template>

  </base-card>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {defineComponent} from "vue";
import BaseTabbedView from "@/components/ui/BaseTabbedView.vue";
import PopularLessonsTab from "@/components/page/explore/PopularLessonsTab.vue";
import RecentLessonsTab from "@/components/page/explore/RecentLessonsTab.vue";

enum ExplorePageTab {
  RECENT = "Recent",
  POPULAR = "Popular",
}

export default defineComponent({
  name: "ExplorePage",
  components: {RecentLessonsTab, PopularLessonsTab, BaseTabbedView, BaseCard},
  data() {
    return {
      pageCount: 0,
    };
  },
  setup() {
    return {ExplorePageTab}
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


</style>