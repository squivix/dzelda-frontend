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
      <router-link :to="{name:'add-collection'}" class="inv-link add-collection-button">
        <inline-svg :src="icons.plusRound" class="empty-icon"/>
        Create collections and<br>they will appear here
      </router-link>
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
  name: "LibraryImportedTab",
  components: {InlineSvg, CollectionList},
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
      isLoading: true,
    };
  },
  watch: {
    queryParams() {
      this.fetchImportedCollections();
    }
  },
  async mounted() {
    await this.fetchImportedCollections();
  },
  methods: {
    async fetchImportedCollections() {
      this.isLoading = true;
      const response = await this.collectionStore.fetchCollections({
        languageCode: this.$route.params.learningLanguage as string,
        level: this.queryParams.level,
        addedBy: "me",
        sortBy: "createdDate",
        sortOrder: "desc",
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        searchQuery: this.queryParams.searchQuery || undefined,
      }, {secure: true});
      this.collections = response.data;
      this.pageCount = response.pageCount;
      this.isLoading = false;
    },
  },
  setup() {
    return {
      icons,
      collectionStore: useCollectionStore()
    };
  }
});
</script>

<style scoped>
.add-collection-button {
  display: flex;
  color: grey;
  flex-direction: column;
  align-items: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  row-gap: 0.5rem;
}

.add-collection-button:hover, .add-collection-button:hover svg {
  color: var(--empty-list-icon-hover-color);
}

</style>
