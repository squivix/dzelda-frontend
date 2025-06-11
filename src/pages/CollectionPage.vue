<template>
  <BaseCard v-if="!loading && collection" :title="collection.title" class="collection-base-card main-page-base-card">
    <template v-slot:content>
      <div class="page-wrapper">
        <div class="side-pane">
          <div class="side-pane-top">
            <BaseImage class="collection-image" :image-url="collection.image" :fall-back-url="icons.books" alt-text="collection image"/>
            <VocabLevelStats :vocabsByLevel="collection.vocabsByLevel!" :isProcessing="isProcessing"/>
          </div>
          <div class="side-pane-bottom">
            <div class="created-by-buttons-row">
              <h3>Created by</h3>
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
            <p>{{ collection.addedBy }}</p>
            <h3>Description</h3>
            <textarea class="description" readonly>{{ collection.description }}</textarea>
          </div>
        </div>
        <div class="texts-pane">
          <h2>Texts</h2>
          <ol class="text-list" v-if="collection.texts.length>0">
            <li v-for="text in collection.texts" :key="text.id" class="text">
              <TextListItem class="text-list-item" :text="{...text, collection}" :showCollection="false">
              </TextListItem>
            </li>
          </ol>
          <EmptyScreen v-else message="No texts in collection"></EmptyScreen>
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import TextListItem from "@/components/shared/content/TextListItem.vue";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";
import {useTextStore} from "@/stores/backend/textStore.js";
import {CollectionSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {useUserStore} from "@/stores/backend/userStore.js";
import EmptyScreen from "@/components/shared/EmptyScreen.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {PropType} from "vue";
import VocabLevelStats from "@/components/shared/content/VocabLevelStats.vue";

export default {
  name: "CollectionPage",
  components: {VocabLevelStats, BaseImage, EmptyScreen, InlineSvg, TextListItem, BaseCard},
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
  computed: {
    isProcessing() {
      if (this.collection)
        return this.collection.texts.some(t => t.isProcessing)
      else
        return false;
    }
  },
  methods: {
    async fetchCollection() {
      this.collection = await this.collectionStore.fetchCollection({collectionId: this.pathParams.collectionId});
    },
    toggleIsBookmarked() {
      this.collectionStore.toggleCollectionBookmark(this.collection!)
      this.collection!.isBookmarked = !this.collection!.isBookmarked;
    },
  },
  setup() {
    return {
      icons,
      collectionStore: useCollectionStore(),
      textStore: useTextStore(),
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
  column-gap: min(3vw, 2rem);
  justify-content: space-between;
}

.side-pane {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
}

.collection-image {
  align-self: center;
}

.side-pane-top {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
}

.stats {
  flex-direction: column;
  row-gap: 0.75rem;
  align-items: flex-start;
}

.side-pane-bottom {
  flex-basis: auto;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;

}

.texts-pane {
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

.created-by-buttons-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.5rem;
}

h3 {
  font-weight: bold;
}

.text-list {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

@media screen and (max-width: 750px) {
  .page-wrapper {
    flex-direction: column;
    row-gap: 1rem;
  }

  .side-pane {
    flex-direction: row;
    column-gap: 1.5rem;
  }

  .side-pane-bottom {
    flex-grow: 1;
  }

  .text-list-item:deep(.image) {
    width: 175px;
    height: 175px;
  }
  .stats {
    flex-direction: row;
  }

}

@media screen and (max-width: 500px) {
  .side-pane {
    flex-direction: column;
    row-gap: 1rem;
  }
}
</style>
