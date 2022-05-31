<template>
    <base-card title="My Library">
        <template v-slot:content>
            <lesson-list-item v-for="lesson in lessons"
                              :key="lesson.id"
                              :lesson="lesson">
            </lesson-list-item>
        </template>

    </base-card>
</template>
<script>
    import BaseCard from "@/components/ui/BaseCard";
    import LessonListItem from "@/components/my-library/LessonListItem";

    export default {
        name: "MyLibraryPage",
        components: {LessonListItem, BaseCard},
        data() {
            return {
                lessons: null
            };
        },
        async mounted() {
            await this.fetchLessons();
        },
        methods: {
            async fetchLessons() {
                const user_lessons = await this.$store.dispatch("fetchUserLessons");
                this.lessons = user_lessons;
            }
        }
    }
</script>

<style scoped>

</style>