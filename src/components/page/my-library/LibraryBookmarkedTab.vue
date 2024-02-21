<template>
  <CollectionList v-if="pathParams.resourceType=='collections'"
                  :isLoading="isLoading"
                  :pageCount="pageCount"
                  :page="queryParams.page"
                  :pageSize="queryParams.pageSize"
                  :collections="collections"
                  :filters="{addedBy:queryParams.addedBy}"
                  :searchQuery="queryParams.searchQuery">
    <template v-slot:empty-screen>
      <inline-svg :src="icons.bookWithBookmark" class="empty-icon"/>
      <p>Collections you bookmark
        <br>
        will appear here</p>
    </template>
  </CollectionList>
  <TextsList v-else
             :pageCount="pageCount"
             :pageSize="queryParams.pageSize"
             :page="queryParams.page"
             :isLoading="isLoading"
             :texts="texts"
             :filters="{addedBy:queryParams.addedBy, level:queryParams.level, hasAudio: queryParams.hasAudio}"
             :searchQuery="queryParams.searchQuery">
    <template v-slot:empty-screen>
      <inline-svg :src="icons.bookOpenWithBookmark" class="empty-icon"/>
      <p>Texts you bookmark
        <br>
        will appear here</p>
    </template>
  </TextsList>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CollectionSchema, TextSchema} from "dzelda-common";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import CollectionList from "@/components/shared/content/CollectionList.vue";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";
import TextsList from "@/components/shared/content/TextsList.vue";
import {useTextStore} from "@/stores/backend/textStore.js";

export default defineComponent({
  name: "LibraryBookmarkedTab",
  components: {TextsList, CollectionList, InlineSvg},
  props: {
    pathParams: {
      type: Object as PropType<{ learningLanguage: string, resourceType: "texts" | "collections" }>, required: true
    },
    queryParams: {
      type: Object as PropType<{
        page?: number,
        pageSize?: number,
        searchQuery?: string,
        addedBy?: string,
        level?: string[],
        hasAudio: boolean
      }>,
      required: true
    },
  },
  data() {
    return {
      collections: [] as CollectionSchema[],
      texts: [] as TextSchema[],
      pageCount: 0,
      isLoading: false,
    };
  },
  watch: {
    queryParams() {
      this.fetchBookmarked();
    }
  },
  async mounted() {
    await this.fetchBookmarked();
  },
  methods: {
    async fetchBookmarked() {
      if (this.pathParams.resourceType == "collections")
        await this.fetchBookmarkedCollections();
      else
        await this.fetchBookmarkedTexts();
    },
    async fetchBookmarkedTexts() {
      this.isLoading = true;
      const response = await this.textStore.fetchUserBookmarkedTexts({
        languageCode: this.pathParams.learningLanguage,
        addedBy: this.queryParams.addedBy,
        level: this.queryParams.level,
        hasAudio: this.queryParams.hasAudio,
        searchQuery: this.queryParams.searchQuery || undefined,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
      });
      this.texts = response.data!;
      this.pageCount = response.pageCount!;
      this.isLoading = false;
    },
    async fetchBookmarkedCollections() {
      this.isLoading = true;
      const response = await this.collectionsStore.fetchUserBookmarkedCollections({
        languageCode: this.pathParams.learningLanguage,
        addedBy: this.queryParams.addedBy,
        searchQuery: this.queryParams.searchQuery || undefined,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
      });
      this.collections = response.data;
      this.pageCount = response.pageCount;
      this.isLoading = false;
    },
  },
  setup() {
    return {
      icons,
      textStore: useTextStore(),
      collectionsStore: useCollectionStore()
    };
  }
});
</script>

<style scoped>

</style>
