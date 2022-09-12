<template>
    <BaseCard v-if="!loading" :title="course.title" class="course-base-card">
        <template v-slot:content>
            <ol class="lesson-list">
                <li v-for="lesson in lessons" :key="lesson.id" class="lesson">
                    <lesson-list-item :lesson="{...lesson, course}" :show-course="false">
                    </lesson-list-item>
                </li>
            </ol>
        </template>
    </BaseCard>
</template>

<script>
import BaseCard from "@/components/ui/BaseCard.vue";
import LessonListItem from "@/components/shared/content/LessonListItem.vue";
import {useCourseStore} from "@/stores/course.js";

export default {
        name: "CoursePage",
        components: {LessonListItem, BaseCard},
        data() {
            return {
                course: null,
                lessons: null,
                loading: true,
            };
        },
        async mounted() {
            this.loading = true;
            await this.fetchCourse();
            await this.fetchCourseLessons();
            this.loading = false;
        },
        methods: {
            async fetchCourse() {
                this.course = await this.courseStore.fetchCourse({courseId: this.$route.params.courseId});
            },
            async fetchCourseLessons() {
                this.lessons = await this.courseStore.fetchCourseLessons({courseId: this.$route.params.courseId});
            }
        },
        created() {
            this.courseStore = useCourseStore();
        }
    }
</script>

<style scoped>
    .course-base-card {
        display: flex;
        flex-direction: column;
        row-gap: 1.25rem;
        justify-content: flex-start;
        align-items: stretch;
    }

    .lesson-list {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }
</style>