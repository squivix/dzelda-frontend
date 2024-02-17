<template>
  <LoadingScreen v-if="loading"/>
  <div class="tab-wrapper" v-else>

    <EmptyScreen v-if="!texts||texts.length==0" :has-filters="false">
      <template v-slot:no-filters>
        <div class="empty-screen">
          <inline-svg :src="icons.history" class="empty-icon"/>
          <p>No texts in history</p>
        </div>
      </template>
    </EmptyScreen>
    <ul v-if="texts" class="texts-list">
      <TextListItem v-for="text in texts" :key="text.id" :text="text"/>
    </ul>
    <PaginationControls
        v-if="pageCount"
        :page="queryParams.page"
        :page-size="queryParams.pageSize"
        :page-count="pageCount"
        per-page-select-label="Texts Per Page"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useTextStore} from "@/stores/backend/textStore.js";
import {TextSchema} from "dzelda-common";
import TextListItem from "@/components/shared/content/TextListItem.vue";
import PaginationControls from "@/components/shared/PaginationControls.vue";
import LoadingScreen from "@/components/shared/LoadingScreen.vue";
import CollectionFilters from "@/components/shared/filters/CollectionFilters.vue";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";

export default defineComponent({
  name: "LibraryHistoryTab",
  components: {InlineSvg, EmptyScreen, CollectionFilters, LoadingScreen, PaginationControls, TextListItem},
  data() {
    return {
      texts: [] as TextSchema[],
      pageCount: 0,
      loading: true,
    };
  },
  props: {
    queryParams: {
      type: Object as PropType<{
        page: number,
        pageSize: number
      }>,
      required: true
    },
  },
  watch: {
    queryParams() {
      this.fetchTexts();
    }
  },
  methods: {
    async fetchTexts() {
      this.loading = true;
      const response = await this.textStore.fetchTextsInHistory({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        sortBy: "timeViewed",
        sortOrder: "desc"
      });
      this.texts = response.data!;
      this.pageCount = response.pageCount!;
      this.loading = false;
    }
  },
  async mounted() {
    await this.fetchTexts();
  },
  setup() {
    return {
      icons,
      textStore: useTextStore()
    };
  }
});
</script>

<style scoped>
.tab-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.texts-list {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

</style>
