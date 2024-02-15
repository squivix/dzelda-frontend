<template>
  <CollectionList :isLoading="isLoading"
              :pageCount="pageCount"
              :page="queryParams.page"
              :pageSize="queryParams.pageSize"
              :searchQuery="queryParams.searchQuery"
              :addedBy="queryParams.addedBy"
              :level="queryParams.level"
              :collections="collections">
    <template v-slot:empty-screen>
      <inline-svg :src="icons.bookWithBookmark" class="empty-icon"/>
      <p>Collections you bookmark
        <br>
        will appear here</p>
    </template>
  </CollectionList>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {CollectionSchema} from "dzelda-common";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import CollectionList from "@/components/shared/content/CollectionList.vue";
import {icons} from "@/icons.js";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  name: "LibraryBookmarkedTab",
  components: {CollectionList, InlineSvg},
  props: {
    pathParams: {
      type: Object as PropType<{
        learningLanguage: string
      }>,
      required: true
    },
    queryParams: {
      type: Object as PropType<{
        page?: number,
        pageSize?: number,
        searchQuery?: string,
        addedBy?: string,
        level?: string[]
      }>,
      required: true
    },
  },
  data() {
    return {
      collections: null as CollectionSchema[] | null,
      pageCount: 0,
      isLoading: false,
    };
  },
  watch: {
    queryParams() {
      this.fetchSavedCollections();
    }
  },
  async mounted() {
    await this.fetchSavedCollections();
  },
  methods: {
    async fetchSavedCollections() {
      this.isLoading = true;
      const response = await this.collectionsStore.fetchUserBookmarkedCollections({
        languageCode: this.$route.params.learningLanguage as string,
        level: this.queryParams.level,
        addedBy: this.queryParams.addedBy,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        searchQuery: this.queryParams.searchQuery || undefined,
      });
      this.collections = response.data;
      this.pageCount = response.pageCount;
      this.isLoading = false;
    },
  },
  setup() {
    return {
      icons,
      collectionsStore: useCollectionStore()
    };
  }
});
</script>

<style scoped>

</style>
