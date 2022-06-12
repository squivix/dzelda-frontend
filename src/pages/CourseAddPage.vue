<template>
    <base-card title="Add Course" class="add-course-base-card">
        <template v-slot:content>
            <form class="add-course-form" @submit.prevent="onSubmit">
                <label for="course-title">Title</label>
                <input id="course-title" type="text" placeholder="Course Title" v-model="title" required>
                <label for="course-description">Description</label>
                <textarea id="course-description" placeholder="Course Description" v-model="description"></textarea>

                <!--TODO:make into component with auto complete -->
                <!--<label for="course-tags">Tags</label>-->
                <!--<input id="course-tags" placeholder="Course Tags">-->

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
        name: "CourseAddPage",
        components: BaseCard,
        data() {
            return {
                title: null,
                description: null,
                isPublic: true,
            };
        },
        methods: {
            onSubmit() {
                this.addCourse();
            },

            async addCourse() {
                this.$store.dispatch("postCourse", {
                    languageCode: this.$route.params.learningLanguage,
                    title: this.title,
                    description: this.description,
                    isPublic: this.isPublic,
                })
            }
        }
    }
</script>

<style scoped>

    .add-course-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        margin-bottom: 5vh;

        display: flex;
        flex-direction: column;
        row-gap: 1.25rem;
        justify-content: flex-start;
        align-items: stretch;
    }

    .add-course-base-card:deep(header) {
        margin-bottom: 1rem;
    }

    .add-course-form {
        display: flex;
        flex-direction: column;
    }

    .add-course-form label {
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
    }

    .add-course-form input, .add-course-form select, .add-course-form textarea {
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