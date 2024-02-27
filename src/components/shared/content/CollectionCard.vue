<template>

  <BaseCard>
    <template v-slot:all>
      <router-link :to="{name:'collection', params:{collectionId:collection.id}}">
        <article class="collection-article">
          <BaseImage class="collection-image" :image-url="collection.image" :fall-back-url="icons.books" alt-text="collection image"/>

          <div class="title-row">
            <h4>{{ collection.title }}</h4>
            <div class="buttons-div">
              <button class="bookmark-button inv-button icon-text-wrapper" @click.prevent="toggleIsBookmarked">
                <inline-svg :src="icons.bookmark"
                            :class="`${collection.isBookmarked?'bookmark-filled':'bookmark-hollow'}`"/>
              </button>
              <BaseDropDown :id="`collection-card-${collection.id}`"
                            group="collection-cards"
                            :centered="false"
                            :round="false" v-if="collection.addedBy==userStore.userAccount?.username">
                <template v-slot:button>
                  <inline-svg :src="icons.dotsStacked" class="more-button"/>
                </template>
                <template v-slot:menu>
                  <ol class="dropdown-list">
                    <li>
                      <router-link :to="{ name: 'edit-collection' , params:{collectionId:collection.id}}">
                        <inline-svg :src="icons.pen"/>
                        <span>Edit</span>
                      </router-link>
                    </li>
                  </ol>
                </template>
              </BaseDropDown>
            </div>
          </div>
        </article>
      </router-link>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import {useStore} from "@/stores/backend/rootStore.js";
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {PropType} from "vue";
import {CollectionSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useCollectionStore} from "@/stores/backend/collectionStore.js";

export default {
  name: "CollectionCard",
  components: {InlineSvg, BaseCard, BaseImage, BaseDropDown},
  data() {
    return {};
  },
  props: {
    collection: {
      type: Object as PropType<CollectionSchema>,
      required: true,
    }
  },
  methods: {
    toggleIsBookmarked() {
      this.collectionStore.toggleCollectionBookmark(this.collection);
      this.collection.isBookmarked = !this.collection.isBookmarked;
    }
  },
  setup() {
    return {
      icons,
      collectionStore: useCollectionStore(),
      userStore: useUserStore(),
    };
  }
};
</script>

<style scoped>
.base-card {
  margin: 0;
  height: 100%;
  padding: 20px 2vw;
}

.collection-article {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 0.5rem;
}

.title-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-top: 10px;
}

a:hover {
  text-decoration: none;
}

h4 {
  font-size: 1.25rem;
  max-lines: 2;
  color: var(--on-background-color);
  /*3 lines max*/
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.buttons-div {
  display: flex;
  align-items: center;
}

.bookmark-button {
  padding: 0.5rem 0;
}

.bookmark-button svg {
  width: 20px;
  height: 20px;
}

.more-button {
  color: gray;
  text-decoration: none;
  cursor: pointer;
}

:deep(.dropdown-label) {
  padding: 0.5rem 0 0.5rem 0.5rem;
}

@media screen and (max-width: 400px) {
  .collection-image {
    width: 150px;
    height: 150px;
  }
}
</style>
