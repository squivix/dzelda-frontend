<template>
    <div>
        <ol v-if="guidedCourses" class="course-list">
            <course-card v-for="course in guidedCourses" :key="course.id" :course="course"></course-card>
        </ol>
    </div>
</template>

<script>
    import CourseCard from "@/components/content/CourseCard";

    export default {
        name: "GuidedTab",
        components: {CourseCard},
        data() {
            return {
                guidedCourses: null
            };
        },
        methods: {
            async fetchGuidedCourses() {
                return await this.$store.dispatch("fetchGuidedCourses", {
                    language: this.$route.params.learningLanguage,
                })
            }
        },
        async mounted() {
            this.guidedCourses = await this.fetchGuidedCourses();
        }
    }
</script>

<style scoped>

    .course-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
        grid-row-gap: 1rem;
        grid-column-gap: 0.75rem;
    }

    .course-list li {
        max-width: 400px;
    }
</style>