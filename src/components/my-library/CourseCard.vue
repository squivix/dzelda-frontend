<template>
    <base-card>
        <template v-slot:all>
            <article class="course-article">
                <img :src="imageUrl" alt="course image" class="course-image">
                <router-link :to="`courses/${course.id}`">
                    <h4>{{course.title}}</h4>
                </router-link>

            </article>
        </template>
    </base-card>
</template>

<script>
    export default {
        name: "CourseCard",
        props: {
            course: {
                type: Object,
                required: true,
            }
        },
        computed: {
            imageUrl() {
                return `${this.$store.getters.baseUrl}${this.course.image}`;
            }
        }
    }
</script>

<style scoped>
    .course-article {
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
    }

    .course-image {
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