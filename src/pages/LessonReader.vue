<template>
    <base-card v-if="!loading">
        <template v-slot:all>
            <the-lesson-content
                    @onWordClicked="setSelectedWord"
                    @onBackgroundClicked="clearSelectedWord"
                    :title="lesson.title"
                    :text="lesson.text"
                    :words="words"
                    class="lesson-content"
            >
            </the-lesson-content>
            <the-meaning-panel
                    class="meaning-panel"
                    :word="selectedWord"
                    @onNewMeaningSelected="onNewMeaningSelected"
                    @onCancelNewMeaning="onCancelNewMeaning"
                    @onWordLevelSet="onWordLevelSet"
            >
            </the-meaning-panel>
        </template>
    </base-card>
</template>
<script>
    import TheLessonContent from '../components/reader/TheLessonContent.vue';
    import TheMeaningPanel from '../components/reader/TheMeaningPanel.vue';

    export default {
        components: {
            TheLessonContent,
            TheMeaningPanel,
        },
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
            this.fetchLesson();
            this.fetchWordsLevels();
        },
        computed: {
            loading() {
                return this.loadingLesson || this.loadingWords;
            },
        },
        methods: {
            async fetchLesson() {
                this.loadingLesson = true;
                const response = await fetch(
                    `${this.$store.getters.baseUrl}/lessons/${this.$route.params.lessonId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Token ${this.$store.getters.getUserToken}`,
                        },
                    }
                );
                if (response.ok) {
                    const responseData = await response.json();
                    this.lesson = responseData;
                    this.lesson.text = this.lesson.text.replace(/[\r\n]{3,}/g, '\n\n');
                    this.loadingLesson = false;
                }
            },
            async fetchWordsLevels() {
                this.loadingWords = true;
                const response = await fetch(
                    `${this.$store.getters.baseUrl}/lessons/${this.$route.params.lessonId}/words`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Token ${this.$store.getters.getUserToken}`,
                        },
                    }
                );
                if (response.ok) {
                    const responseData = await response.json();
                    this.words = responseData;
                    this.loadingWords = false;
                }
            },

            setSelectedWord(word) {
                this.selectedWord = {text: word, ...this.words[word.toLowerCase()]};
            },
            clearSelectedWord() {
                this.selectedWord = null;
            },
            onNewMeaningSelected(word, meaning) {
                word = this.words[word.text];
                if (word.level === 0) word.level = 1;
                word.user_meanings.push(meaning);
                this.clearSelectedWord();
            },
            onCancelNewMeaning(word) {
                this.words[word.text] = word;
            },
            onWordLevelSet(word, level) {
                this.words[word.text.toLowerCase()].level = word.level = level;
                if (level === -1) {
                    this.words[word.text.toLowerCase()].user_meanings = [];
                    this.clearSelectedWord();
                }
            },
        },
    };
</script>

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