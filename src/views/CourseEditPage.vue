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


                <label for="lesson-table">Lessons</label>
                <table id="lesson-table" class="">
                    <thead class="lesson-thead">
                    <th class="centered-table-col"><input type="checkbox" @change="selectAllLessons"></th>
                    <th class="centered-table-col"></th>
                    <th>Title</th>
                    </thead>

                    <draggable
                            tag="tbody"
                            class="lesson-rows"
                            handle=".handle"
                            v-model="lessons">
                        <tr v-for="lesson in lessons" :key="lesson.id">
                            <td class="centered-table-col">
                                <input type="checkbox" :value="lesson.id" v-model="selectedLessons">
                            </td>
                            <td class="handle centered-table-col">
                                <font-awesome-icon icon="grip-lines"></font-awesome-icon>
                            </td>
                            <td>
                                <router-link
                                        :to="{name:'edit-lesson', params:{learningLanguage:$route.params.learningLanguage, lessonId:lesson.id}}">
                                    {{lesson.title}}
                                </router-link>
                            </td>
                        </tr>
                    </draggable>
                </table>


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
import BaseCard from "@/components/ui/BaseCard.vue";
import {VueDraggableNext} from 'vue-draggable-next'
import {useCourseStore} from "@/stores/course.js";

export default {
        name: "CourseEditPage",
        components: {
            BaseCard,
            draggable: VueDraggableNext,
        },
        data() {
            return {
                title: null,
                description: null,
                isPublic: true,
                lessons: null,
                selectedLessons: []
            };
        },
        methods: {
            onSubmit() {
                this.editCourse();
                this.$router.push({name: 'course', ...this.$route.params})
            },
            async editCourse() {
                await this.courseStore.updateCourse({
                    id: this.$route.params.courseId,
                    title: this.title,
                    description: this.description,
                    isPublic: this.isPublic,
                    lessonIds: this.lessons.map(lesson => lesson.id)
                })
            },

            selectAllLessons(event) {
                if (event.target.checked)
                    this.selectedLessons = this.lessons.map((lesson) => lesson.id);
                else
                    this.selectedLessons = [];
            },
            async fetchCourse() {
                return await this.courseStore.fetchCourse({
                    courseId: this.$route.params.courseId,
                });
            },
            async fetchCourseLessons() {
                return await this.courseStore.fetchCourseLessons({
                    courseId: this.$route.params.courseId,
                });
            }

        },
        async mounted() {
            const course = await this.fetchCourse();
            this.title = course.title;
            this.description = course.description;
            this.isPublic = course.isPublic;
            this.lessons = await this.fetchCourseLessons();
        },
        created() {
            this.courseStore = useCourseStore();
        }
    }
</script>

<style scoped>

    .edit-course-base-card {
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

    .edit-course-form input:not([type='checkbox']), .edit-course-form select, .edit-course-form textarea, #lesson-table {
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

    .lesson-thead th:not(.centered-table-col) {
        text-align: start;
        vertical-align: middle;
        font-weight: bold;
    }

    .lesson-rows tr:nth-child(odd) {
        background-color: whitesmoke;
    }

    .lesson-rows td {
        vertical-align: middle;
        padding: 0.5rem 0.1rem;
    }

    .centered-table-col {
        text-align: center;
    }

</style>