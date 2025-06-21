<template>
  <BaseCard class="text-card">
    <template v-slot:all>
      <router-link
          :to="{name:'text', params:{textId:text.id}}"
          class="inv-link">
        <article>
          <div class="item-content">
            <BaseImage :image-url="imageUrl"
                       :fall-back-url="icons.bookOpen"
                       class="text-image"
                       alt-text="text image"/>
            <div class="title-stats">
              <div class="title-subtitle">
                <h4>{{ text.title }}</h4>
                <router-link v-if="showCollection && text.collection"
                             :to="{name:'collection', params:{ collectionId:text.collection.id}}"
                             class="link-parent">
                  <p class="collection-title">{{ text.collection.title }}</p>
                </router-link>
                <p v-if="'timeViewed' in text" class="time-viewed">{{ timeViewed }}</p>
              </div>
              <VocabLevelStats :vocabsByLevel="text.vocabsByLevel!" :isProcessing="text.isProcessing"/>
            </div>
          </div>
          <div class="item-side">
            <button class="bookmark-button inv-button icon-text-wrapper" @click.prevent="toggleIsBookmarked">
              <inline-svg :src="icons.bookmark"
                          :class="`${text.isBookmarked?'bookmark-filled':'bookmark-hollow'}`"/>
            </button>
            <BaseDropDown
                :id="`text-item-${text.id}`"
                :centered="false"
                :round="false">
              <template v-slot:button>
                <button class="more-button inv-button">
                  <inline-svg :src="icons.dotsStacked" class="gray-icon"/>
                </button>
              </template>
              <template v-slot:menu>
                <ol class="dropdown-list">
                  <li v-if="text.addedBy==userStore.userAccount!.username">
                    <router-link :to="{ name: 'update-text' , params:{textId:text.id}}">
                      <inline-svg :src="icons.pen"/>
                      <span>Edit</span>
                    </router-link>
                  </li>
                  <li>
                    <button class="inv-button" @click.stop.prevent="$emit('onHideTextClicked',text)">
                      <inline-svg :src="icons.hide"/>
                      <span>Hide</span>
                    </button>
                  </li>
                  <li>
                    <button class="inv-button" @click.stop.prevent="$emit('onReportTextClicked',text)">
                      <inline-svg :src="icons.flag"/>
                      <span>Report</span>
                    </button>
                  </li>
                </ol>
              </template>
            </BaseDropDown>
          </div>
        </article>
      </router-link>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {TextHistoryEntrySchema, TextSchema, VocabLevel} from "dzelda-common";
import {PropType} from "vue";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {format} from "timeago.js";
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import {useUserStore} from "@/stores/backend/userStore.js";
import {useTextStore} from "@/stores/backend/textStore.js";
import ConfirmDialog from "@/components/shared/ConfirmDialog.vue";
import VocabLevelStats from "@/components/shared/content/VocabLevelStats.vue";
import {useLanguageStore} from "@/stores/backend/languageStore.js";

export default {
  name: "TextListItem",
  components: {VocabLevelStats, ConfirmDialog, InlineSvg, BaseDropDown, BaseImage, BaseCard},
  emits: ["onHideTextClicked", "onReportTextClicked"],
  props: {
    text: {type: Object as PropType<TextSchema | TextHistoryEntrySchema>, required: true},
    showCollection: {type: Boolean, required: false, default: true}
  },
  computed: {
    timeViewed() {
      if ("timeViewed" in this.text)
        return format(this.text.timeViewed);
    },
    imageUrl() {
      return (this.text.image || this.text.collection?.image) ?? "";
    },
    readingDirection() {
      return this.languageStore.currentLanguage!.isRtl ? "rtl" : "ltr";
    }
  },
  methods: {
    toggleIsBookmarked() {
      this.textStore.toggleTextBookmark(this.text!);
      this.text!.isBookmarked = !this.text!.isBookmarked;
    }
  },
  setup() {
    return {
      VocabLevel,
      icons,
      textStore: useTextStore(),
      userStore: useUserStore(),
      languageStore: useLanguageStore(),
    };
  }
};
</script>

<style scoped>
.text-card {
  margin: 0;
  padding: 20px 2vw;
  box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px 0, rgba(0, 0, 0, 0.1) 0 0 1px 0;
  border-color: lightgray;
  border-radius: 5px;
}

article {
  display: flex;
  justify-content: space-between;
}

.item-content {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  justify-content: flex-start;
  align-items: flex-start;
}

.item-side {
  display: flex;
  align-items: center;
  align-self: flex-start;
}

.bookmark-button {
  padding: 0.5rem;
}

.bookmark-button svg {
  width: 18px;
  height: 18px;
}

.title-stats {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  align-items: flex-start;
  height: 100%;
}

.text-image {
  align-self: center;
  width: 20vw;
  height: 20vw;
  max-width: 200px;
  max-height: 200px;
  min-width: 140px;
  min-height: 140px;
}

.title-subtitle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

}

.title-subtitle a {
  display: inline-block;
}

h4 {
  font-size: 1.35rem;
  margin-top: 20px;
  padding-bottom: 5px;
  /*3 lines max*/
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.collection-title {
  color: grey;
  margin-bottom: 0.5rem;
}

.time-viewed {
  color: gray;
}

a:hover {
  text-decoration: none;
}

.more-button {
  color: gray;
  padding: 0.5rem;
  cursor: pointer;
}


@media screen and (max-width: 500px) {
  article {
    flex-direction: column-reverse;
    row-gap: 1rem;
  }

  .text-image {
    width: 200px;
    height: 200px;
  }

  .item-content {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .item-side {
    align-self: flex-end;
  }

  .title-stats {
    align-self: stretch;
  }
}

.processing-div {
  display: flex;
  align-items: center;
  column-gap: 0.7rem;
  color: dimgray;
}

.processing-icon {
  width: 18px;
  height: 18px;
  color: lightgray;
}
</style>
