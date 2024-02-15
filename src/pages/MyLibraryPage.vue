<template>
  <BaseCard title="My Library" class="library-base-card main-page-base-card">
    <template v-slot:content>
      <ul class="tab-labels">
        <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.BOOKMARKS }]">
          <router-link :to="{name:'my-library-bookmarked-tab'}" class="inv-link">Bookmarks</router-link>
        </li>
        <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.IMPORTED }]">
          <router-link :to="{name:'my-library-imported-tab'}" class="inv-link">Imported</router-link>
        </li>
        <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.HISTORY }]">
          <router-link :to="{name:'my-library-lesson-history'}" class="inv-link">History</router-link>
        </li>
      </ul>
      <router-view/>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";

import {defineComponent} from "vue";


enum MyLibraryPageTab {
  BOOKMARKS = "Bookmarks",
  IMPORTED = "Imported",
  HISTORY = "History",
}

export default defineComponent({
  name: "MyLibraryPage",
  components: {BaseCard},
  computed: {
    currentTab() {
      if (this.$route.name == "my-library-bookmarked-tab")
        return MyLibraryPageTab.BOOKMARKS;
      else if (this.$route.name == "my-library-imported-tab")
        return MyLibraryPageTab.IMPORTED;
      else if (this.$route.name == "my-library-lesson-history")
        return MyLibraryPageTab.HISTORY;
      else
        return null;
    }
  },
  setup() {
    return {
      MyLibraryPageTab
    };
  }
});
</script>

<style scoped>
.library-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1.25rem;
  justify-content: flex-start;
  align-items: stretch;
}

.library-base-card:deep(header) {
  margin-bottom: 1rem;
}

.tab-labels {
  display: flex;
  flex-direction: row;
}

.tab-label {
  font-size: 1.2rem;
  cursor: pointer;
}

.tab-label > a {
  display: inline-block;
  padding: 1rem;
}

.current-tab > a {
  border-bottom: 3px solid var(--secondary-color);
}

@media screen and (max-width: 750px) {
  .tab-label {
    font-size: 1rem;
    padding: 1rem 0.7rem;
  }
}

@media screen and (max-width: 400px) {
  .tab-labels {
    align-self: center;
  }
}
</style>
