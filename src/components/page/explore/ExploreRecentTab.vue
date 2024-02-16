<template>
  <LessonList v-if="resourceType=='texts'"
              :pageCount="pageCount"
              :pageSize="queryParams.pageSize"
              :page="queryParams.page"
              :isLoading="isLoading"
              :lessons="lessons"
              emptyMessage="No lessons found in this language"
  />
  <CollectionList v-else
                  :pageCount="pageCount"
                  :pageSize="queryParams.pageSize"
                  :page="queryParams.page"
                  :isLoading="isLoading"
                  :collections="collections"
                  :showSearchFilters="false"
                  emptyMessage="No collections found in this language"/>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {CollectionSchema, LessonSchema} from "dzelda-common";
import LessonList from "@/components/shared/content/LessonList.vue";
import CollectionList from "@/components/shared/content/CollectionList.vue";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";

export default defineComponent({
  name: "ExploreRecentTab",
  components: {LessonList, CollectionList},
  data() {
    return {
      lessons: [] as LessonSchema[],
      collections: [] as CollectionSchema[],
      pageCount: 0,
      isLoading: false,
    };
  },
  props: {
    queryParams: {type: Object as PropType<{ page: number, pageSize: number }>, required: true},
    resourceType: {type: String as PropType<"texts" | "collections">, required: true},
  },
  watch: {
    queryParams() {
      this.fetchLessons();
    },
    resourceType() {
      this.fetchResources();
    }
  },
  methods: {
    async fetchResources() {
      if (this.resourceType == "texts")
        await this.fetchLessons();
      else
        await this.fetchCollections();
    },
    async fetchLessons() {
      this.isLoading = true;
      const response = await this.lessonStore.fetchLessons({
        languageCode: this.$route.params.learningLanguage as string,
        page: this.queryParams.page,
        pageSize: this.queryParams.pageSize,
        sortBy: "createdDate",
        sortOrder: "desc"
      });
      this.lessons = response.data!;
      this.pageCount = response.pageCount!;
      this.isLoading = false;
    },
    async fetchCollections() {
      this.isLoading = true;
      const response = await this.collectionStore.fetchCollections({
        languageCode: this.$route.params.learningLanguage as string,
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
      lessonStore: useLessonStore(),
      collectionStore: useCollectionStore()
    };
  }
});
</script>

<style scoped>
</style>
