<template>
  <base-card>
    <template v-slot:all>
      <article class="course-article">
        <BaseImage :image-url="this.course.image" :fall-back-url="constants.DEFAULT_COURSE_IMAGE_URL"
                   alt-text="course image"></BaseImage>

        <div class="title-row">
          <router-link
              :to="{name:'course', params:{learningLanguage:$route.params.learningLanguage, courseId:course.id}}">
            <h4>{{ course.title }}</h4>
          </router-link>

          <base-drop-down
              :label="`course-card-${course.id}`"
              group="course-cards"
              :centered="false"
              :round="false">
            <template v-slot:button>
              <FontAwesomeIcon icon="ellipsis-vertical" class="more-button">

              </FontAwesomeIcon>
            </template>
            <template v-slot:menu>

              <!--TODO:Only show link if user is authorized to edit course-->
              <base-drop-down-list class="profile-menu" :list-items="[
              {
                text:'Edit',
                link:{ name: 'edit-course' , params:{courseId:course.id}},
                icon:'pen'
              },
          ]">
              </base-drop-down-list>
            </template>
          </base-drop-down>
        </div>
      </article>
    </template>
  </base-card>
</template>

<script>
import {useStore} from "@/stores/index.js";
import {DEFAULT_COURSE_IMAGE_URL} from "@/constants.js";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import BaseDropDownList from "@/components/ui/BaseDropDownList.vue";
import BaseDropDown from "@/components/ui/BaseDropDown.vue";
import BaseImage from "@/components/ui/BaseImage.vue";
import constants from "@/constants.js";

export default {
  name: "CourseCard",
  components: {BaseImage, FontAwesomeIcon, BaseDropDown, BaseDropDownList},
  data() {
    return {
      constants: constants,
    };
  },
  props: {
    course: {
      type: Object,
      required: true,
    }
  },
  computed: {
    imageUrl() {
      return this.course.image;
    },
    defaultImageUrl() {
      return DEFAULT_COURSE_IMAGE_URL;
    }
  },
  methods: {
    setDefaultImage() {
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
  height: 100%;
  padding: 2vh 2rem;
}

.course-article {
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

.course-image {
  /*border: 3px solid var(--primary-color-dark);*/
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
}

a:hover {
  text-decoration: none;
}

h4 {
  font-size: 1.35rem;
  max-lines: 2;
  color: black;
  /*3 lines max*/
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.more-button {
  padding: 0.2rem 0.5rem;
}

.more-button:hover {
  cursor: pointer;
}


</style>