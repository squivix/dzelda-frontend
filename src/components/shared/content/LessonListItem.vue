<template>
  <base-card>
    <template v-slot:all>
      <article>
        <div class="item-content">

          <img v-if="imageUrl&&!imageError" :src="imageUrl" @error="setDefaultImage" alt="lesson image"
               class="lesson-image">
          <div v-else class="lesson-image default-lesson-image">
            <FontAwesomeIcon icon="book-open" @error="setDefaultImage" alt="Default lesson image"></FontAwesomeIcon>
          </div>
          <div class="title-stats">
            <div class="title-subtitle">
              <router-link
                  :to="{name:'lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}"
                  class="link">
                <h4>{{ lesson.title }}</h4>
              </router-link>

              <router-link v-if="showCourse"
                           :to="{name:'course', params:{learningLanguage:$route.params.learningLanguage, courseId:lesson.course.id}}">
                <p class="course-title">{{ lesson.course.title }}</p>
              </router-link>
            </div>

            <div class="stats">
              <div class="stats-count">
                <span class="vocabs-indicator new-vocabs"></span>
                <div>
                  <span>{{ lesson.vocabsCount.new }} (</span>
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

        <base-drop-down
            :label="`lesson-item-${lesson.id}`"
            group="lesson-items"
            :centered="false"
            :round="false">
          <template v-slot:button>
            <FontAwesomeIcon icon="ellipsis-vertical" class="more-button">

            </FontAwesomeIcon>
          </template>
          <template v-slot:menu>

            <!--TODO:Only show link if user is authorized to edit lesson-->
            <base-drop-down-list class="profile-menu" :list-items="[
              {
                text:'Edit',
                link:{ name: 'edit-lesson' , params:{lessonId:lesson.id}},
                icon:'pen'
              },{
                text:'Details',
                link:{ name: 'edit-lesson' , params:{lessonId:lesson.id}},
                icon:'pen'
              },
          ]">
            </base-drop-down-list>
          </template>
        </base-drop-down>
      </article>
    </template>
  </base-card>
</template>

<script>
import BaseCard from "@/components/ui/BaseCard.vue";
import {useStore} from "@/stores/index.js";
import {NEW_VOCABS_PERCENTAGE_THRESH} from "@/constants.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import BaseDropDownList from "@/components/ui/BaseDropDownList.vue";

export default {
  name: "LessonListItem",
  components: {BaseDropDown, BaseCard, FontAwesomeIcon, BaseDropDownList},
  data() {
    return {
      imageError: false
    };
  },
  props: {
    lesson: {
      type: Object,
      required: true
    },
    showCourse: {
      type: Boolean,
      required: false,
      default: true,
    }
  },
  computed: {
    imageUrl() {
      return this.lesson.image ?? this.lesson.course.image;
    },
    newVocabsPercentage() {
      const total = this.lesson.vocabsCount.new + this.savedVocabsCount;
      const percentage = (this.lesson.vocabsCount.new / total) * 100;
      return +percentage.toFixed(2);
    },
    newVocabsPercentageClass() {
      const p = this.newVocabsPercentage;
      if (p >= 0 && p <= NEW_VOCABS_PERCENTAGE_THRESH.easy)
        return "easy";
      else if (p <= NEW_VOCABS_PERCENTAGE_THRESH.medium)
        return "medium";
      else if (p <= NEW_VOCABS_PERCENTAGE_THRESH.hard)
        return "hard";
    },
    savedVocabsCount() {
      let count = 0;
      for (let level in this.lesson.vocabsCount) {
        if (level !== "new" && level !== "ignored") {
          count += this.lesson.vocabsCount[level];
        }
      }
      return count;
    }
  },
  methods: {
    setDefaultImage(event) {
      this.imageError = true;
    }
  },
  created() {
    this.store = useStore();
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

.lesson-image {
  width: 200px;
  height: 200px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  flex-shrink: 0;
}

.default-lesson-image {
  flex-shrink: 0;
  background-color: var(--primary-color);
  display: grid;
  place-items: center;
}

.default-lesson-image svg {
  color: var(--on-primary-color);
  width: 120px;
  height: 120px;
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
  background-color: #aee0f4;
}

.saved-vocabs {
  background-color: #ffeda1;
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
  margin-bottom: 5px;
  color: black;
  /*3 lines max*/
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.course-title {
  color: gray;
}

a:hover {
  text-decoration: none;
}

.more-button {
  align-self: flex-start;
  padding: 0.2rem 0.5rem;
}

.more-button:hover {
  cursor: pointer;
}

.easy {
  color: green;
}

.medium {
  color: #E09134;
}

.hard {
  color: red;
}
</style>