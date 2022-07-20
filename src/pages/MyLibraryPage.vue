<template>
    <base-card title="My Library" class="library-base-card">
        <template v-slot:content>
            <div class="top-bar">
                <select class="course-lesson-select" v-model="showListOf">
                    <option name="lessons">Lessons</option>
                    <option name="courses">Courses</option>
                </select>
                <div class="search-filter">
                    <form class="search-filter" @submit.prevent="search">
                        <input type="text" class="search-input" placeholder="Search" v-model.trim="searchQuery">
                        <button type="button" class="search-button">
                            <font-awesome-icon icon="magnifying-glass"></font-awesome-icon>
                        </button>
                    </form>
                    <button type="button" class="filter-button">
                        <font-awesome-icon icon="filter"></font-awesome-icon>
                    </button>
                </div>
            </div>
            <div v-if="loading">

            </div>
            <ol class="lesson-list" v-else-if="showListOf==='Lessons'">
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
            <!--suppress JSUnresolvedVariable -->
            <pagination-controls
                    v-if="pageCount"
                    :page-count="pageCount"
                    :maxPerPage="maxPerPage"
                    :current-page="currentPage"
                    :per-page-select-label="`${showListOf} Per Page`"
                    :per-page-select-options="PER_PAGE_SELECT_OPTIONS">
            </pagination-controls>
        </template>
    </base-card>
</template>
<script>
    import BaseCard from "@/components/ui/BaseCard";
    import LessonListItem from "@/components/content/LessonListItem";
    import CourseCard from "@/components/content/CourseCard";
    import PaginationControls from "@/components/ui/PaginationControls";
    import {paginationControlsHost} from "@/components/ui/PaginationControls";
    import {mergeDeep} from "@/utils";

    let MyLibraryPage = {
        name: "MyLibraryPage",
        components: {PaginationControls, LessonListItem, CourseCard, BaseCard},
        data() {
            return {
                lessons: null,
                courses: null,
                showListOf: "Lessons",
                searchQuery: null,
                pageCount: 0,
                loading: true,
                PER_PAGE_SELECT_OPTIONS: [10, 15, 20, 50]
            };
        },
        async mounted() {
            await this.fetchContent();
        },
        watch: {
            async currentPage() {
                await this.fetchContent();
            },
            async maxPerPage() {
                if (this.currentPage === 1)
                    await this.fetchContent();
            },
            async showListOf() {
                if (this.currentPage === 1)
                    await this.fetchContent();
                else
                    this.currentPage = 1;
            }
        },
        methods: {
            async fetchContent() {
                this.loading = true;
                if (this.showListOf === "Lessons")
                    await this.fetchLessons();
                else if (this.showListOf === "Courses")
                    await this.fetchSavedCourses();
                this.loading = false;
            },
            async fetchLessons() {
                const response = await this.$store.dispatch("fetchUserLessonsPage",
                    {
                        language: this.$route.params.learningLanguage,
                        page: this.currentPage,
                        maxPerPage: this.maxPerPage
                    });
                this.lessons = response.results;
                this.pageCount = Math.ceil(response.count / this.maxPerPage);
            },
            async fetchSavedCourses() {
                const response = await this.$store.dispatch("fetchSavedCourses", {
                    language: this.$route.params.learningLanguage,
                    page: this.currentPage,
                    maxPerPage: this.maxPerPage
                });
                this.courses = response.results;
                this.pageCount = Math.ceil(response.count / this.maxPerPage);
            }
        }
    }
    MyLibraryPage = mergeDeep(MyLibraryPage, paginationControlsHost)
    export default MyLibraryPage;
</script>

<style scoped>
    .library-base-card {
        display: flex;
        flex-direction: column;
        row-gap: 1.25rem;
        justify-content: flex-start;
        align-items: stretch;
        margin-left: 2vw;
        margin-right: 2vw;
        margin-bottom: 5vh;
    }

    .library-base-card:deep(header) {
        margin-bottom: 1rem;
    }

    .top-bar {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        column-gap: 0.5vw;
    }


    .course-lesson-select {
        flex-basis: 10rem;
    }


    .search-filter {
        display: flex;
        flex-direction: row;
        column-gap: 0.2rem;
    }

    .search-input {
        flex-grow: 2;
    }

    .search-button {
        width: 30px;
        height: 30px;
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