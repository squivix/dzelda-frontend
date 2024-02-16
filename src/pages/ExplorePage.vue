<template>
  <BaseCard class="explore-base-card main-page-base-card">
    <template v-slot:all>
      <h2>Explore</h2>
      <div class="top-bar">
        <ul class="tab-labels">
          <li :class="['tab-label', { 'current-tab': currentTab === ExplorePageTab.RECENT }]">
            <router-link :to="{name:'explore-recent'}" class="inv-link">Recent</router-link>
          </li>
          <li :class="['tab-label', { 'current-tab': currentTab === ExplorePageTab.POPULAR }]">
            <router-link :to="{name:'explore-popular'}" class="inv-link">Popular</router-link>
          </li>
        </ul>
        <select @change="onResourceTypeChange(($event.target as HTMLSelectElement).value)" :value="pathParams.resourceType">
          <option value="texts">Texts</option>
          <option value="collections">Collections</option>
        </select>
      </div>
      <router-view :resourceType="pathParams.resourceType" :queryParams="queryParams"/>
    </template>

  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import {defineComponent, PropType} from "vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";

enum ExplorePageTab {
  RECENT = "Recent",
  POPULAR = "Popular",
}

export default defineComponent({
  name: "ExplorePage",
  components: {PaginationControls, BaseCard},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, resourceType: "texts" | "collections" }>, required: true},
    queryParams: {type: Object as PropType<{ page: number, pageSize: number }>, required: true},
  },
  data() {
    return {
      pageCount: 0,
    };
  },
  computed: {
    currentTab() {
      if (this.$route.name == "explore-recent")
        return ExplorePageTab.RECENT;
      else if (this.$route.name == "explore-popular")
        return ExplorePageTab.POPULAR;
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
}

h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}


h2 {
  font-size: 2rem;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1rem;
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

select {
  font-size: 1rem;
  height: 2.5rem;
  flex-basis: 200px;
}

@media screen and (max-width: 400px) {
  .top-bar {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  select {
    flex-basis: 3rem;
  }
}
</style>
