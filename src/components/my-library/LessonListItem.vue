<template>
    <base-card>
        <template v-slot:all>
            <article class="lesson-article">
                <img :src="imageUrl" alt="lesson image" class="lesson-image">
                <div>
                    <router-link
                            :to="{name:'lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}">
                        <h4>{{lesson.title}}</h4>
                    </router-link>

                    <router-link v-if="showCourse"
                                 :to="{name:'course', params:{learningLanguage:$route.params.learningLanguage, courseId:lesson.course.id}}">
                        <p>{{lesson.course.title}}</p>
                    </router-link>
                </div>
            </article>
        </template>
    </base-card>
</template>

<script>
    import BaseCard from "@/components/ui/BaseCard";

    export default {
        name: "LessonListItem",
        components: {BaseCard},
        props: {
            lesson: {
                type: Object,
                required: true
            },
            showCourse: {
                type: Boolean,
                required: false,
                default: true,
            }
        },
        computed: {
            imageUrl() {
                if (this.lesson.image !== null)
                    return `${this.$store.getters.baseUrl}${this.lesson.image}`;
                else if (this.lesson.course_image !== null)
                    return `${this.$store.getters.baseUrl}${this.lesson.course_image}`;
                else
                    return `${this.$store.getters.baseUrl}/media/default-course-image.png`
            }
        }
    }
</script>

<style scoped>
    .base-card {
        padding: 20px 2vw;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
        border-color: lightgray;
        border-radius: 5px;
    }

    .lesson-article {
        display: flex;
        flex-direction: row;
        column-gap: 1rem;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .lesson-image {
        width: 200px;
        height: 200px;
        /*border: 3px solid var(--primary-color-dark);*/
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        border-radius: 5px;
    }

    h4 {
        font-size: 1.35rem;
        margin-top: 20px;
        margin-bottom: 5px;
    }
</style>