<template>
  <TextsList v-if="resourceType=='texts'"
             :pageCount="pageCount"
             :pageSize="queryParams.pageSize"
             :page="queryParams.page"
             :isLoading="isLoading"
             :filters="{addedBy:queryParams.addedBy, level:queryParams.level, hasAudio: queryParams.hasAudio}"
             :searchQuery="queryParams.searchQuery"
             :texts="texts"
             emptyMessage="No texts found in this language"
             @onTextHidden="fetchResources"
             @onTextReported="fetchResources"
  />
  <CollectionList v-else
                  :pageCount="pageCount"
                  :pageSize="queryParams.pageSize"
                  :page="queryParams.page"
                  :isLoading="isLoading"
                  :collections="collections"
                  :filters="{addedBy:queryParams.addedBy}"
                  :searchQuery="queryParams.searchQuery"
                  emptyMessage="No collections found in this language"/>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {PropType} from "vue";
import {useTextStore} from "@/stores/backend/textStore.js";
import type {CollectionSchema, TextSchema} from "dzelda-common";
import TextsList from "@/components/shared/content/TextsList.vue";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import CollectionList from "@/components/shared/content/CollectionList.vue";

export default defineComponent({
  name: "ExplorePopularTab",
  components: {TextsList, CollectionList},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string }>, required: true},
    queryParams: {
      type: Object as PropType<{
        page: number,
        pageSize: number,
        searchQuery: string,
        addedBy: string,
        level: string | string[],
        hasAudio: boolean
      }>, required: true
    },
    resourceType: {type: String as PropType<"texts" | "collections">, required: true},
  },
  data() {
    return {
      texts: [] as TextSchema[],
      collections: [] as CollectionSchema[],
      pageCount: 0,
      isLoading: false,
    };
  },
  watch: {
    queryParams() {
      this.fetchTexts();
    },
    resourceType() {
      this.fetchResources();
    }
  },
  methods: {
    async fetchResources() {
      if (this.resourceType == "texts")
        await this.fetchTexts();
      else
        await this.fetchCollections();
    },
    async fetchTexts() {
      this.isLoading = true;
      const response = await this.textStore.fetchTexts({
        languageCode: this.pathParams.learningLanguage,
        addedBy: this.queryParams.addedBy,
        level: this.queryParams.level,
        hasAudio: this.queryParams.hasAudio,
        searchQuery: this.queryParams.searchQuery || undefined,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        sortBy: "pastViewersCount",
        sortOrder: "desc"
      }, {secure: true});
      this.texts = response.data!;
      this.pageCount = response.pageCount!;
      this.isLoading = false;
    },
    async fetchCollections() {
      this.isLoading = true;
      const response = await this.collectionStore.fetchCollections({
        languageCode: this.pathParams.learningLanguage,
        addedBy: this.queryParams.addedBy,
        searchQuery: this.queryParams.searchQuery || undefined,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        sortBy: "avgPastViewersCountPerText",
        sortOrder: "desc"
      }, {secure: true});
      this.collections = response.data!;
      this.pageCount = response.pageCount!;
      this.isLoading = false;
    }

  },
  async mounted() {
    await this.fetchResources();
  },
  setup() {
    return {
      textStore: useTextStore(),
      collectionStore: useCollectionStore()
    };
  }
});
</script>

<style scoped>
</style>
