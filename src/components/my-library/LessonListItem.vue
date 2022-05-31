<template>
    <base-card>
        <template v-slot:all>
            <article>
                <router-link :to="`lessons/${lesson.id}`">
                    <h4>{{lesson.title}}</h4>
                </router-link>
            </article>
        </template>
    </base-card>
</template>

<script>
    import BaseCard from "@/components/ui/BaseCard";

    export default {
        name: "LessonListItem",
        props: {
            lesson: {
                type: Object,
                required: true
            }
        },
        components: {BaseCard}
    }
</script>

<style scoped>
    .base-card {
        padding: 20px 3vw;
    }
</style>