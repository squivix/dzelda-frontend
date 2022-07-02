<template>
    <base-card v-if="!loading">
        <template v-slot:all>
            <the-lesson-content
                    @onWordClicked="setSelectedWord"
                    @onBackgroundClicked="clearSelectedWord"
                    :title="lesson.title"
                    :text="lesson.text"
                    :words="words"
                    class="lesson-content">
            </the-lesson-content>
            <the-meaning-panel
                    class="meaning-panel"
                    :word="selectedWord"
                    @onMeaningAdded="onMeaningAdded"
                    @onWordLevelSet="onWordLevelSet"
                    @onMeaningDeleted="onMeaningDeleted">
            </the-meaning-panel>
        </template>
    </base-card>
</template>
<script>
    import TheLessonContent from '../components/reader/TheLessonContent.vue';
    import TheMeaningPanel from '../components/reader/TheMeaningPanel.vue';
    import {WORD_LEVELS} from "@/constants";

    export default {
        name: "LessonReader.vue",
        components: {TheLessonContent, TheMeaningPanel},
        data() {
            return {
                loadingLesson: true,
                loadingWords: true,
                lesson: null,
                words: {},
                selectedWord: null,
            };
        },
        async created() {
            await this.fetchLesson();
            await this.fetchWordsLevels();
        },
        computed: {
            loading() {
                return this.loadingLesson || this.loadingWords;
            },
        },
        methods: {
            async fetchLesson() {
                this.loadingLesson = true;
                this.lesson = await this.$store.dispatch("fetchLesson", {
                    lessonId: this.$route.params.lessonId,
                    languageCode: this.$route.params.learningLanguage
                });
                this.lesson.text = this.lesson.text.replace(/[\r\n]{3,}/g, '\n\n');
                this.loadingLesson = false;
            },
            async fetchWordsLevels() {
                this.loadingWords = true;
                this.words = await this.$store.dispatch("fetchLessonWords", {lessonId: this.$route.params.lessonId});
                this.loadingWords = false;
            },

            setSelectedWord(word) {
                this.selectedWord = {text: word, ...this.words[word.toLowerCase()]};
            },
            clearSelectedWord() {
                this.selectedWord = null;
            },


            onMeaningAdded(word, new_meaning) {
                const key = word.text.toLowerCase();
                this.onWordLevelSet(word, word.level);
                this.words[key].user_meanings.push(new_meaning);
                this.words[key].id = word.id;
                this.setSelectedWord(word.text);
            },
            onWordLevelSet(word, level) {
                this.words[word.text.toLowerCase()].level = level;
                if (level === WORD_LEVELS.IGNORED || level === WORD_LEVELS.KNOWN) {
                    this.words[word.text.toLowerCase()].user_meanings = [];
                    this.clearSelectedWord();
                } else
                    this.setSelectedWord(word.text);
            },
            onMeaningDeleted(word, deleted_meaning) {
                const index = word.user_meanings.findIndex((meaning) => meaning.id === deleted_meaning.id)
                word.user_meanings.splice(index, 1);
                if (word.user_meanings.length === 0)
                    this.onWordLevelSet(word, WORD_LEVELS.NEW);
            }
        },
    };
</script>
<style>
    body {
        user-select: none;
    }
</style>
<style scoped>
    .base-card {
        width: 80vw;
        display: grid;
        grid-template-columns: 2fr 1.3fr;
        grid-template-rows: 75vh;
        margin: auto;
        column-gap: 2rem;
        border-radius: 20px;
        max-width: 1300px;
        padding: 40px min(5vw, 20px);
    }

    .lesson-content {
    }

    .meaning-panel {
    }
</style>