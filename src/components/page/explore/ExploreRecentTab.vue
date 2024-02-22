<template>
  <TextsList v-if="resourceType=='texts'"
             :pageCount="pageCount"
             :pageSize="queryParams.pageSize"
             :page="queryParams.page"
             :isLoading="isLoading"
             :texts="texts"
             :filters="{addedBy:queryParams.addedBy, level:queryParams.level, hasAudio: queryParams.hasAudio}"
             :searchQuery="queryParams.searchQuery"
             emptyMessage="No texts found in this language"
             @onTextHidden="fetchResources"
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
import {defineComponent, PropType} from "vue";
import {useTextStore} from "@/stores/backend/textStore.js";
import {CollectionSchema, TextSchema} from "dzelda-common";
import TextsList from "@/components/shared/content/TextsList.vue";
import CollectionList from "@/components/shared/content/CollectionList.vue";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";

export default defineComponent({
  name: "ExploreRecentTab",
  components: {TextsList, CollectionList},
  data() {
    return {
      texts: [] as TextSchema[],
      collections: [] as CollectionSchema[],
      pageCount: 0,
      isLoading: false,
    };
  },
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string }>, required: true},
    queryParams: {type: Object as PropType<{ page: number, pageSize: number, searchQuery: string, addedBy: string, level: string | string[], hasAudio: boolean }>, required: true},
    resourceType: {type: String as PropType<"texts" | "collections">, required: true},
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
        sortBy: "createdDate",
        sortOrder: "desc"
      });
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
        sortBy: "createdDate",
        sortOrder: "desc"
      });
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
