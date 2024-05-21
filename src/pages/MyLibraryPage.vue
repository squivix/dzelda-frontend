<template>
  <BaseCard title="My Library" class="library-base-card main-page-base-card">
    <template v-slot:content>
      <div class="top-bar">
        <ul class="tab-labels">
          <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.BOOKMARKS }]">
            <router-link :to="{name:'my-library-bookmarked-tab'}" class="inv-link">Bookmarks</router-link>
          </li>
          <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.IMPORTED }]">
            <router-link :to="{name:'my-library-imported-tab'}" class="inv-link">Imported</router-link>
          </li>
          <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.HISTORY }]">
            <router-link :to="{name:'my-library-history-tab', params:{resourceType:'texts'}}" class="inv-link">History</router-link>
          </li>
        </ul>
        <select v-if="currentTab !== MyLibraryPageTab.HISTORY"
                @change="onResourceTypeChange(($event.target as HTMLSelectElement).value)"
                :value="pathParams.resourceType">
          <option value="collections">Collections</option>
          <option value="texts">Texts</option>
        </select>
      </div>
      <router-view/>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";

import {defineComponent, PropType} from "vue";


enum MyLibraryPageTab {
  BOOKMARKS = "Bookmarks",
  IMPORTED = "Imported",
  HISTORY = "History",
}

export default defineComponent({
  name: "MyLibraryPage",
  components: {BaseCard},
  props: {pathParams: {type: Object as PropType<{ learningLanguage: string, resourceType: "texts" | "collections" }>, required: true}},
  computed: {
    currentTab() {
      if (this.$route.name == "my-library-bookmarked-tab")
        return MyLibraryPageTab.BOOKMARKS;
      else if (this.$route.name == "my-library-imported-tab")
        return MyLibraryPageTab.IMPORTED;
      else if (this.$route.name == "my-library-history-tab")
        return MyLibraryPageTab.HISTORY;
      else
        return null;
    }
  },
  methods: {
    onResourceTypeChange(resourceType: string) {
      this.$router.push({params: {...this.$route.params, resourceType: resourceType}});
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
  row-gap: 1rem;
  justify-content: flex-start;
  align-items: stretch;
}

.library-base-card:deep(header) {
  margin-bottom: 1rem;
}

.top-bar {
  display: flex;
  justify-content: space-between;
}

select {
  font-size: 1rem;
  height: 2.5rem;
  flex-basis: 200px;
}


@media screen and (max-width: 750px) {
  .tab-label {
    font-size: 1rem;
  }

  .top-bar {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  select {
    flex-basis: 2.5rem;
  }
}

@media screen and (max-width: 400px) {
  .tab-labels {
    align-self: center;
  }
}
</style>
