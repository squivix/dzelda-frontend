<template>
    <base-card title="My Library" class="library-base-card">
        <template v-slot:content>
            <form class="top-bar">
                <select class="course-lesson-select" v-model="showListOf">
                    <option name="lessons">Lessons</option>
                    <option name="courses">Courses</option>
                </select>
                <input type="text" class="search-input" placeholder="Search">
                <button type="button" class="search-button">
                    <font-awesome-icon icon="magnifying-glass"></font-awesome-icon>
                </button>
                <button type="button" class="filter-button">
                    <font-awesome-icon icon="filter"></font-awesome-icon>
                </button>
            </form>

            <ol class="lesson-list" v-if="showListOf==='Lessons'">
                <li v-for="lesson in lessons" :key="lesson.id">
                    <lesson-list-item
                            :lesson="lesson">
                    </lesson-list-item>
                </li>
            </ol>

            <ol class="course-list" v-else>
                <li v-for="course in courses" :key="course.id">
                    <course-card
                            :course="course">
                    </course-card>
                </li>
            </ol>
        </template>

    </base-card>
</template>
<script>
    import BaseCard from "@/components/ui/BaseCard";
    import LessonListItem from "@/components/my-library/LessonListItem";
    import CourseCard from "@/components/my-library/CourseCard";

    export default {
        name: "MyLibraryPage",
        components: {LessonListItem, CourseCard, BaseCard},
        data() {
            return {
                lessons: null,
                courses: null,
                showListOf: "Lessons"
            };
        },
        async mounted() {
            await this.fetchSavedCourses();
            await this.fetchLessons();
        },
        methods: {
            async fetchLessons() {
                const user_lessons = await this.$store.dispatch("fetchUserLessons");
                const course_map = {};
                for (let course of this.courses)
                    course_map[course.id] = course;
                for (let i = 0; i < user_lessons.length; i++)
                    user_lessons[i].course = course_map[user_lessons[i].course]
                this.lessons = user_lessons;
            },
            async fetchSavedCourses() {
                const user_courses = await this.$store.dispatch("fetchSavedCourses");
                this.courses = user_courses;
            }
        }
    }
</script>

<style scoped>
    .library-base-card {
        margin-left: 2vw;
        margin-right: 2vw;
        display: flex;
        flex-direction: column;
        row-gap: 1.25rem;
        justify-content: flex-start;
        align-items: stretch;
    }

    .library-base-card:deep(header) {
        margin-bottom: 1rem;
    }

    .top-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        column-gap: 0.5vw;
    }

    .course-lesson-select {
        flex-grow: 1;
    }

    .search-input {
        flex-grow: 2;
    }

    .search-button {
        flex-basis: 30px;
        border-radius: 50%;
        background-color: var(--primary-color);
        border: 1px solid var(--on-primary-color);
    }

    .search-button svg {
        color: var(--on-primary-color);
    }

    .filter-button {
        border: 2px solid gray;
        border-radius: 5px;
    }


    .lesson-list {
        display: flex;
        flex-direction: column;
        row-gap: 0.5rem;
    }

    .course-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(275px, 1fr));
        grid-row-gap: 1rem;
        grid-column-gap: 0.75rem;
    }

    .course-list li {
        max-width: 400px;
    }
</style>