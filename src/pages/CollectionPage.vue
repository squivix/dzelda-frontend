<template>
  <BaseCard v-if="!loading && collection" :title="collection.title" class="collection-base-card main-page-base-card">
    <template v-slot:content>
      <div class="page-wrapper">
        <div class="side-pane">

          <BaseImage class="collection-image" :image-url="collection.image" :fall-back-url="icons.books" alt-text="collection image"/>
          <h3>Created by</h3>
          <p>{{ collection.addedBy }}</p>
          <h3>Description</h3>
          <textarea class="description" readonly>{{ collection.description }}</textarea>
          <div class="buttons-div">
            <button class="bookmark-button inv-button" @click="toggleIsBookmarked">
              <inline-svg :src="icons.bookmark"
                          :class="`${collection.isBookmarked?'bookmark-filled':'bookmark-hollow'}`"/>
            </button>
            <router-link :to="{ name: 'edit-collection' , params:{collectionId:collection.id}}" v-if="collection.addedBy==userStore.userAccount?.username">
              <inline-svg :src="icons.pen"/>
            </router-link>
          </div>
        </div>
        <div class="lessons-pane">
          <h2>Lessons</h2>
          <ol class="lesson-list" v-if="collection.lessons.length>0">
            <li v-for="lesson in collection.lessons" :key="lesson.id" class="lesson">
              <LessonListItem :lesson="{...lesson, collection}" :showCollection="false">
              </LessonListItem>
            </li>
          </ol>
          <EmptyScreen v-else message="No lessons in collection"></EmptyScreen>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import {useLessonStore} from "@/stores/backend/lessonStore.js";
import {CollectionSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {PropType} from "vue";

export default {
  name: "CollectionPage",
  components: {BaseImage, EmptyScreen, InlineSvg, LessonListItem, BaseCard},
  props: {
    pathParams: {type: Object as PropType<{ collectionId: number }>, required: true}
  },
  data() {
    return {
      collection: null as CollectionSchema | null,
      loading: true,
    };
  },
  async mounted() {
    this.loading = true;
    await this.fetchCollection();
    this.loading = false;
  },
  methods: {
    async fetchCollection() {
      this.collection = await this.collectionStore.fetchCollection({collectionId: this.pathParams.collectionId});
    },
    async toggleIsBookmarked() {
      if (this.collection!.isBookmarked)
        await this.collectionStore.removeCollectionFromUserBookmarks({collectionId: this.collection!.id});
      else
        await this.collectionStore.addCollectionToUserBookmarks({collectionId: this.collection!.id});
      this.collection!.isBookmarked = !this.collection!.isBookmarked;
    },
  },
  setup() {
    return {
      icons,
      collectionStore: useCollectionStore(),
      lessonStore: useLessonStore(),
      userStore: useUserStore(),
    };
  }
};
</script>

<style scoped>
.collection-base-card {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  justify-content: flex-start;
  align-items: stretch;
}

.page-wrapper {
  display: flex;
  column-gap: 1rem;
  justify-content: space-between;
}

.side-pane {
  flex-basis: auto;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.collection-image {
  align-self: center;
}

.lessons-pane {
  flex: 3;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.description {
  min-height: 15vh;
  word-wrap: break-word;
  resize: none;
  border: 1px solid lightgray;

}

.buttons-div {
  display: flex;
  column-gap: 1rem
}

.bookmark-button:hover {
  cursor: pointer;
}

.bookmark-button svg {
  width: 20px;
  height: 20px;
  overflow: visible;
}

.bookmark-filled {
  fill: var(--primary-color);
  stroke: var(--primary-color);
}

.bookmark-hollow {
  fill: none;
  stroke-width: 56px;
  stroke: var(--primary-color);
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-weight: bold;
}

.lesson-list {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

@media screen and (max-width: 750px) {
  .page-wrapper {
    flex-direction: column;
  }
}
</style>
