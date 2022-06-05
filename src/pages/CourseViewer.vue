<template>
    <h1>Course viewer</h1>
</template>

<script>
    export default {
        name: "CourseViewer",
        data() {
            return {
                course: null
            };
        },
        mounted() {
            this.fetchCourse();
        },
        methods: {
            fetchCourse() {
                this.$store.dispatch("fetchCourse", {
                    courseId: this.$route.params.courseId,
                    languageCode: this.$route.params.learningLanguage,
                });
            }
        }
    }
</script>

<style scoped>

</style>