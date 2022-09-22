<template>
  <base-card>
    <template v-slot:all>
      <article>
        <div class="card-content">
          <img :src="imageUrl" @error="setDefaultImage" alt="lesson image" class="lesson-image">
          <div>
            <router-link
                :to="{name:'lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}"
                class="link">
              <h4>{{ lesson.title }}</h4>
            </router-link>

            <router-link v-if="showCourse"
                         :to="{name:'course', params:{learningLanguage:$route.params.learningLanguage, courseId:lesson.course.id}}">
              <p class="course-title">{{ lesson.course.title }}</p>
            </router-link>
            <!--TODO:Only show link if user is authorized to edit lesson-->
            <router-link
                :to="{name:'edit-lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}">
              <p>Edit</p>
            </router-link>
          </div>
        </div>
        <button class="more-button inv-button">
          <FontAwesomeIcon icon="ellipsis-vertical">

          </FontAwesomeIcon>
        </button>
      </article>
    </template>
  </base-card>
</template>

<script>
import BaseCard from "@/components/ui/BaseCard.vue";
import {useStore} from "@/stores/index.js";
import {BLANK_IMAGE_URL} from "@/constants.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "LessonListItem",
  components: {BaseCard, FontAwesomeIcon},
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
      return this.lesson.image ?? this.lesson.course.image ?? BLANK_IMAGE_URL;
    },
  },
  methods: {
    setDefaultImage(event) {
      if (event.target.src !== BLANK_IMAGE_URL)
        event.target.src = BLANK_IMAGE_URL;
    }
  },
  created() {
    this.store = useStore();
  }
}
</script>

<style scoped>
.base-card {
  margin: 0;
  padding: 20px 2vw;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
  border-color: lightgray;
  border-radius: 5px;
}

article {
  display: flex;
  justify-content: space-between;
}

.card-content {
  display: flex;
  flex-direction: row;
  column-gap: 1rem;
  justify-content: flex-start;
  align-items: flex-start;
}

.lesson-image {
  width: 200px;
  height: 200px;
  /*border: 3px solid var(--primary-color-dark);*/
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

h4 {
  font-size: 1.35rem;
  margin-top: 20px;
  margin-bottom: 5px;
  color: black;
}

.course-title {
  color: gray;
}

a:hover {
  text-decoration: none;
}

.more-button {
  align-self: flex-start;
  padding: 0.5rem;
}

.more-button:hover {
  cursor: pointer;
}
</style>