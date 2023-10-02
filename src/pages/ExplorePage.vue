<template>
  <base-card class="explore-base-card">
    <template v-slot:all>
      <h2>Explore</h2>
      <base-tabbed-view
          :tabs="[{id:ExplorePageTab.BROWSE, label:'Browse'},{id:ExplorePageTab.GUIDED, label:'Guided'}]">
        <template v-slot:[ExplorePageTab.BROWSE]>
          <browse-tab/>
        </template>
        <template v-slot:[ExplorePageTab.GUIDED]>
          <guided-tab/>
        </template>
      </base-tabbed-view>
      <pagination-controls v-if="pageCount"
                           :page-count="pageCount">
      </pagination-controls>
    </template>

  </base-card>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import BrowseTab from "@/components/page/explore/BrowseTab.vue";
import GuidedTab from "@/components/page/explore/GuidedTab.vue";
import PaginationControls from "@/components/ui/PaginationControls.vue";
import {defineComponent} from "vue";
import BaseTabbedView from "@/components/ui/BaseTabbedView.vue";

enum ExplorePageTab {
  BROWSE = "Browse",
  GUIDED = "Guided",
}

export default defineComponent({
  name: "ExplorePage",
  components: {BaseTabbedView, PaginationControls, BaseCard, BrowseTab, GuidedTab},
  data() {
    return {
      pageCount: 0,
    };
  },
  methods: {
    setCurrentTab(tab: ExplorePageTab) {
      this.currentTab = tab;
    },
    onPageFetched(pageCount: number) {
      this.pageCount = pageCount;
    }
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