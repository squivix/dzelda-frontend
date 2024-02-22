<template>
  <CollectionList v-if="pathParams.resourceType=='collections'"
                  :isLoading="isLoading"
                  :pageCount="pageCount"
                  :page="queryParams.page"
                  :pageSize="queryParams.pageSize"
                  :collections="collections"
                  :excludedFilters="new Set (['addedBy'])"
                  :searchQuery="queryParams.searchQuery">
    <template v-slot:empty-screen>
      <router-link :to="{name:'add-collection'}" class="inv-link add-collection-button">
        <inline-svg :src="icons.plusRound" class="empty-icon"/>
        Create collections and<br>they will appear here
      </router-link>
    </template>
  </CollectionList>
  <TextsList v-else
             :pageCount="pageCount"
             :pageSize="queryParams.pageSize"
             :page="queryParams.page"
             :isLoading="isLoading"
             :texts="texts"
             :filters="{level:queryParams.level, hasAudio: queryParams.hasAudio}"
             :searchQuery="queryParams.searchQuery"
             :excludedFilters="new Set (['addedBy'])"
             @onTextHidden="fetchImported">
    <template v-slot:empty-screen>
      <router-link :to="{name:'add-text'}" class="inv-link add-collection-button">
        <inline-svg :src="icons.plusRound" class="empty-icon"/>
        Create texts and<br>they will appear here
      </router-link>
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
import {useTextStore} from "@/stores/backend/textStore.js";
import {resourceType} from "@/router/pathParams.js";
import TextsList from "@/components/shared/content/TextsList.vue";

export default defineComponent({
  name: "LibraryImportedTab",
  computed: {
    resourceType() {
      return resourceType;
    }
  },
  components: {InlineSvg, CollectionList, TextsList},
  props: {
    pathParams: {type: Object as PropType<{ learningLanguage: string, resourceType: "texts" | "collections" }>, required: true},
    queryParams: {type: Object as PropType<{ page: number, pageSize: number, searchQuery: string, level: string | string[], hasAudio: boolean }>, required: true},
  },
  data() {
    return {
      collections: [] as CollectionSchema[],
      texts: [] as TextSchema[],
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
    await this.fetchImported();
  },
  methods: {
    async fetchImported() {
      if (this.pathParams.resourceType == "texts")
        await this.fetchImportedTexts();
      else
        await this.fetchImportedCollections();
    },
    async fetchImportedTexts() {
      this.isLoading = true;
      const response = await this.textStore.fetchTexts({
        languageCode: this.pathParams.learningLanguage,
        addedBy: "me",
        level: this.queryParams.level,
        hasAudio: this.queryParams.hasAudio,
        searchQuery: this.queryParams.searchQuery || undefined,
        sortBy: "createdDate",
        sortOrder: "desc",
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
      });
      this.texts = response.data;
      this.pageCount = response.pageCount;
      this.isLoading = false;
    },
    async fetchImportedCollections() {
      this.isLoading = true;
      const response = await this.collectionStore.fetchCollections({
        languageCode: this.pathParams.learningLanguage,
        addedBy: "me",
        searchQuery: this.queryParams.searchQuery || undefined,
        sortBy: "createdDate",
        sortOrder: "desc",
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
      }, {secure: true});
      this.collections = response.data;
      this.pageCount = response.pageCount;
      this.isLoading = false;
    },
  },
  setup() {
    return {
      icons,
      textStore: useTextStore(),
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
