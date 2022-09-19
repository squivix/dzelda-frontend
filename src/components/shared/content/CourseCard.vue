<template>
  <base-card>
    <template v-slot:all>
      <article class="course-article">
        <img :src="imageUrl" @error="setDefaultImage" alt="course image" class="course-image">
        <router-link
            :to="{name:'course', params:{learningLanguage:$route.params.learningLanguage, courseId:course.id}}">
          <h4>{{ course.title }}</h4>
        </router-link>
        <!--TODO:Only show link if user is authorized to edit course-->
        <router-link
            :to="{name:'edit-course', params:{learningLanguage:$route.params.learningLanguage, courseId:course.id}}">
          <h4>Edit</h4>
        </router-link>

      </article>
    </template>
  </base-card>
</template>

<script>
import {useStore} from "@/stores/index.js";
import {BLANK_IMAGE_URL} from "@/constants.js";

export default {
  name: "CourseCard",
  props: {
    course: {
      type: Object,
      required: true,
    }
  },
  computed: {
    imageUrl() {
      if (this.course.image !== null)
        return this.course.image;
      else
        return BLANK_IMAGE_URL;
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
}

.course-article {
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
}

.course-image {
  /*border: 3px solid var(--primary-color-dark);*/
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

h4 {
  font-size: 1.35rem;
  margin-top: 20px;
  margin-bottom: 5px;
  /*white-space:nowrap;*/
  /*text-overflow: ellipsis;*/
  /*overflow:hidden;*/
}
</style>