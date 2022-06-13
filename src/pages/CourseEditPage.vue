<template>
    <base-card title="Edit Course" class="edit-course-base-card">
        <template v-slot:content>
            <form class="edit-course-form" @submit.prevent="onSubmit">
                <label for="course-title">Title</label>
                <input id="course-title" type="text" placeholder="Course Title" v-model="title" required>
                <label for="course-description">Description</label>
                <textarea id="course-description" placeholder="Course Description" v-model="description"></textarea>

                <!--TODO:make into component with auto complete -->
                <!--<label for="course-tags">Tags</label>-->
                <!--<input id="course-tags" placeholder="Course Tags">-->

                <label for="course-lessons">Lessons</label>
                <ol id="course-lessons">
                    <li v-for="lesson in lessons" :key="lesson">
                        {{lesson.title}}
                    </li>
                </ol>
                <label for="is-public-checkbox" class="checkbox-label">
                    <input type="checkbox" id="is-public-checkbox" v-model="isPublic" checked>
                    Public
                </label>
                <button id="save-button" type="submit" class="primary-button">Save</button>
            </form>

        </template>
    </base-card>
</template>

<script>
    import BaseCard from "@/components/ui/BaseCard";

    export default {
        name: "CourseEditPage",
        components: BaseCard,
        data() {
            return {
                title: null,
                description: null,
                isPublic: true,
                lessons: null
            };
        },
        methods: {
            onSubmit() {
                this.editCourse();
            },
            async editCourse() {

            },
            async fetchCourse() {
                return await this.$store.dispatch("fetchCourse", {
                    courseId: this.$route.params.courseId,
                    languageCode: this.$route.params.learningLanguage,
                });
            },
            async fetchCourseLessons() {
                return await this.$store.dispatch("fetchCourseLessons", {
                    courseId: this.$route.params.courseId,
                });
            }

        },
        async mounted() {
            const course = await this.fetchCourse();
            this.title = course.title;
            this.description = course.description;
            this.isPublic = course.is_public;
            this.lessons = await this.fetchCourseLessons();
            console.log(this.lessons)
        }
    }
</script>

<style scoped>

    .edit-course-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        margin-bottom: 5vh;

        display: flex;
        flex-direction: column;
        row-gap: 1.25rem;
        justify-content: flex-start;
        align-items: stretch;
    }

    .edit-course-base-card:deep(header) {
        margin-bottom: 1rem;
    }

    .edit-course-form {
        display: flex;
        flex-direction: column;
    }

    .edit-course-form label {
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
    }

    .edit-course-form input, .edit-course-form select, .edit-course-form textarea {
        margin-bottom: 1rem;
        font-size: 1rem;
    }

    .checkbox-label {
        margin-bottom: 1rem;
    }

    #save-button {
        align-self: flex-start;
    }

    #course-description {
        resize: none;
        height: 15vh;
    }
</style>