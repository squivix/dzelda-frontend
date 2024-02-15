<template>
  <router-link
      :to="{name:'collection', params:{collectionId:collection.id}}">
    <BaseCard>
      <template v-slot:all>
        <article class="collection-article">
          <BaseImage :image-url="collection.image" :fall-back-url="icons.books" alt-text="collection image"/>

          <div class="title-row">
            <h4>{{ collection.title }}</h4>

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
        </article>
      </template>
    </BaseCard>
  </router-link>
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
  setup() {
    return {
      icons,
      store: useStore(),
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
  row-gap: 1rem;
}

.title-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  margin-bottom: 15px;
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

.more-button {
  color: gray;
  text-decoration: none
}

.more-button:hover {
  cursor: pointer;;
}

:deep(.dropdown-label) {
  padding: 0.5rem;
}
</style>
