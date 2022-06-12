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
    import BaseCard from "@/components/ui/BaseCard";
    import LessonListItem from "@/components/content/LessonListItem";

    export default {
        name: "CourseViewer",
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
                this.course = await this.$store.dispatch("fetchCourse", {
                    courseId: this.$route.params.courseId,
                    languageCode: this.$route.params.learningLanguage,
                });
            },
            async fetchCourseLessons() {
                this.lessons = await this.$store.dispatch("fetchCourseLessons", {
                    courseId: this.$route.params.courseId,
                    // lafetchCoursenguageCode: this.$route.params.learningLanguage,
                });
            }
        }
    }
</script>

<style scoped>
    .course-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        display: flex;
        flex-direction: column;
        row-gap: 1.25rem;
        justify-content: flex-start;
        align-items: stretch;
    }

    .lesson-list{
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }
</style>