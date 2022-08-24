<template>
    <div>
        <ul v-if="recommendedLessons" class="lessons-list">
            <lesson-list-item v-for="lesson in recommendedLessons" :key="lesson.id" :lesson="lesson"></lesson-list-item>
        </ul>
    </div>
</template>

<script>
    import LessonListItem from "@/components/content/LessonListItem";

    export default {
        name: "BrowseTab",
        components: {LessonListItem},
        data() {
            return {recommendedLessons: null};
        },
        methods: {
            async fetchRecommendedLessons() {
                return (await this.$store.dispatch("fetchRecommendedLessons", {
                    language: this.$route.params.learningLanguage,
                }))["results"];
            }
        },
        async mounted() {
            this.recommendedLessons = await this.fetchRecommendedLessons();
        }
    }
</script>

<style scoped>
    .lessons-list {
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
    }
</style>