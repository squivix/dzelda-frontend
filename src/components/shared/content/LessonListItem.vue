<template>
  <BaseCard>
    <template v-slot:all>
      <router-link
          :to="{name:'lesson', params:{lessonId:lesson.id}}"
          class="inv-link">
        <article>
          <div class="item-content">
            <BaseImage :image-url="imageUrl"
                       :fall-back-url="icons.bookOpen"
                       alt-text="lesson image"/>
            <div class="title-stats">
              <div class="title-subtitle">
                <h4>{{ lesson.title }}</h4>
                <router-link v-if="showCourse && lesson.course"
                             :to="{name:'course', params:{ courseId:lesson.course.id}}"
                             class="link-parent">
                  <p class="course-title">{{ lesson.course.title }}</p>
                </router-link>
                <p v-if="'timeViewed' in lesson" class="time-viewed">{{ timeViewed }}</p>
              </div>
              <div class="stats">
                <div class="stats-count">
                  <span class="vocabs-indicator new-vocabs"></span>
                  <div>
                    <span>{{ lesson.vocabsByLevel![VocabLevelSchema.NEW] }} (</span>
                    <span :class="newVocabsPercentageClass">{{ newVocabsPercentage }}%</span>
                    <span>)</span>
                  </div>

                </div>
                <div class="stats-count">
                  <span class="vocabs-indicator saved-vocabs"></span>
                  <span>{{ savedVocabsCount }}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </router-link>
    </template>
  </BaseCard>
</template>

<script lang="ts">
import BaseCard from "@/components/ui/BaseCard.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import {LessonHistoryEntrySchema, LessonSchema, VocabLevelSchema, VocabsByLevelSchema} from "dzelda-common";
import {PropType} from "vue";
import {useStore} from "@/stores/backend/rootStore.js";
import constants from "@/constants.js";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import {format} from "timeago.js";

export default {
  name: "LessonListItem",
  components: {InlineSvg, BaseImage, BaseCard},
  props: {
    lesson: {type: Object as PropType<LessonSchema | LessonHistoryEntrySchema>, required: true},
    showCourse: {type: Boolean, required: false, default: true}
  },
  computed: {
    timeViewed() {
      if ("timeViewed" in this.lesson)
        return format(this.lesson.timeViewed);
    },
    imageUrl() {
      return (this.lesson.image || this.lesson.course?.image) ?? "";
    },
    newVocabsPercentage() {
      const total = this.lesson.vocabsByLevel![VocabLevelSchema.NEW] + this.savedVocabsCount;
      if (total == 0) //prevent NaN% from dividing 0/0
        return 0.00;
      const percentage = (this.lesson.vocabsByLevel![VocabLevelSchema.NEW] / total) * 100;
      return Number(percentage.toFixed(2));
    },
    newVocabsPercentageClass() {
      const p = this.newVocabsPercentage;
      if (p >= 0 && p <= constants.NEW_VOCABS_PERCENTAGE_THRESH.easy)
        return "easy";
      else if (p <= constants.NEW_VOCABS_PERCENTAGE_THRESH.medium)
        return "medium";
      else
        return "hard";
    },
    savedVocabsCount() {
      let count = 0;
      let level: keyof VocabsByLevelSchema;   //typescript is acting up :/
      for (level in this.lesson.vocabsByLevel!) {
        if (Number(level) !== VocabLevelSchema.NEW && Number(level) !== VocabLevelSchema.IGNORED) {
          count += this.lesson.vocabsByLevel![level];
        }
      }
      return count;
    }
  },
  setup() {
    return {
      icons,
      store: useStore(),
      VocabLevelSchema
    };
  }
};
</script>

<style scoped>
.base-card {
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


.title-stats {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  align-items: flex-start;
  height: 100%;
}

.vocabs-indicator {
  width: 15px;
  height: 15px;
}

.new-vocabs {
  background-color: var(--vocab-new-color);
}

.saved-vocabs {
  background-color: var(--vocab-level-1-color);
}

.stats {
  display: flex;
  column-gap: 1rem;
  align-items: center;
}

.stats-count {
  display: flex;
  flex-direction: row;
  column-gap: 0.25rem;
  align-items: center;
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

.course-title {
  color: grey;
  margin-bottom: 0.5rem;
}

.time-viewed {
  color: gray;
}


a:hover {
  text-decoration: none;
}

.more-button:hover {
  cursor: pointer;
}

/*noinspection CssUnusedSymbol*/
.easy {
  color: green;
}

/*noinspection CssUnusedSymbol*/
.medium {
  color: #E09134;
}

/*noinspection CssUnusedSymbol*/
.hard {
  color: red;
}

@media screen and (max-width: 500px) {
  .item-content {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .title-stats {
    align-self: stretch;
  }
}
</style>
