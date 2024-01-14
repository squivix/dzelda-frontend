<template>
  <router-link
      :to="{name:'course', params:{courseId:course.id}}">
    <BaseCard>
      <template v-slot:all>
        <article class="course-article">
          <BaseImage :image-url="imageUrl" :fall-back-url="icons.books"
                     alt-text="course image"></BaseImage>

          <div class="title-row">
            <h4>{{ course.title }}</h4>

            <BaseDropDown :id="`course-card-${course.id}`"
                          group="course-cards"
                          :centered="false"
                          :round="false" v-if="course.addedBy==userStore.userAccount?.username">
              <template v-slot:button>
                <inline-svg :src="icons.dotsStacked" class="more-button"/>
              </template>
              <template v-slot:menu>
                <ol class="dropdown-list">
                  <li>
                    <router-link :to="{ name: 'edit-course' , params:{courseId:course.id}}">
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
import {CourseSchema} from "dzelda-common";
import InlineSvg from "vue-inline-svg";
import {icons} from "@/icons.js";
import BaseCard from "@/components/ui/BaseCard.vue";
import {useUserStore} from "@/stores/backend/userStore.js";

export default {
  name: "CourseCard",
  components: {InlineSvg, BaseCard, BaseImage, BaseDropDown},
  data() {
    return {};
  },
  props: {
    course: {
      type: Object as PropType<CourseSchema>,
      required: true,
    }
  },
  computed: {
    imageUrl() {
      return this.course.image;
    },
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
