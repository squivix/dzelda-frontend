<template>
  <base-card class="explore-base-card">
    <template v-slot:all>
      <h2>Explore</h2>
      <nav class="tab-bar">
        <ul class="tab-labels">
          <li :class="{'tab-label':true, 'current-tab':currentTab==='Browse'}"
              @click="setCurrentTab('Browse')">
            Browse
          </li>
          <li :class="{'tab-label':true, 'current-tab':currentTab==='Guided'}"
              @click="setCurrentTab('Guided')">
            Guided
          </li>
        </ul>
      </nav>

      <browse-tab v-if="currentTab==='Browse'" @onPageFetched="onPageFetched">

      </browse-tab>
      <guided-tab v-else>

      </guided-tab>
      <pagination-controls v-if="pageCount"
                           :page-count="pageCount">
      </pagination-controls>
    </template>

  </base-card>
</template>

<script>
import BaseCard from "@/components/ui/BaseCard.vue";
import BrowseTab from "@/components/page/explore/BrowseTab.vue";
import GuidedTab from "@/components/page/explore/GuidedTab.vue";
import PaginationControls from "@/components/ui/PaginationControls.vue";

export default {
  name: "ExplorePage",
  components: {PaginationControls, BaseCard, BrowseTab, GuidedTab},
  data() {
    return {
      currentTab: "Browse",
      pageCount: 0,
    };
  },
  methods: {
    setCurrentTab(tab) {
      this.currentTab = tab;
    },
    onPageFetched(pageCount) {
      this.pageCount = pageCount;
    }
  }
};
</script>

<style scoped>
.explore-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.tab-labels {
  display: flex;
  flex-direction: row;
  /*justify-content: center;*/
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

.tab-content {
  border-top: none;
  border-radius: 3px;
}
</style>