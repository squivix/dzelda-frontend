<template>
    <base-card title="Add Lesson" class="add-lesson-base-card">
        <template v-slot:content>
            <form class="add-lesson-form" @submit.prevent="addLesson">

                <label for="lesson-course">Course</label>
                <select required id="lesson-course" v-model="selectedCourse">
                    <option value="" disabled selected>Select course</option>
                    <option v-for="course in editableCourses" :key="course.id" :value="course.id">
                        {{course.title}}
                    </option>
                </select>
                <label for="lesson-title">Title</label>
                <input id="lesson-title" type="text" placeholder="Lesson Title" v-model="title" required>

                <label for="lesson-text">Text</label>
                <textarea placeholder="Lesson Text" id="lesson-text" v-model="text" required></textarea>

                <!--                <label for="is-public-checkbox" class="checkbox-label">-->
                <!--                    <input type="checkbox" id="is-public-checkbox" v-model="isPublic" checked>-->
                <!--                    Public</label>-->
                <div class="buttons-div">
                    <button id="save-button" type="submit" class="button-hollow">Save</button>
                    <button id="save-and-open-button" type="submit" class="primary-button">Save & open</button>
                </div>
            </form>

        </template>
    </base-card>
</template>

<script>
    import BaseCard from "@/components/ui/BaseCard";

    export default {
        name: "LessonAddPage",
        components: {BaseCard},
        data() {
            return {
                editableCourses: null,
                selectedCourse: "",
                title: "",
                text: "",
            };
        },
        methods: {
            async fetchEditableCourses() {
                this.editableCourses = await this.$store.dispatch("fetchEditableCourses");
            },

            async addLesson(event) {
                this.$store.dispatch("postLesson", {
                    course: this.selectedCourse,
                    title: this.title,
                    text: this.text,
                }).then(async (newLesson) => {
                    await this.$store.dispatch("postUserLesson", {lessonId: newLesson.id})
                    if (event.submitter.id === "save-button") {
                        this.$router.push({
                            name: 'edit-lesson',
                            params: {learningLanguage: this.$route.params.learningLanguage, lessonId: newLesson.id}
                        })
                    } else if (event.submitter.id === "save-and-open-button") {
                        this.$router.push({
                            name: 'lesson',
                            params: {learningLanguage: this.$route.params.learningLanguage, lessonId: newLesson.id}
                        })
                    }
                });
            }
        },
        async mounted() {
            await this.fetchEditableCourses();
        }
    }


</script>

<style scoped>
    .add-lesson-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        margin-bottom: 5vh;

        display: flex;
        flex-direction: column;
        row-gap: 1.25rem;
        justify-content: flex-start;
        align-items: stretch;
    }

    .add-lesson-base-card:deep(header) {
        margin-bottom: 1rem;
    }

    .add-lesson-form {
        display: flex;
        flex-direction: column;
    }

    .add-lesson-form label {
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
    }

    .add-lesson-form input, .add-lesson-form select, .add-lesson-form textarea {
        margin-bottom: 1rem;
        font-size: 1rem;
    }

    #lesson-text {
        resize: none;
        height: 35vh;
    }

    .checkbox-label {
        margin-bottom: 1rem;
    }

    .buttons-div {
        display: flex;
        flex-direction: row;
        column-gap: 0.25rem;
    }
</style>