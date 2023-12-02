<template>
  <BaseCard title="My Library" class="library-base-card">
    <template v-slot:content>
      <ul class="tab-labels">
        <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.BOOKMARKS }]">
          <router-link :to="{name:'my-library-bookmarked-courses'}" class="inv-link">Bookmarks</router-link>
        </li>
        <li :class="['tab-label', { 'current-tab': currentTab === MyLibraryPageTab.IMPORTED }]">
          <router-link :to="{name:'my-library-imported-courses'}" class="inv-link">Imported</router-link>
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
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import CourseCard from "@/components/shared/content/CourseCard.vue";
import {defineComponent} from "vue";


enum MyLibraryPageTab {
  BOOKMARKS = "Bookmarks",
  IMPORTED = "Imported",
  HISTORY = "History",
}

export default defineComponent({
  name: "MyLibraryPage",
  components: {LessonListItem, CourseCard, BaseCard},
  computed: {
    currentTab() {
      if (this.$route.name == "my-library-bookmarked-courses")
        return MyLibraryPageTab.BOOKMARKS;
      else if (this.$route.name == "my-library-imported-courses")
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
  width: 70vw;
}

.library-base-card:deep(header) {
  margin-bottom: 1rem;
}

.tab-labels {
  display: flex;
  flex-direction: row;
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
